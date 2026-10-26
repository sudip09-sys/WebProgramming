import {create,flip,settle,hint,tick,beginPreview,endPreview} from './engine.mjs?v=2';
const $=id=>document.getElementById(id);
let game,clock,reveal,last,previewEnds=0;
function advance(){
 const now=performance.now();
 if(game.phase==='preview'){
  if(now>=previewEnds){endPreview(game);last=now;}
 }else{tick(game,(now-last)/1000);last=now;}
}
function render(){
 const done=['won','lost'].includes(game.phase),preview=game.phase==='preview';
 $('pairs').textContent=game.pairs+' / '+game.config.pairs;
 $('moves').textContent=game.moves;$('points').textContent=game.points;
 $('time').textContent=game.mode==='timed'?Math.ceil(game.time)+'s':'∞';
 $('time').classList.toggle('danger',game.mode==='timed'&&game.time<=15);
 $('progress').max=game.config.pairs;$('progress').value=game.pairs;
 $('hint').textContent='◎ Peek ('+game.hints+' left)';
 $('hint').disabled=game.phase!=='playing'||game.open.length>0||!game.hints;
 const combo=game.streak>1?game.streak+' MATCH STREAK':'FIND YOUR RHYTHM';
 $('combo').textContent=done?(game.phase==='won'?'BOARD CLEARED':'TIME TO TRY AGAIN'):preview?'MEMORIZE THE BOARD':combo;
 const status=done?'Round finished. Ready for another?':preview?'Memorize the symbols… '+Math.max(1,Math.ceil((previewEnds-performance.now())/1000))+' seconds':game.mode==='duel'?'Player '+(game.player+1)+'’s turn · P1: '+game.scores[0]+' pairs / P2: '+game.scores[1]+' pairs':game.phase==='hint'?'A quick peek. Make it count.':game.phase==='mismatch'?'Not this pair. Remember where they are.':game.streak>1?'Nice rhythm! Your next match can earn '+(100+Math.min(game.streak,4)*25)+' points.':'Pick two cards. Trust your memory.';
 if($('status').textContent!==status)$('status').textContent=status;
 [...$('board').children].forEach((button,i)=>{
  const card=game.cards[i],visible=card.matched||game.open.includes(i)||game.phase==='hint'||preview;
  const className='card'+(visible?' open':'')+(card.matched?' matched':'')+(game.phase==='mismatch'&&game.open.includes(i)?' miss':'');
  if(button.className!==className)button.className=className;
  button.disabled=done||card.matched;
  button.setAttribute('aria-label',visible?'Card '+(i+1)+': '+card.symbol+(card.matched?', matched':''):'Reveal card '+(i+1));
 });
 $('result').hidden=!done;
 if(done){
  clearInterval(clock);clearTimeout(reveal);
  const accuracy=Math.round(game.pairs/Math.max(1,game.moves)*100);
  let title=game.phase==='lost'?'So close. Go again?':'You made every connection.';
  let message=game.phase==='lost'?game.pairs+' of '+game.config.pairs+' pairs found. Try practice to learn the patterns.':game.moves+' moves · '+accuracy+'% matching accuracy · '+game.points+' points.';
  if(game.mode==='duel'){title=game.scores[0]===game.scores[1]?'A perfectly matched rivalry.':'Player '+(game.scores[0]>game.scores[1]?1:2)+' takes the crown.';message='Final score: '+game.scores[0]+' – '+game.scores[1]+' pairs.';}
  $('result-icon').textContent=game.phase==='lost'?'↻':'✦';
  $('result-title').textContent=title;$('result-copy').textContent=message;
 }
}
function choose(i){
 advance();const before=game.phase;flip(game,i);
 if(before==='playing'&&game.phase==='mismatch')reveal=setTimeout(()=>{advance();settle(game);render();},800);
 render();
}
function start(){
 clearInterval(clock);clearTimeout(reveal);
 game=create($('level').value,$('mode').value);beginPreview(game);
 previewEnds=performance.now()+3000;
 $('board').style.setProperty('--columns',game.config.columns);
 $('board').replaceChildren(...game.cards.map((card,i)=>{
  const button=document.createElement('button');button.type='button';
  button.innerHTML='<span class="card-inner" aria-hidden="true"><span class="back">✳</span><span class="front"></span></span>';
  button.querySelector('.front').textContent=card.symbol;
  button.addEventListener('click',()=>choose(i));return button;
 }));
 $('start').textContent='Restart round ↻';last=performance.now();
 clock=setInterval(()=>{advance();render();},100);render();
}
$('start').addEventListener('click',start);$('again').addEventListener('click',start);
$('hint').addEventListener('click',()=>{
 advance();
 if(hint(game))reveal=setTimeout(()=>{advance();if(game.phase==='hint')game.phase='playing';render();},1000);
 render();
});
document.addEventListener('visibilitychange',()=>{if(game){advance();render();}});
// A static deck gives the opening screen a clear visual target without starting the timer.
for(let i=0;i<16;i++){const card=document.createElement('div');card.className='card';card.setAttribute('aria-hidden','true');card.innerHTML='<span class="card-inner"><span class="back">✳</span></span>';$('board').append(card);}
