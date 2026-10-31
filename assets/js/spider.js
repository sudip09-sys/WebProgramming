/* Original orb-weaver animation. Decorative only: never captures pointer input. */
(() => {
  'use strict';
  if (window.__sudipSpiderInstalled) return;
  window.__sudipSpiderInstalled = true;
  const canvas = document.createElement('canvas');
  canvas.id = 'sudip-spider'; canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none!important;z-index:800;contain:strict;';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer:fine)');
  const button = document.createElement('button');
  button.type = 'button'; button.id = 'sudip-spider-toggle';
  button.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:801;min-height:36px;padding:7px 12px;border:1px solid #8e809966;border-radius:22px;font:11px/1.3 system-ui,sans-serif;cursor:pointer;box-shadow:0 3px 16px #0002;';
  let hidden = false;
  try { hidden = localStorage.getItem('sudip-spider-hidden') === '1'; } catch {}
  let width=0,height=0,dpr=1,x=0,y=0,vx=0,vy=0,tx=0,ty=150,angle=Math.PI;
  let raf=0,last=0,clock=0,gait=0,lastThread=0,idle=0,lastWeb=-10,hasPointer=false;
  let pointerX=0,pointerY=0;const poses=[];let idlePose;
  let silk='rgba(214,201,225,.25)',dark=true;
  const threads=[], webs=[];
  function palette() {
    const backgrounds=[document.body,document.documentElement].map(el=>getComputedStyle(el).backgroundColor.match(/[\d.]+/g));
    const color=backgrounds.find(c=>c&&Number(c[3]??1)>.5)||['255','255','255'];
    dark=(Number(color[0])*.2126+Number(color[1])*.7152+Number(color[2])*.0722)<135;
    silk=dark?'rgba(215,204,227,.27)':'rgba(91,71,63,.25)';
    button.style.background=dark?'#211d28':'#faf6ef';button.style.color=dark?'#ece5f0':'#433735';
  }
  function allowed() { return !hidden&&!reduced.matches&&!document.hidden&&!document.body.classList.contains('motion-paused'); }
  function sync() {
    cancelAnimationFrame(raf);raf=0;last=0;
    canvas.hidden=!allowed();
    button.textContent=hidden?'Show spider':'Hide spider';button.setAttribute('aria-pressed',String(!hidden));
    button.hidden=reduced.matches;palette();
    if(allowed())raf=requestAnimationFrame(frame);
  }
  function resize() {
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    if(!x){x=width*.82;y=135;tx=x;}
    x=Math.max(45,Math.min(width-45,x));y=Math.max(65,Math.min(height-55,y));
    tx=Math.max(45,Math.min(width-45,tx));ty=Math.max(75,Math.min(height-65,ty));
    webs.length=0;threads.length=0;ctx.setTransform(dpr,0,0,dpr,0,0);sync();
  }
  function pointer(e) {
    if(e.pointerType==='touch'||!fine.matches)return;
    hasPointer=true;pointerX=e.clientX;pointerY=e.clientY;tx=Math.max(48,Math.min(width-48,e.clientX-24));ty=Math.max(65,Math.min(height-55,e.clientY-32));
  }
  function strokePath(points,color,lineWidth,painter=ctx) {
    painter.beginPath();points.forEach((p,i)=>i?painter.lineTo(p[0],p[1]):painter.moveTo(p[0],p[1]));painter.strokeStyle=color;painter.lineWidth=lineWidth;painter.stroke();
  }
  function makeWeb(){
    const r=55+Math.min(width,800)*.06,spokes=new Path2D(),spiral=new Path2D();
    for(let i=0;i<12;i++){const a=i*Math.PI/6;spokes.moveTo(0,0);spokes.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
    for(let a=0;a<Math.PI*10;a+=.07){const radius=7+a/(Math.PI*10)*(r-13),px=Math.cos(a)*radius,py=Math.sin(a)*radius;if(a===0)spiral.moveTo(px,py);else spiral.lineTo(px,py);}
    return {x,y,r,rotation:clock*.3,born:clock,spokes,spiral};
  }
  function web(w){
    const age=clock-w.born,life=Math.min(1,age/.7)*Math.min(1,(50-age)/8);if(life<=0)return;
    const near=hasPointer?Math.max(0,1-Math.hypot(pointerX-w.x,pointerY-w.y)/(w.r*1.8)):0;
    const spring=Math.sin(age*8)*Math.exp(-age*1.3)*.035;
    ctx.save();ctx.translate(w.x+(pointerX-w.x)*near*.035,w.y+(pointerY-w.y)*near*.035);ctx.rotate(w.rotation+Math.sin(clock*1.8+w.born)*.012+spring);
    ctx.scale(1+spring,1-spring);ctx.globalAlpha=life;ctx.strokeStyle=silk;ctx.lineWidth=.65;ctx.stroke(w.spokes);
    if(age<1.6){ctx.beginPath();ctx.arc(0,0,Math.min(w.r,age/1.6*w.r),0,Math.PI*2);ctx.clip();}ctx.lineWidth=.6;ctx.stroke(w.spiral);
    if(near>.25){ctx.globalAlpha=near*.5;ctx.fillStyle=dark?'#d6c5e1':'#886c54';for(let i=0;i<3;i++){const a=clock*.7+i*2.1;ctx.beginPath();ctx.arc(Math.cos(a)*w.r*.65,Math.sin(a)*w.r*.65,1.1,0,Math.PI*2);ctx.fill();}}
    ctx.restore();
  }
  function paintSpider(ctx,phase,amplitude) {
    ctx.save();
    const line=(points,color,lineWidth)=>strokePath(points,color,lineWidth,ctx);
    ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=4;ctx.shadowOffsetY=3;
    for(const side of [-1,1])for(let i=0;i<4;i++) {
      const step=Math.sin(phase+i*Math.PI*.82+(side===1?Math.PI:0))*amplitude;
      const hip=[side*5,-9+i*5],knee=[side*(22+(i===1||i===2?7:0)),[-26,-10,15,29][i]+step];
      const toe=[side*[28,43,42,27][i]+step*.5,[-48,-28,34,51][i]+step*1.4];
      const pts=[hip,knee,toe];line(pts,'#30241d',3.8);ctx.shadowBlur=0;line(pts,'#ac9169',1.9);
      for(let seg=0;seg<2;seg++)for(let j=1;j<=7;j++) {
        const t=j/8,a=pts[seg],b=pts[seg+1],px=a[0]+(b[0]-a[0])*t,py=a[1]+(b[1]-a[1])*t;
        const nx=-(b[1]-a[1]),ny=b[0]-a[0],len=Math.hypot(nx,ny),hair=2+(j%3);
        line([[px,py],[px+nx/len*hair,py+ny/len*hair]],'rgba(193,174,140,.7)',.45);
        line([[px,py],[px-nx/len*hair,py-ny/len*hair]],'rgba(116,94,67,.8)',.5);
        if(j%2===0)line([[px-1,py],[px+1,py+1]],'#443427',1.8);
      }
      ctx.fillStyle='#b49b73';ctx.beginPath();ctx.arc(knee[0],knee[1],2,0,Math.PI*2);ctx.fill();
    }
    const abdomen=ctx.createRadialGradient(-4,7,1,0,13,19);abdomen.addColorStop(0,'#c7b48a');abdomen.addColorStop(.4,'#8b7656');abdomen.addColorStop(.8,'#4e3e2f');abdomen.addColorStop(1,'#2a211b');
    ctx.fillStyle=abdomen;ctx.beginPath();ctx.ellipse(0,13,11,17,0,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.ellipse(0,13,10.5,16.5,0,0,Math.PI*2);ctx.clip();
    for(let i=0;i<6;i++){const yy=i*5-1;line([[-10,yy+3],[-4,yy],[0,yy+2],[4,yy],[10,yy+3]],i%2?'#d0bd92':'#514130',i%2?2:2.8);}
    line([[0,-1],[-1,10],[0,24]],'#e2d5b4',1.4);ctx.restore();
    const head=ctx.createRadialGradient(-2,-9,1,0,-6,10);head.addColorStop(0,'#b9a37e');head.addColorStop(.5,'#756044');head.addColorStop(1,'#35281f');ctx.fillStyle=head;
    ctx.beginPath();ctx.ellipse(0,-7,7.3,10,0,0,Math.PI*2);ctx.fill();
    line([[-3,-14],[-3,-5],[0,0],[3,-5],[3,-14]],'#d7c8a1',1.1);
    for(let i=0;i<38;i++){const a=i*2.399,r=i%2?11:10;line([[Math.cos(a)*r,13+Math.sin(a)*16],[Math.cos(a)*(r+2),13+Math.sin(a)*18]],'#c4b08a77',.45);}
    for(const side of [-1,1]){ctx.fillStyle='#241c18';ctx.beginPath();ctx.ellipse(side*2,-15,1.7,2.1,0,0,Math.PI*2);ctx.fill();line([[side*4,-13],[side*7,-18],[side*5,-21]],'#b09a72',1.5);}
    ctx.restore();
  }
  function makePose(phase,amplitude){
    const tile=document.createElement('canvas');tile.width=180;tile.height=210;
    const painter=tile.getContext('2d');painter.scale(1.5,1.5);painter.translate(60,65);paintSpider(painter,phase,amplitude);return tile;
  }
  function preparePoses(){idlePose=makePose(0,.35);let i=0;
    function batch(deadline){let count=0;while(i<24&&count<3){poses.push(makePose(i/24*Math.PI*2,4));i++;count++;if(deadline&&deadline.timeRemaining()<3)break;}if(i<24)queue();}
    function queue(){if('requestIdleCallback' in window)requestIdleCallback(batch,{timeout:150});else setTimeout(()=>batch(null),16);}queue();
  }
  function spider(speed){
    const pose=speed>14&&poses.length===24?poses[Math.floor(gait/(Math.PI*2)*24)%24]:idlePose;
    if(!pose)return;ctx.save();ctx.translate(x,y);ctx.rotate(angle);const scale=width<600?.7:1;
    ctx.scale(scale,scale*(1+Math.sin(clock*2.2)*.009));ctx.drawImage(pose,-60,-65,120,140);ctx.restore();
  }
  function frame(now) {
    if(!allowed()){raf=0;return;}
    raf=requestAnimationFrame(frame);
    const dt=Math.min((now-(last||now-16))/1000,.045);last=now;clock+=dt;
    if(!fine.matches||!hasPointer){tx=width*.83+Math.sin(clock*.6)*7;ty=135+Math.sin(clock*.8)*8;}
    vx+=(tx-x)*95*dt;vy+=(ty-y)*95*dt;const damping=Math.exp(-16*dt);vx*=damping;vy*=damping;
    x=Math.max(40,Math.min(width-40,x+vx*dt));y=Math.max(55,Math.min(height-45,y+vy*dt));const speed=Math.hypot(vx,vy);gait+=speed*dt*.1;
    const desired=speed>8?Math.atan2(vy,vx)+Math.PI/2:Math.PI;
    angle+=Math.atan2(Math.sin(desired-angle),Math.cos(desired-angle))*Math.min(1,dt*9);
    if(speed>13&&clock-lastThread>.2){threads.push({x,y,born:clock});if(threads.length>100)threads.shift();lastThread=clock;}
    idle=speed<12?idle+dt:0;
    if(idle>.65&&clock-lastWeb>5.5&&fine.matches){webs.push(makeWeb());if(webs.length>3)webs.shift();lastWeb=clock;idle=0;}
    while(threads.length&&clock-threads[0].born>35)threads.shift();while(webs.length&&clock-webs[0].born>50)webs.shift();
    ctx.clearRect(0,0,width,height);webs.forEach(web);
    ctx.strokeStyle=silk;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(width*.83,0);ctx.quadraticCurveTo(x-vx*.2,y*.45,x,y);ctx.stroke();
    if(threads.length>1){ctx.beginPath();threads.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();}
    spider(speed);
  }
  button.addEventListener('click',()=>{hidden=!hidden;try{localStorage.setItem('sudip-spider-hidden',hidden?'1':'0');}catch{}sync();});
  document.body.append(canvas,button);
  window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);fine.addEventListener('change',sync);
  let paletteTimer=0;
  function themeChanged(){sync();clearTimeout(paletteTimer);paletteTimer=setTimeout(palette,400);}
  new MutationObserver(themeChanged).observe(document.body,{attributes:true,attributeFilter:['class','data-theme','style']});
  new MutationObserver(themeChanged).observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme','style']});
  preparePoses();resize();
})();
