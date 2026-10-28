import test from 'node:test';
import assert from 'node:assert/strict';
import {profile,pokemon,countries,countryRequest,pokemonRequest} from '../week6/api-models.mjs';

test('generated profiles reject unexpected data and preserve names as plain data',()=>{
 assert.throws(()=>profile({error:'Offline'}));
 const p=profile({results:[{name:{first:'<script>',last:'Sample'},location:{city:'Seoul',country:'Korea'},picture:{large:'https://example.test/avatar.jpg'}}]});
 assert.equal(p.name,'<script> Sample');assert.equal(p.email,'Unavailable');assert.equal(p.location,'Seoul, Korea');
});
test('Pokemon requests reject invalid input and normalize names',()=>{
 assert.equal(pokemonRequest(' PIKACHU '),'https://pokeapi.co/api/v2/pokemon/pikachu');
 assert.equal(pokemonRequest('25'),'https://pokeapi.co/api/v2/pokemon/25');
 for(const invalid of ['','../25','<img>','pikachu?x=1'])assert.throws(()=>pokemonRequest(invalid));
});
test('Pokemon measurements and missing artwork are handled',()=>{
 const p=pokemon({id:25,name:'pikachu',height:4,weight:60,types:[{type:{name:'electric'}}],stats:[{stat:{name:'speed'},base_stat:90}],sprites:{},abilities:[]});
 assert.equal(p.height,'0.4 m');assert.equal(p.weight,'6 kg');assert.equal(p.photo,'');assert.equal(p.stats[0].value,90);assert.throws(()=>pokemon({id:'25',name:'x'}));
});
test('countries support single/array responses, missing fields and zero population',()=>{
 const c=countries({name:'Example',alpha2Code:'EX',population:0,area:1});
 assert.equal(c[0].population,'0');assert.equal(c[0].capital,'Unavailable');assert.equal(c[0].photo,'https://countries.dev/flags/ex.svg');
 assert.throws(()=>countries([]));assert.throws(()=>countries({message:'not found'}));
 assert.equal(countries(Array.from({length:30},()=>({name:'Sample'}))).length,24);
 assert.equal(countryRequest('South Korea'),'https://countries.dev/alpha/KR');assert.equal(countryRequest('New Zealand'),'https://countries.dev/name/New%20Zealand');assert.throws(()=>countryRequest('  '));
});

class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.attrs={};this.listeners={};this.textContent='';this.disabled=false;this.value='';this.dataset={};this.classList={add(){},remove(){}};}
 append(...items){this.children.push(...items);}replaceChildren(...items){this.children=[...items];}
 setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}focus(){this.focused=true;}remove(){this.removed=true;}
 get firstChild(){return this.children[0];}
}
async function setup(kind,fetcher){
 const demo=new Element(),output=new Element(),status=new Element(),query=new Element('input'),load=new Element('button'),random=new Element('button'),form=new Element('form');demo.dataset.api=kind;query.value=kind==='pokemon'?'pikachu':'Nepal';
 const controls=kind==='user'?[load]:[load,random];demo.querySelectorAll=()=>controls;
 const ids={'api-result':output,'api-status':status,query,load,random,'search-form':form};
 globalThis.document={querySelector:()=>demo,getElementById:id=>ids[id],createElement:tag=>new Element(tag)};
 globalThis.fetch=fetcher;
 await import('../week6/api-examples.mjs?test='+Math.random());
 return {demo,output,status,query,load,random,form,controls};
}
const tick=()=>new Promise(r=>setTimeout(r,0));
test('profile UI shows results and restores busy controls',async()=>{
 let requested='';const ui=await setup('user',async url=>{requested=url;return {ok:true,json:async()=>({results:[{name:{first:'Sample',last:'Person'},location:{country:'Nepal'},email:'sample@example.test'}]})};});
 await ui.load.listeners.click();assert.match(requested,/inc=name,email,location,picture/);assert.equal(ui.output.children[0].children[0].textContent,'Sample Person');assert.equal(ui.output.attrs['aria-busy'],'false');assert.equal(ui.load.disabled,false);assert.equal(ui.status.textContent,'Loaded successfully.');
});
test('404 leaves no stale cards and allows retry',async()=>{
 const ui=await setup('pokemon',async()=>({ok:false,status:404}));ui.form.listeners.submit({preventDefault(){}});await tick();
 assert.match(ui.status.textContent,/No match/);assert.equal(ui.output.children.length,0);assert.equal(ui.load.disabled,false);
});
test('aborted requests show timeout and restore controls',async()=>{
 const ui=await setup('user',async()=>{throw Object.assign(new Error(),{name:'AbortError'});});await ui.load.listeners.click();assert.match(ui.status.textContent,/timed out/);assert.equal(ui.load.disabled,false);assert.equal(ui.output.attrs['aria-busy'],'false');
});
test('country search uses aliases and renders labelled data',async()=>{
 let requested='';const ui=await setup('country',async u=>{requested=u;return {ok:true,json:async()=>({name:'South Korea',capital:'Seoul',population:50000000,region:'Asia',area:100000})};});ui.query.value='South Korea';ui.form.listeners.submit({preventDefault(){}});await tick();assert.equal(requested,'https://countries.dev/alpha/KR');assert.equal(ui.output.children[0].children[0].textContent,'South Korea');assert.match(ui.status.textContent,/1 matching country/);
});
test('duplicate clicks do not start overlapping requests',async()=>{
 let calls=0,release;const wait=new Promise(r=>release=r);const ui=await setup('user',async()=>{calls++;await wait;return {ok:false,status:503};});const first=ui.load.listeners.click();const second=ui.load.listeners.click();assert.equal(calls,1);release();await Promise.all([first,second]);assert.equal(ui.load.disabled,false);assert.match(ui.status.textContent,/503/);
});
