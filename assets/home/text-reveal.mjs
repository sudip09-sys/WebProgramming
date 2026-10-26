const glyphs='01{}[]<>/#$%+=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function scrambleGlyphs(text,progress,phase=0){
  const chars=Array.from(text),p=Math.max(0,Math.min(1,progress)),resolved=Math.floor(Math.max(0,(p-.16)/.84)*chars.length);
  return chars.map((char,i)=>{const settled=p===1||/\s/.test(char)||i<resolved;return {char:settled?char:glyphs[(i*17+phase*13)%glyphs.length],tint:settled?'':['cyan','violet','pink'][Math.min(2,Math.floor(i/Math.max(1,chars.length)*3))]};});
}
export function scrambleFrame(text,progress,phase=0){
  return scrambleGlyphs(text,progress,phase).map(g=>g.char).join('');
}
export const wordParts=text=>text.match(/\s+|\S+/gu)||[];
export function installTextReveal(isPaused){
  const root=document.querySelector('main'),known=new WeakMap(),running=new Map();
  const selectors='.hero-copy h1,#projects-title,.new-heading h2,.studio-footer h2,.card-body h3,.tool-heading h1,#tool h2';
  let raf=0;
  function paint(record,progress,phase=0){
    const cells=scrambleGlyphs(record.text,progress,phase);
    record.glyphs.forEach((g,i)=>{if(!g)return;const cell=cells[i];if(g.textContent!==cell.char)g.textContent=cell.char;if(cell.tint)g.dataset.tint=cell.tint;else delete g.dataset.tint;});
  }
  function restore(record){paint(record,1);record.element.dataset.decoding='false';}
  function frame(now){
    for(const [element,task] of running){
      if(!element.isConnected){running.delete(element);continue;}
      if(isPaused()){restore(task.record);running.delete(element);continue;}
      const progress=Math.min(1,(now-task.start)/task.duration),phase=Math.floor((now-task.start)/60);
      if(phase!==task.phase||progress===1){paint(task.record,progress,phase);task.phase=phase;}
      if(progress===1){restore(task.record);running.delete(element);}
    }
    raf=running.size?requestAnimationFrame(frame):0;
  }
  function play(record,duration=record.hero?1400:650){
    if(isPaused()){restore(record);return;}
    record.played=true;record.lastPlayed=performance.now();
    running.set(record.element,{record,start:record.lastPlayed,duration,phase:-1});
    record.element.dataset.decoding='true';paint(record,0);
    if(!raf)raf=requestAnimationFrame(frame);
  }
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){const record=known.get(entry.target);if(record)play(record);observer.unobserve(entry.target);}
  }),{threshold:.25});
  function scan(){
    root.querySelectorAll(selectors).forEach(element=>{
      const existing=known.get(element);
      if(existing){if(!existing.played&&!isPaused())observer.observe(element);return;}
      if(element.closest('form,[contenteditable]')||element.querySelector('input,textarea,select'))return;
      const nodes=[],walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      while(walker.nextNode())if(walker.currentNode.textContent.trim()&&!walker.currentNode.parentElement.closest('[aria-hidden="true"],.decode-word'))nodes.push(walker.currentNode);
      if(!nodes.length)return;
      const record={element,text:nodes.map(n=>n.textContent).join(''),glyphs:[],hero:element.matches('.hero-copy h1'),played:false,lastPlayed:0};
      known.set(element,record);
      nodes.forEach(node=>{
        const fragment=document.createElement('span');fragment.className='decode-segment';
        wordParts(node.textContent).forEach(part=>{
          if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));record.glyphs.push(...Array.from(part,()=>null));return;}
          const word=document.createElement('span'),original=document.createElement('span'),overlay=document.createElement('span');
          word.className='decode-word';original.className='decode-original';original.textContent=part;overlay.className='decode-text';overlay.setAttribute('aria-hidden','true');
          Array.from(part,c=>{const g=document.createElement('span');g.className='decode-glyph';g.textContent=c;overlay.append(g);record.glyphs.push(g);});
          word.append(original,overlay);fragment.append(word);
        });
        node.replaceWith(fragment);
      });
      element.dataset.decoding='false';
      if(record.hero)element.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!running.has(element)&&performance.now()-record.lastPlayed>6000)play(record,1100);});
      if(!isPaused())observer.observe(element);
    });
    root.querySelectorAll('[data-replay-text]').forEach(b=>{b.disabled=isPaused();b.title=isPaused()?'Resume motion to enable text reveal':'Replay the visible text';});
  }
  document.addEventListener('click',event=>{if(event.target.closest('[data-replay-text]'))root.querySelectorAll(selectors).forEach(el=>{const record=known.get(el),rect=el.getBoundingClientRect();if(record&&!running.has(el)&&rect.bottom>0&&rect.top<innerHeight)play(record);});});
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))scan();}).observe(root,{childList:true,subtree:true});
  scan();
  return {finishAll(){cancelAnimationFrame(raf);raf=0;running.forEach(task=>restore(task.record));running.clear();scan();}};
}
