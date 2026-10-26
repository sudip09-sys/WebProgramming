import {startExperience} from './experience.mjs?v=20261026';
const cards=[...document.querySelectorAll('.project-card')];
let category='all';
function filter(){
 const query=document.querySelector('#search').value.toLowerCase().trim();
 let count=0;
 for(const card of cards){card.hidden=!(category==='all'||card.dataset.category===category)||!card.textContent.toLowerCase().includes(query);if(!card.hidden)count++;}
 document.querySelector('#result-count').textContent=count+' collections';
 document.querySelector('#empty').hidden=count>0;
}
document.querySelector('#search').addEventListener('input',filter);
document.querySelectorAll('[data-category-filter]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.categoryFilter;
 document.querySelectorAll('[data-category-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});filter();
}));
startExperience();filter();

