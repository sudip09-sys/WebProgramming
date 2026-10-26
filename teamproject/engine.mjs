export const levels={easy:{pairs:6,time:120,hints:3,columns:4},medium:{pairs:8,time:100,hints:2,columns:4},hard:{pairs:12,time:90,hints:1,columns:6}};
export function create(level='medium',mode='timed'){
 const config=levels[level]; const icons=['☀','☾','★','◆','♣','♥','♫','✿','⚡','☂','☕','⚓'];
 const cards=icons.slice(0,config.pairs).flatMap(symbol=>[{symbol,matched:false},{symbol,matched:false}]);
 for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
 return {config,mode,cards,open:[],moves:0,pairs:0,streak:0,points:0,hints:config.hints,time:config.time,phase:'playing',player:0,scores:[0,0]};
}
export function flip(g,i){
 if(g.phase!=='playing'||!g.cards[i]||g.cards[i].matched||g.open.includes(i))return;
 g.open.push(i);if(g.open.length<2)return;g.moves++;
 const [a,b]=g.open;
 if(g.cards[a].symbol===g.cards[b].symbol){
  g.cards[a].matched=g.cards[b].matched=true;g.pairs++;g.streak++;
  g.points+=100+Math.min(g.streak-1,4)*25;g.scores[g.player]++;g.open=[];
  if(g.pairs===g.config.pairs)g.phase='won';
 }else{g.streak=0;g.phase='mismatch';}
}
export function settle(g){if(g.phase!=='mismatch')return;g.open=[];if(g.mode==='duel')g.player=1-g.player;g.phase='playing';}
export function hint(g){if(g.phase!=='playing'||g.open.length||!g.hints)return false;g.hints--;g.points=Math.max(0,g.points-50);g.phase='hint';return true;}
export function tick(g,seconds){if(g.mode!=='timed'||['preview','won','lost'].includes(g.phase))return;g.time=Math.max(0,g.time-seconds);if(!g.time)g.phase='lost';}


// Preview is separate from the round clock; clicks remain locked until it ends.
export function beginPreview(g){g.phase='preview';}
export function endPreview(g){if(g.phase==='preview')g.phase='playing';}
