export function spherePoints(count=260){return Array.from({length:count},(_,i)=>{const y=1-(i/(count-1))*2,r=Math.sqrt(Math.max(0,1-y*y)),angle=i*Math.PI*(3-Math.sqrt(5));return {x:Math.cos(angle)*r,y,z:Math.sin(angle)*r}})}
export function projectPoint(p,angle,radius,cx,cy,px=0,py=0){const x=p.x*Math.cos(angle)-p.z*Math.sin(angle),z=p.x*Math.sin(angle)+p.z*Math.cos(angle),scale=2.8/(2.8-z*.6);return {x:cx+x*radius*scale+px*z*18,y:cy+p.y*radius*scale+py*z*18,depth:(z+1)/2}}
export const motionAllowed=(paused,reduced,hidden)=>!paused&&!reduced&&!hidden;
