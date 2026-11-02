import {build, transform} from 'esbuild';
import fs from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const out = new URL('assets/optimized/', root);
await fs.mkdir(out,{recursive:true});
for (const [name, inputs] of Object.entries({
 'home.min.css':['assets/home/styles.css','assets/home/premium.css','assets/home/project-art.css'],
 'game.min.css':['teamproject/style.css']
})) {
 const source=(await Promise.all(inputs.map(p=>fs.readFile(new URL(p,root),'utf8')))).join('\n').replace(/@import\s+url\([^)]*\)\s*;/g,'');
 const result=await transform(source,{loader:'css',minify:true,target:'chrome100'});
 await fs.writeFile(new URL(name,out),result.code);
}
for(const [input,output] of Object.entries({
 'assets/home/home.mjs':'home.min.mjs',
 'teamproject/game.mjs':'game.min.mjs',
 'assets/js/idea-mixer.js':'idea-mixer.min.js',
 'assets/js/spider.js':'spider.min.js',
 'assets/js/mini-pet.js':'mini-pet.min.js'
})) {
 let contents=await fs.readFile(new URL(input,root),'utf8');
 if(input.endsWith('spider.js')) contents=contents.replace('mini-pet.js?v=20261031','mini-pet.min.js');
 await build({stdin:{contents,resolveDir:new URL(input.replace(/[^/]+$/,''),root).pathname.replace(/^\/([A-Za-z]:)/,'$1'),sourcefile:input,loader:'js'},outfile:new URL(output,out).pathname.replace(/^\/([A-Za-z]:)/,'$1'),bundle:true,minify:true,format:input.endsWith('.mjs')?'esm':'iife',target:'chrome100'});
}

