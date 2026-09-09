const group=(type,count,gap=1)=>({type,count,gap});
export const INTRO_WAVES=[
 [group('husk',3,1.3)], [group('husk',6,1.2)], [group('husk',9,.9)],
 [group('blightclad',1,1.5),group('husk',8,1)],
 [group('husk',10,.8),group('blightclad',2,1.5)],
 [group('blightclad',3,1.4),group('husk',11,.7)],
 [group('husk',12,.6),group('blightclad',4,1.2)]
];
// Explicit content templates: new enemies lead nearly solo; later waves mix counters.
export const CAMPAIGN_WAVES=[
 [group('FOCUS',1,1.5)], [group('husk',10,.9),group('blightclad',2,1.3)],
 [group('FOCUS',2,1.5),group('husk',10,.8)],
 [group('blightclad',5,1.3),group('husk',12,.7)],
 [group('chanter',1,1.5),group('FOCUS',3,1.4),group('husk',10,.7)],
 [group('rider',1,1.5),group('husk',14,.7)],
 [group('blightclad',6,1.2),group('FOCUS',4,1.4)],
 [group('rider',2,1.5),group('husk',16,.6),group('chanter',2,1.5)],
 [group('ogre',1,1.5),group('FOCUS',4,1.3),group('blightclad',5,1.1)],
 [group('FOCUS',5,1.3),group('rider',2,1.5),group('husk',16,.6)]
];
export const BOSS_WAVE=[group('BOSS',1,1.5),group('husk',12,.8),group('blightclad',5,1.2)];
export function wavesFor(level,index){if(index===0)return INTRO_WAVES;const result=CAMPAIGN_WAVES.map(w=>w.map(g=>({...g,type:g.type==='FOCUS'?level.focus:g.type,count:g.type==='FOCUS'&&['necromancer','ogre','revenant'].includes(level.focus)?Math.min(g.count,level.focus==='necromancer'?1:2):g.count})));if(level.boss)result.push(BOSS_WAVE.map(g=>({...g,type:g.type==='BOSS'?level.boss:g.type})));return result;}
