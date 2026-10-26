import {escapeHTML} from './core.mjs?v=20261024sessions';
export const esc=escapeHTML;
export const $=(s,root=document)=>root.querySelector(s);
export const $$=(s,root=document)=>[...root.querySelectorAll(s)];
export const storage={get(key,fallback){try{return JSON.parse(localStorage.getItem('sudip.v2.'+key))??fallback}catch{return fallback}},set(key,value){try{localStorage.setItem('sudip.v2.'+key,JSON.stringify(value));return true}catch{toast('Browser storage is full or unavailable. Export your data to keep it.');return false}}};
let toastTimer;
export function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200)}
export async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied to clipboard')}catch{toast('Clipboard unavailable. Select the text and copy it manually.')}}
export function download(name,content,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export async function fetchJSON(url,signal){let response;try{const timeout=AbortSignal.timeout(15000);response=await fetch(url,{signal:signal?AbortSignal.any([signal,timeout]):timeout})}catch(error){if(error.name==='AbortError')throw error;throw Error(error.name==='TimeoutError'?'The service took too long. Please retry.':'Cannot reach the service. Check your connection and retry.')}if(!response.ok){if(response.status===404)throw Error('No matching result was found.');if(response.status===403||response.status===429)throw Error('The service rate limit was reached. Please try again later.');throw Error('The service returned an error ('+response.status+'). Please retry.')}return response.json()}
export function errorBox(message){return '<div class="message error" role="alert">'+esc(message)+'</div>'}
export function empty(message){return '<div class="empty"><span>◎</span><p>'+esc(message)+'</p></div>'}
export function field(label,control){return '<label class="field"><span>'+label+'</span>'+control+'</label>'}
export const button=(text,id,classes='primary')=>'<button class="'+classes+'" id="'+id+'">'+text+'</button>';
