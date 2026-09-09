import {LEVELS,REGIONS} from './data/levels.js';
export {LEVELS,REGIONS};
export function pathData(points){let length=0;const segments=points.slice(1).map((p,i)=>{const a=points[i],len=Math.hypot(p[0]-a[0],p[1]-a[1]);const s={a,b:p,len,start:length};length+=len;return s;});return {segments,length};}
export function pathPoint(path,distance){const s=path.segments.find(s=>distance<=s.start+s.len)||path.segments.at(-1);const t=Math.max(0,Math.min(1,(distance-s.start)/s.len));return {x:s.a[0]+(s.b[0]-s.a[0])*t,y:s.a[1]+(s.b[1]-s.a[1])*t};}
export function nearestRoad(path,x,y){let best={distance:Infinity};for(const s of path.segments){const dx=s.b[0]-s.a[0],dy=s.b[1]-s.a[1],t=Math.max(0,Math.min(1,((x-s.a[0])*dx+(y-s.a[1])*dy)/s.len**2));const px=s.a[0]+dx*t,py=s.a[1]+dy*t,d=Math.hypot(x-px,y-py);if(d<best.distance)best={x:px,y:py,distance:d,progress:s.start+t*s.len};}return best;}
