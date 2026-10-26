import {installTextReveal} from './text-reveal.mjs?v=20261024sessions';
import {storage} from './shared.mjs?v=20261024sessions';
import {spherePoints,projectPoint,motionAllowed} from './motion-math.mjs?v=20261024sessions';
export function startExperience(){
  const canvas=document.createElement('canvas');canvas.id='ambient-code';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
  const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=storage.get('pause-motion',false),width=0,height=0,raf=0,last=0,time=0,hero=null,heroVisible=false;
  const textReveal=installTextReveal(()=>paused||reduced.matches||document.hidden);
  const points=spherePoints(150),tokens=['const','{ }','=>','return','await','01','build()','</>','let','[ ]',';','map()'];
  const globalButton=document.createElement('button');globalButton.id='global-motion';globalButton.className='global-motion';document.body.append(globalButton);
  function sync(){
    const stopped=paused||reduced.matches;
    document.body.classList.toggle('motion-paused',stopped);
    document.querySelectorAll('#motion-toggle,#global-motion').forEach(b=>{b.setAttribute('aria-pressed',String(stopped));const label=stopped?'▶ Resume motion':'❚❚ Pause motion';if(b.textContent!==label)b.textContent=label;b.title=reduced.matches?'Your device prefers reduced motion. Disable that preference to enable animations.':label;});
  }
  function draw(){
    if(!ctx)return;
    ctx.clearRect(0,0,width,height);
    if(!hero)return;
    const mobile=width<700,radius=Math.min(width*(mobile?.28:.19),height*.27,240),cx=width*(mobile?.73:.79),cy=height*(mobile?.35:.49);
    const projected=points.map((p,i)=>({...projectPoint(p,time*.065,radius,cx,cy),i})).sort((a,b)=>a.depth-b.depth);
    ctx.textAlign='center';ctx.textBaseline='middle';
    for(const p of projected){
      ctx.font=(8+p.depth*3)+'px monospace';
      const alpha=(.07+p.depth*.38)*(mobile?.32:1);
      ctx.fillStyle=p.i%5===0?'rgba(187,213,211,'+alpha+')':'rgba(196,177,210,'+alpha+')';
      ctx.fillText(tokens[p.i%tokens.length],p.x,p.y);
    }
    ctx.strokeStyle='rgba(184,169,198,'+(mobile?.06:.14)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(cx,cy,radius*1.3,radius*.38,-.36,0,Math.PI*2);ctx.stroke();
  }
  function canAnimate(){return ctx&&hero&&heroVisible&&!hero.querySelector('.hero-emblem')&&motionAllowed(paused,reduced.matches,document.hidden);}
  function frame(now){
    if(!canAnimate()){raf=0;return;}
    if(!last||now-last>=40){time+=last?Math.min((now-last)/1000,.1):0;last=now;draw();}
    raf=requestAnimationFrame(frame);
  }
  function schedule(){cancelAnimationFrame(raf);raf=0;last=0;if(canAnimate())raf=requestAnimationFrame(frame);}
  const heroObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.target===hero)heroVisible=entry.isIntersecting;schedule();});
  function resize(){
    const next=document.body.classList.contains('landing')?document.querySelector('.code-hero'):null;
    if(next!==hero){if(hero)heroObserver.unobserve(hero);hero=next;if(hero)heroObserver.observe(hero);}
    canvas.hidden=!hero;
    if(!hero){if(ctx)ctx.clearRect(0,0,width,height);heroVisible=false;schedule();return;}
    const rect=hero.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
    width=rect.width;height=rect.height;heroVisible=rect.bottom>0&&rect.top<innerHeight;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    Object.assign(canvas.style,{position:'absolute',inset:'auto',left:rect.left+scrollX+'px',top:rect.top+scrollY+'px',width:width+'px',height:height+'px'});
    if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
    draw();schedule();
  }
  function restart(){sync();textReveal.finishAll();resize();}
  document.addEventListener('click',event=>{
    const jump=event.target.closest('[data-home-scroll]');
    if(jump){const id=jump.dataset.homeScroll;if(!document.getElementById(id))location.hash='';requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:paused||reduced.matches?'instant':'smooth',block:'start'}));}
    if(event.target.closest('#motion-toggle,#global-motion')){paused=!paused;storage.set('pause-motion',paused);restart();}
  });
  const seen=new WeakSet(),observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});
  function reveal(){
    sync();
    document.querySelectorAll('.landing .project-card,.landing .new-collection,.landing .mini-stats,.landing .recent-tools').forEach((el,i)=>{
      if(seen.has(el))return;seen.add(el);el.style.setProperty('--entry-delay',(i%3)*35+'ms');el.classList.add('reveal-item');
      if(paused||reduced.matches)el.classList.add('in-view');else observer.observe(el);
    });
  }
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1))){reveal();resize();}}).observe(document.querySelector('main'),{childList:true,subtree:true});
  window.addEventListener('resize',resize);document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);
  window.addEventListener('hashchange',()=>{time=0;resize();reveal();});
  restart();reveal();
}
