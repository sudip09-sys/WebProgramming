import {create,flip,settle,hint,tick} from './engine.mjs?v=1';
const $=id=>document.getElementById(id);
let game,clock,reveal,last;
function advance(){const now=performance.now();tick(game,(now-last)/1000);last=now;}
function render(){
 const done=['won','lost'].includes(game.phase);
 $('pairs').textContent=game.pairs+'/'+game.config.pairs;
 $('moves').textContent=game.moves;$('points').textContent=game.points;
 $('time').textContent=game.mode==='timed'?Math.ceil(game.time)+'s':'∞';
 $('hint').textContent='Peek ('+game.hints+' left)';
 $('hint').disabled=game.phase!=='playing'||game.open.length>0||!game.hints;
 $('status').textContent=done?'Round finished. Press Restart to play again.':game.mode==='duel'?'Player '+(game.player+1)+'’s turn · P1: '+game.scores[0]+' / P2: '+game.scores[1]:'Find matching symbols · Streak: '+game.streak;
 // Update existing buttons to preserve keyboard focus.
 [...$('board').children].forEach((button,i)=>{
  const card=game.cards[i],visible=card.matched||game.open.includes(i)||game.phase==='hint';
  button.textContent=visible?card.symbol:'·';
  button.className='card'+(visible?' open':'')+(card.matched?' matched':'');
  button.disabled=done||card.matched;
  button.setAttribute('aria-label',visible?'Card '+(i+1)+': '+card.symbol+(card.matched?', matched':''):'Reveal card '+(i+1));
 });
 $('result').hidden=!done;
 if(done){
  clearInterval(clock);clearTimeout(reveal);
  let message=game.phase==='lost'?'Time is up! Try practice mode or an easier level.':'All pairs found in '+game.moves+' moves! Score: '+game.points+'.';
  if(game.mode==='duel')message=game.scores[0]===game.scores[1]?'A draw! Both players found the same number of pairs.':'Player '+(game.scores[0]>game.scores[1]?1:2)+' wins! Final pairs: '+game.scores.join(' / ');
  $('result').textContent=message;
 }
}
function choose(i){
 advance();const before=game.phase;flip(game,i);
 if(before==='playing'&&game.phase==='mismatch')reveal=setTimeout(()=>{advance();settle(game);render();},800);
 render();
}
function start(){
 // Clear pending callbacks so an old round cannot change the new one.
 clearInterval(clock);clearTimeout(reveal);
 game=create($('level').value,$('mode').value);
 $('board').style.setProperty('--columns',game.config.columns);
 $('board').replaceChildren(...game.cards.map((card,i)=>{
  const button=document.createElement('button');button.type='button';button.addEventListener('click',()=>choose(i));return button;
 }));
 $('start').textContent='Restart game';last=performance.now();
 clock=setInterval(()=>{advance();render();},250);render();
}
$('start').addEventListener('click',start);
$('hint').addEventListener('click',()=>{
 advance();
 if(hint(game))reveal=setTimeout(()=>{advance();if(game.phase==='hint')game.phase='playing';render();},1000);
 render();
});
document.addEventListener('visibilitychange',()=>{if(game){advance();render();}});

