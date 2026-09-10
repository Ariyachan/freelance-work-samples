const assert=require('node:assert/strict');
const {createMatch}=require('./arena-engine.cjs');
function run(seed,aggression=0.55){const match=createMatch(seed,aggression);for(let frame=0;frame<3601;frame++){match.tick();for(const p of match.game.players){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.x>=20&&p.x<=980&&p.y>=20&&p.y<=480);}const d=match.game.disc;assert(Number.isFinite(d.x)&&Number.isFinite(d.y));assert(d.owner>=-1&&d.owner<6);}return match.game;}
assert.deepEqual(run(7),run(7));
const results=Array.from({length:12},(_,i)=>run(i+1));
assert(results.every(g=>g.time===60));
assert(results.some(g=>g.passes>0));
assert(results.some(g=>g.shots>0));
assert(results.some(g=>g.score[0]+g.score[1]>0));
assert(new Set(results.map(g=>JSON.stringify(g.score))).size>1);
assert.equal(run(7,0).turnovers,0);
console.log(JSON.stringify(results.map((g,i)=>({seed:i+1,score:g.score,passes:g.passes,shots:g.shots,turnovers:g.turnovers})),null,2));
console.log('PASS: deterministic replay, 12 complete seeds, bounds and finite state, passes/shots/scoring, varied scorelines, tackle control.');
