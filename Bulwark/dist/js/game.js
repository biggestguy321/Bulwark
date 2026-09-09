import {load,save} from './save.js';
import {LEVELS,pathData,nearestRoad} from './levels.js';
import {AudioEngine} from './audio.js';
import {createHero,updateHero,ability} from './hero.js';
import {build,updateTowers,statsFor} from './towers.js';
import {updateEnemies,distance} from './enemies.js';
import {initWaves,updateWaves,callWave} from './waves.js';
import {useItem} from './shop.js';
export class Game{
 constructor(){this.save=load();this.audio=new AudioEngine(this.save.settings.sound);this.listeners=[];this.reset(0);}
 reset(index){this.levelIndex=index;this.level=LEVELS[index];this.difficulty=this.save.settings.difficulty;this.path=pathData(this.level.path);this.meta={...this.save.meta};this.lives=this.difficulty==='iron'?1:20;this.gold=this.level.gold+this.meta.economy*20;this.towers=[];this.enemies=[];this.soldiers=[];this.effects=[];this.corpses=[];this.time=0;this.nextId=1;this.kills=0;this.paused=false;this.speed=1;this.outcome=null;this.selection=null;this.buildType=null;this.targeting=null;this.hover=null;this.banner=null;this.shake=0;this.hero=createHero(this);const spawn=nearestRoad(this.path,350,170);this.hero.x=this.hero.target.x=spawn.x;this.hero.y=this.hero.target.y=spawn.y;this.persistClock=0;initWaves(this);this.onReset?.();}
 persist(){const ok=save(this.save);if(!ok)this.notify('Save unavailable: export your progress in Settings.');return ok;}
 notify(message){this.onNotify?.(message);}
 update(dt){if(this.paused||this.outcome)return;dt*=this.speed;this.time+=dt;updateWaves(this,dt);if(this.outcome)return;updateTowers(this,dt);updateHero(this,dt);updateEnemies(this,dt);for(const fx of this.effects){fx.life-=dt;if(fx.type==='text')fx.y-=dt*12;if(fx.type==='particle'){fx.x+=fx.vx*dt;fx.y+=fx.vy*dt;}}this.effects=this.effects.filter(f=>f.life>0);this.shake=Math.max(0,this.shake-dt*15);if(Math.floor((this.time-dt)/4)!==Math.floor(this.time/4)&&this.towers.some(t=>t.type==='artillery'))this.audio.play('bubble');this.persistClock+=dt;if(this.persistClock>10){this.persistClock=0;this.persist();}}
 finish(victory){if(this.outcome)return;let stars=0,gems=0;if(victory){stars=this.difficulty==='iron'?3:this.lives>=18?3:this.lives>=10?2:1;const previous=this.save.stars[this.levelIndex]||0;const improvement=Math.max(0,stars-previous);gems=improvement*5;this.save.stars[this.levelIndex]=Math.max(previous,stars);this.save.gems+=gems;this.save.unlocked=Math.max(this.save.unlocked,Math.min(7,this.levelIndex+1));}this.outcome={victory,stars,gems};this.persist();this.onFinish?.(this.outcome);}
 click(x,y){if(this.paused||this.outcome)return;this.audio.start();if(this.targeting){if(this.targeting==='rally'){const t=this.towers.find(t=>t.id===this.selection?.id),p=nearestRoad(this.path,x,y);if(t&&distance(t,p)<=statsFor(t).range){t.rally=p;this.targeting=null;this.notify('Rally point moved');}else this.notify('Choose a road within the rally circle');}else{const p=this.targeting==='militia'?nearestRoad(this.path,x,y):{x,y};useItem(this,this.targeting,p);}return;}
 const tower=this.towers.find(t=>Math.abs(t.x-x)<18&&y>t.y-36&&y<t.y+14);if(tower){this.selection={kind:'tower',id:tower.id};this.buildType=null;return;}
 const plot=this.level.plots.findIndex(([px,py])=>Math.hypot(px-x,py-y)<18);if(plot>=0){this.selection={kind:'plot',index:plot};if(this.buildType)build(this,this.buildType,plot);return;}
 const enemy=this.enemies.find(e=>distance(e,{x,y})<10);if(enemy){this.selection={kind:'enemy',id:enemy.id};return;}
 this.hero.target={x:Math.max(8,Math.min(450,x)),y:Math.max(14,Math.min(274,y))};this.hero.blockedBy=null;this.selection=null;this.effects.push({type:'ring',x,y,r:14,color:'#ddcb83',life:.7});}
 action(type){if(type==='wave')return callWave(this);if(type==='q'||type==='w')return ability(this,type);}
}
