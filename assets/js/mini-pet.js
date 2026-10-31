/* Byte is an original lightweight website companion. No tracking or network calls. */
(() => {
  'use strict';
  if(document.getElementById('sudip-mini-pet'))return;
  const style=document.createElement('style');
  style.textContent=`
  #sudip-mini-pet{position:fixed;right:18px;bottom:76px;z-index:810;width:86px;height:100px;font:12px/1.4 system-ui,sans-serif;color:#eee6f8;isolation:isolate;pointer-events:none}
  #sudip-mini-pet *,#sudip-pet-panel *{box-sizing:border-box}
  #sudip-mini-pet button,#sudip-pet-panel button{font:inherit;letter-spacing:normal;text-transform:none;cursor:pointer;min-width:0;max-width:none;margin:0;box-shadow:none;pointer-events:auto}
  #sudip-mini-pet button:focus-visible,#sudip-pet-panel button:focus-visible{outline:2px solid #e1c6fb;outline-offset:3px}
  #sudip-mini-pet .byte-body{width:86px;height:100px;padding:0;border:0;border-radius:22px;background:transparent;color:inherit;touch-action:none;user-select:none;display:flex;align-items:center;justify-content:flex-end;flex-direction:column}
  #sudip-mini-pet .byte-label{font:9px/1.3 ui-monospace,monospace;background:#211b2ce8;border:1px solid #ad91c64d;border-radius:20px;padding:3px 9px;letter-spacing:1px;color:#e7d4fa;margin-top:2px}
  #sudip-mini-pet .byte-art{width:82px;height:76px;overflow:visible;filter:drop-shadow(0 6px 5px #0004);animation:byte-breathe 4s ease-in-out infinite}
  #sudip-mini-pet .byte-eyes{transform-origin:40px 38px;animation:byte-blink 5.6s infinite}
  #sudip-mini-pet .byte-tail{transform-origin:61px 54px;animation:byte-tail 3.2s ease-in-out infinite}
  #sudip-mini-pet .byte-ear{transform-origin:49px 23px;animation:byte-ear 7s ease-in-out infinite}
  #sudip-mini-pet .byte-snooze{display:none;position:absolute;top:3px;right:0;color:#d8c0ef;font:12px ui-monospace,monospace;letter-spacing:4px;animation:byte-dream 3s ease-in-out infinite}
  #sudip-mini-pet[data-mood=nap] .byte-snooze{display:block}
  #sudip-mini-pet[data-mood=nap] .byte-eyes{transform:scaleY(.12);animation:none}
  #sudip-mini-pet[data-mood=nap] .byte-art{animation-duration:6s}
  #sudip-mini-pet[data-mood=happy] .byte-art{animation:byte-hop .45s ease-out 2}
  #sudip-mini-pet .byte-hearts{position:absolute;top:14px;left:10px;pointer-events:none;color:#dfacd5;font-size:15px;opacity:0}
  #sudip-mini-pet[data-mood=happy] .byte-hearts{animation:byte-love 1.7s ease-out}
  #sudip-mini-pet .byte-restore{width:44px;height:44px;border:1px solid #a98fc160;background:#211b2c;color:#e6d1f7;border-radius:50%;position:absolute;right:0;bottom:0;display:none;font-size:18px}
  #sudip-mini-pet[data-hidden=true] .byte-body,#sudip-mini-pet[data-hidden=true] .byte-snooze,#sudip-mini-pet[data-hidden=true] .byte-hearts{display:none}
  #sudip-mini-pet[data-hidden=true] .byte-restore{display:block}
  #sudip-mini-pet[data-dragging=true] .byte-art{animation-play-state:paused}
  #sudip-pet-panel{position:fixed;z-index:811;width:260px;max-width:calc(100vw - 24px);padding:17px;background:#211b2cf5;color:#eee6f8;border:1px solid #8f75a663;border-radius:18px;box-shadow:0 12px 40px #0005;font:12px/1.5 system-ui,sans-serif}
  #sudip-pet-panel[hidden]{display:none!important}
  #sudip-pet-panel header{display:flex;justify-content:space-between;align-items:center;margin:0 0 8px;padding:0;border:0;background:none;position:static}
  #sudip-pet-panel strong{font-size:14px;color:#f3e9ff}
  #sudip-pet-panel p{font:12px/1.6 system-ui,sans-serif;color:#c8b9d4;margin:8px 0 14px;min-height:38px}
  #sudip-pet-panel .byte-close{width:30px;height:30px;padding:0;display:grid;place-items:center;border:0;background:transparent;color:#c9bad8;border-radius:50%;font-size:20px}
  #sudip-pet-panel .byte-actions{display:flex;gap:6px}
  #sudip-pet-panel .byte-actions button{flex:1;padding:9px 5px;border:1px solid #957ba64d;background:#382b46;color:#f3e5ff;border-radius:10px;min-height:44px;font-size:11px}
  #sudip-pet-panel .byte-actions button:hover{background:#4d3a60}
  #sudip-pet-panel .byte-hide{border:0;background:none;color:#bba5cd;padding:10px 0 0;font-size:10px;text-decoration:underline}
  .motion-paused #sudip-mini-pet *{animation-play-state:paused!important}
  @keyframes byte-breathe{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-3px) scaleY(1.025)}}
  @keyframes byte-blink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.08)}}
  @keyframes byte-tail{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(8deg)}}
  @keyframes byte-ear{0%,80%,90%,100%{transform:rotate(0)}84%{transform:rotate(-9deg)}87%{transform:rotate(4deg)}}
  @keyframes byte-hop{0%,100%{transform:translateY(0)}45%{transform:translateY(-12px) rotate(-5deg)}70%{transform:translateY(-4px) rotate(4deg)}}
  @keyframes byte-love{0%{opacity:0;transform:translateY(0)}25%{opacity:1}100%{opacity:0;transform:translateY(-26px)}}
  @keyframes byte-dream{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-8px);opacity:1}}
  @media(prefers-reduced-motion:reduce){#sudip-mini-pet *{animation:none!important;transition:none!important}}
  `;
  document.head.append(style);
  const root=document.createElement('div');root.id='sudip-mini-pet';root.dataset.mood='idle';
  root.innerHTML=`<button type="button" class="byte-body" aria-label="Meet Byte, your code companion" aria-expanded="false" aria-controls="sudip-pet-panel" title="Meet Byte · drag to move">
    <svg class="byte-art" viewBox="0 0 82 76" aria-hidden="true"><defs><linearGradient id="byte-coat" x2=".8" y2="1"><stop stop-color="#e3d2f7"/><stop offset="1" stop-color="#9b80b8"/></linearGradient></defs>
    <path class="byte-tail" d="M59 59C83 62 79 41 70 45C64 49 75 51 66 55" fill="none" stroke="#a68ac0" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="39" cy="69" rx="24" ry="4" fill="#0003"/><path d="M24 43C17 53 19 67 26 68H53C61 64 59 49 51 43Z" fill="url(#byte-coat)"/>
    <path d="M20 29L18 10Q26 10 32 22M47 22Q56 11 62 13L60 33" fill="#b59acb" stroke="#d6c0e9" stroke-width="1.5"/>
    <path class="byte-ear" d="M51 23L59 16L57 29" fill="#e9c0d9"/><path d="M22 17L24 29L30 24" fill="#e9c0d9"/>
    <rect x="18" y="22" width="44" height="31" rx="14" fill="url(#byte-coat)"/><path d="M39 25L35 32H43Z" fill="#806692" opacity=".6"/>
    <g class="byte-eyes" fill="#34263f"><ellipse cx="30" cy="37" rx="3.5" ry="4.5"/><ellipse cx="50" cy="37" rx="3.5" ry="4.5"/><circle cx="31" cy="35.5" r="1" fill="#fff"/><circle cx="51" cy="35.5" r="1" fill="#fff"/></g>
    <path d="M38 43L40 45L42 43M35 47Q38 49 40 45Q42 49 45 47" fill="none" stroke="#70556e" stroke-width="1.3" stroke-linecap="round"/>
    <ellipse cx="25" cy="43" rx="4" ry="2" fill="#e9b7d5" opacity=".7"/><ellipse cx="55" cy="43" rx="4" ry="2" fill="#e9b7d5" opacity=".7"/>
    <path d="M30 68V62M50 68V62" stroke="#775c91" stroke-width="1.3" stroke-linecap="round"/><path d="M35 56L31 59L35 62M44 56L48 59L44 62" fill="none" stroke="#6c517f" stroke-width="1.6" stroke-linecap="round"/>
    </svg><span class="byte-label">BYTE</span></button><span class="byte-snooze" aria-hidden="true">z z</span><span class="byte-hearts" aria-hidden="true">♥ · ♥</span><button type="button" class="byte-restore" aria-label="Show Byte" title="Show Byte">🐾</button>`;
  const panel=document.createElement('section');panel.id='sudip-pet-panel';panel.hidden=true;panel.setAttribute('aria-label','Byte, your code companion');
  panel.innerHTML=`<header><strong>Hey, I’m Byte.</strong><button type="button" class="byte-close" aria-label="Close pet controls">×</button></header><p role="status">Your tiny study buddy. Drag me somewhere comfy, or stay for a little break.</p><div class="byte-actions"><button type="button" data-byte="pet">Pet ♥</button><button type="button" data-byte="treat">Treat ◦</button><button type="button" data-byte="nap">Nap ☾</button></div><button type="button" class="byte-hide">Tuck Byte away</button>`;
  document.body.append(root,panel);
  const body=root.querySelector('.byte-body'),message=panel.querySelector('p'),nap=panel.querySelector('[data-byte=nap]');let timer=0,drag=null,moved=false;
  try{root.dataset.hidden=localStorage.getItem('sudip-mini-pet-hidden')==='1'?'true':'false';}catch{root.dataset.hidden='false';}
  try{const p=JSON.parse(localStorage.getItem('sudip-mini-pet-position'));if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1){root.style.left=Math.max(8,Math.min(innerWidth-94,p.x*(innerWidth-86)))+'px';root.style.top=Math.max(8,Math.min(innerHeight-108,p.y*(innerHeight-100)))+'px';root.style.right='auto';root.style.bottom='auto';}}catch{}
  function positionPanel(){const r=root.getBoundingClientRect(),p=panel.getBoundingClientRect();panel.style.left=Math.max(12,Math.min(innerWidth-p.width-12,r.right-p.width))+'px';const top=r.top-p.height-12;panel.style.top=Math.max(12,Math.min(innerHeight-p.height-12,top>12?top:r.bottom+10))+'px';}
  function close(){panel.hidden=true;body.setAttribute('aria-expanded','false');}
  function show(){panel.hidden=false;body.setAttribute('aria-expanded','true');positionPanel();}
  function hide(value){root.dataset.hidden=String(value);close();try{localStorage.setItem('sudip-mini-pet-hidden',value?'1':'0');}catch{}if(value)root.querySelector('.byte-restore').focus();else body.focus();}
  body.addEventListener('click',()=>{if(moved){moved=false;return;}if(panel.hidden)show();else close();});
  panel.querySelector('.byte-close').onclick=()=>{close();body.focus();};panel.querySelector('.byte-hide').onclick=()=>hide(true);root.querySelector('.byte-restore').onclick=()=>hide(false);
  panel.addEventListener('click',e=>{const action=e.target.closest('[data-byte]')?.dataset.byte;if(!action)return;clearTimeout(timer);
    if(action==='nap'){const sleeping=root.dataset.mood!=='nap';root.dataset.mood=sleeping?'nap':'idle';nap.textContent=sleeping?'Wake ☀':'Nap ☾';message.textContent=sleeping?'Just resting my eyes. Good ideas need little breaks, too.':'Good morning! Ready for another little experiment?';return;}
    root.dataset.mood='idle';nap.textContent='Nap ☾';void root.offsetWidth;root.dataset.mood='happy';message.textContent=action==='pet'?'Prrr. That’s the good stuff. You’ve got this, human.':'A byte-sized snack! My favourite. Thank you ♥';timer=setTimeout(()=>{root.dataset.mood='idle';},1800);
  });
  body.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=root.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top};moved=false;body.setPointerCapture(e.pointerId);});
  body.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>6)moved=true;if(!moved)return;root.dataset.dragging='true';close();root.style.left=Math.max(8,Math.min(innerWidth-94,drag.left+dx))+'px';root.style.top=Math.max(8,Math.min(innerHeight-108,drag.top+dy))+'px';root.style.right='auto';root.style.bottom='auto';});
  function endDrag(){drag=null;root.dataset.dragging='false';if(moved)try{const r=root.getBoundingClientRect();localStorage.setItem('sudip-mini-pet-position',JSON.stringify({x:r.left/Math.max(1,innerWidth-86),y:r.top/Math.max(1,innerHeight-100)}));}catch{}}body.addEventListener('pointerup',endDrag);body.addEventListener('pointercancel',()=>{endDrag();moved=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();body.focus();}});
  document.addEventListener('pointerdown',e=>{if(!root.contains(e.target)&&!panel.contains(e.target))close();},{passive:true});
  window.addEventListener('resize',()=>{if(root.style.left){root.style.left=Math.max(8,Math.min(innerWidth-94,parseFloat(root.style.left)))+'px';root.style.top=Math.max(8,Math.min(innerHeight-108,parseFloat(root.style.top)))+'px';}if(!panel.hidden)positionPanel();},{passive:true});
})();
