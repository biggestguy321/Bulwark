import {Game} from './game.js';
import {UI} from './ui.js';
import {loadArt,createTerrain,render} from './render.js';
const game=new Game(),canvas=document.getElementById('battle'),context=canvas.getContext('2d'),ui=new UI(game);
await loadArt();createTerrain(game);game.onReset=()=>{createTerrain(game);ui.refreshLevel();};
function coordinates(e){const box=canvas.getBoundingClientRect();const ratio=Math.min(box.width/480,box.height/288),left=box.left+(box.width-480*ratio)/2,top=box.top+(box.height-288*ratio)/2;return {x:(e.clientX-left)/ratio,y:(e.clientY-top)/ratio};}
canvas.addEventListener('pointerdown',e=>{const p=coordinates(e);game.click(p.x,p.y);ui.update();});
canvas.addEventListener('pointermove',e=>{const p=coordinates(e);game.pointer=p;const plot=game.level.plots.findIndex(([x,y])=>Math.hypot(x-p.x,y-p.y)<18);const enemy=game.enemies.find(en=>Math.hypot(en.x-p.x,en.y-p.y)<12);game.hover=enemy?{kind:'enemy',id:enemy.id}:plot>=0?{kind:'plot',index:plot}:null;});canvas.addEventListener('pointerleave',()=>{game.pointer=null;game.hover=null;});
let last=performance.now(),uiTime=0;function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;game.update(dt);render(game,context);uiTime+=dt;if(uiTime>.1){ui.update();uiTime=0;}requestAnimationFrame(frame);}requestAnimationFrame(frame);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.wave>0&&!game.outcome){game.paused=true;game.persist();ui.update();}});
// Optional WebMCP tools expose the same validated actions as the visible game.
const modelContext=document.modelContext;
if(modelContext?.registerTool){
 const lifecycle=new AbortController();
 const status=()=>({mission:game.level.name,wave:game.wave,gold:game.gold,lives:game.lives,paused:game.paused,plots:game.level.plots,towers:game.towers.map(t=>({id:t.id,type:t.type,plot:t.plot,tier:t.tier+1})),outcome:game.outcome});
 const register=tool=>{try{Promise.resolve(modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
 register({name:'bulwark_status',description:'Read the current battle, build plots, towers, and resources.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async()=>status()});
 register({name:'bulwark_build_tower',description:'Spend gold to build a tower on an empty numbered plot in the active battle.',inputSchema:{type:'object',properties:{type:{type:'string',enum:['barracks','archer','artillery','magic']},plot:{type:'integer',minimum:0,maximum:7}},required:['type','plot'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{if(!input||!['barracks','archer','artillery','magic'].includes(input.type)||!Number.isInteger(input.plot)||input.plot<0||input.plot>7)throw Error('Invalid tower or plot');const {build}=await import('./towers.js');if(!build(game,input.type,input.plot))throw Error('Cannot build: plot occupied, insufficient gold, paused, or restricted tower');ui.update();return status();}});
 register({name:'bulwark_call_wave',description:'Start the next enemy wave when the battle is ready; awards early-call gold during breaks.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:async()=>{if(game.paused||!game.action('wave'))throw Error('Next wave is not ready');ui.update();return status();}});
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
