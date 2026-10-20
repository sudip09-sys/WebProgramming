import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.name!=='.git').flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root);let errors=0,html=0,scripts=0;
const fail=(f,message)=>{console.error(path.relative(root,f)+': '+message);errors++;};
for(const file of files){const ext=path.extname(file);if(ext==='.js'){try{new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});scripts++;}catch(e){fail(file,e.message);}}if(ext!=='.html')continue;html++;const text=fs.readFileSync(file,'utf8');for(const m of text.matchAll(/<(a|link|script|img)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)){const url=m[2];if(/^(?:https?:|mailto:|data:|#|javascript:)/i.test(url))continue;let target;try{target=path.resolve(path.dirname(file),decodeURIComponent(url.split(/[?#]/)[0]));}catch{fail(file,'Invalid URL '+url);continue;}if(!fs.existsSync(target))fail(file,'Missing local target '+url);}for(const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc=/.test(m[1])||/type=["']application\//.test(m[1]))continue;try{new vm.Script(m[2],{filename:file});scripts++;}catch(e){fail(file,e.message);}}}
console.log(`${html} HTML pages, ${scripts} JavaScript sources checked; ${errors} errors.`);process.exitCode=errors?1:0;
