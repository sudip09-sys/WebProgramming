/* A skip link activates with Enter; Tab keeps its normal browser behavior. */
(()=>{'use strict';for(const link of document.querySelectorAll('a.skip[href="#main"]'))link.addEventListener('click',()=>{const main=document.getElementById('main');if(!main)return;main.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:'instant'});});})();
