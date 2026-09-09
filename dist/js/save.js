export const SAVE_KEY='bulwark-save';
export const fresh=()=>({version:2,gems:15,stars:{},heroXP:0,hero:'warden',meta:{towers:0,heroes:0,economy:0},settings:{sound:true,difficulty:'normal'},unlocked:0});
export function migrate(raw){const base=fresh();if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Invalid save');if(raw.version>2)throw Error('This save needs a newer game');const s={...base,...raw,version:2,settings:{...base.settings,...raw.settings},meta:{...base.meta,...raw.meta}};s.gems=bounded(s.gems,0,100000);s.heroXP=bounded(s.heroXP,0,1000000);s.unlocked=bounded(s.unlocked,0,7);s.stars=Object.fromEntries(Object.entries(s.stars||{}).filter(([k])=>/^\d$/.test(k)&&+k<8).map(([k,v])=>[k,bounded(v,0,3)]));for(const k of Object.keys(base.meta))s.meta[k]=bounded(s.meta[k],0,5);if(!['warden','witch','hunter','bunny'].includes(s.hero))s.hero='warden';if(!['easy','normal','hard','iron'].includes(s.settings.difficulty))s.settings.difficulty='normal';return s;}
const bounded=(n,min,max)=>Math.max(min,Math.min(max,Math.floor(Number(n)||0)));
export function load(){try{return migrate(JSON.parse(localStorage.getItem(SAVE_KEY))||fresh());}catch{return fresh();}}
export function save(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function exportSave(s){return btoa(JSON.stringify(s));}
export function importSave(str){const s=migrate(JSON.parse(atob(str.trim())));if(!save(s))throw Error('Browser storage unavailable');return s;}
export const totalStars=s=>Object.values(s.stars).reduce((a,b)=>a+b,0);
export const spentStars=s=>Object.values(s.meta).reduce((a,b)=>a+b*(b+1)/2,0);
