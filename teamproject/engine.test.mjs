import test from 'node:test';
import assert from 'node:assert/strict';
import {create,flip,settle,hint,tick,levels} from './engine.mjs';
function ordered(mode='practice'){const g=create('easy',mode);g.cards.sort((a,b)=>a.symbol.localeCompare(b.symbol));return g;}
test('each difficulty contains exactly two of every symbol',()=>{
 for(const level of Object.keys(levels)){const g=create(level);assert.equal(g.cards.length,g.config.pairs*2);for(const c of g.cards)assert.equal(g.cards.filter(x=>x.symbol===c.symbol).length,2);}
});
test('duplicate flips ignored; combos and victory work',()=>{
 const g=ordered();flip(g,0);flip(g,0);assert.equal(g.open.length,1);flip(g,1);assert.equal(g.points,100);
 flip(g,2);flip(g,3);assert.equal(g.points,225);
 for(let i=4;i<g.cards.length;i++)flip(g,i);
 assert.equal(g.phase,'won');assert.equal(g.moves,6);const score=g.points;flip(g,0);assert.equal(g.points,score);
});
test('mismatch blocks third card and switches duel player once',()=>{
 const g=ordered('duel');flip(g,0);flip(g,2);flip(g,4);assert.deepEqual(g.open,[0,2]);
 settle(g);assert.equal(g.player,1);settle(g);assert.equal(g.player,1);
 flip(g,0);flip(g,1);assert.equal(g.player,1);assert.deepEqual(g.scores,[0,1]);
});
test('hints limited, penalized, and blocked with an open card',()=>{
 const g=ordered();flip(g,0);assert.equal(hint(g),false);flip(g,1);
 assert.equal(hint(g),true);assert.equal(g.points,50);assert.equal(hint(g),false);
 g.phase='playing';hint(g);g.phase='playing';hint(g);g.phase='playing';assert.equal(hint(g),false);assert.equal(g.points,0);
});
test('timeout during a reveal cannot resume play; untimed modes stay active',()=>{
 const g=ordered('timed');flip(g,0);flip(g,2);tick(g,130);settle(g);assert.equal(g.phase,'lost');assert.equal(g.time,0);
 for(const mode of ['practice','duel']){const p=create('easy',mode);tick(p,1000);assert.equal(p.phase,'playing');}
});


import {beginPreview,endPreview} from './engine.mjs';
test('preview blocks flips and countdown, then allows normal play',()=>{
 const g=create('easy','timed');beginPreview(g);flip(g,0);tick(g,4);
 assert.equal(g.open.length,0);assert.equal(g.time,120);
 endPreview(g);flip(g,0);tick(g,1);assert.equal(g.open.length,1);assert.equal(g.time,119);
 g.phase='lost';endPreview(g);assert.equal(g.phase,'lost');
});
