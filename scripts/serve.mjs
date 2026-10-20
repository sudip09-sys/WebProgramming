import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{try{let target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');if(!fs.existsSync(target)){res.writeHead(404).end('Not found');return;}res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');fs.createReadStream(target).pipe(res);}catch{res.writeHead(400).end('Bad request');}});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+server.address().port));
