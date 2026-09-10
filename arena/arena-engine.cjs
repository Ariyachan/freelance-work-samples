
function createMatch(seed=7, aggression=0.55) {
  let state=seed>>>0;
  const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const game={time:0,score:[0,0],players:[],disc:{x:500,y:250,vx:0,vy:0,owner:-1},events:[],passes:0,turnovers:0,shots:0};
  for(let team=0;team<2;team++) for(let i=0;i<3;i++) game.players.push({team,x:team?700:300,y:130+i*120,speed:105+random()*25,accuracy:0.7+random()*0.2,cooldown:0,id:team*3+i});
  function log(message){game.events.unshift({time:game.time,message});game.events=game.events.slice(0,8);}
  function reset(){game.disc={x:500,y:250,vx:0,vy:0,owner:-1,lock:0};game.players.forEach((p,i)=>{p.x=p.team?700:300;p.y=130+(i%3)*120;p.cooldown=0.8;});}
  function move(p,target,dt){const d=distance(p,target);if(d>1){const step=Math.min(p.speed*dt,d);p.x+=(target.x-p.x)/d*step;p.y+=(target.y-p.y)/d*step;}p.x=Math.max(20,Math.min(980,p.x));p.y=Math.max(20,Math.min(480,p.y));}
  function launch(p,target,speed,kind){const disc=game.disc;let dx=target.x-p.x,dy=target.y-p.y;const d=Math.hypot(dx,dy)||1;disc.owner=-1;disc.x=p.x;disc.y=p.y;disc.vx=dx/d*speed;disc.vy=dy/d*speed;disc.lock=0.16;p.cooldown=0.45;if(kind==='pass'){game.passes++;log((p.team?'Coral':'Blue')+' passes');}else{game.shots++;log((p.team?'Coral':'Blue')+' shoots');}}
  function tick(dt=1/60){
    if(game.time>=60)return;
    game.time=Math.min(60,game.time+dt);
    let disc=game.disc;
    for(const p of game.players)p.cooldown=Math.max(0,p.cooldown-dt);
    const carrier=game.players[disc.owner];
    for(const p of game.players){
      const direction=p.team?-1:1;
      if(p===carrier){
        const goal={x:p.team?0:1000,y:250};
        const opponents=game.players.filter(q=>q.team!==p.team);
        const nearest=Math.min(...opponents.map(q=>distance(p,q)));
        if(Math.abs(goal.x-p.x)<180 && p.cooldown===0){launch(p,{x:goal.x,y:250+(random()-0.5)*(1-p.accuracy)*350},430,'shot');break;}
        const mates=game.players.filter(q=>q.team===p.team&&q!==p).sort((a,b)=>direction*(b.x-a.x));
        if(nearest<90 && p.cooldown===0 && mates[0] && distance(p,mates[0])>60){launch(p,mates[0],360,'pass');break;}
        move(p,{x:goal.x,y:250+Math.sin(game.time*0.7+p.id)*70},dt);
      }else if(!carrier){
        const own=game.players.filter(q=>q.team===p.team).sort((a,b)=>distance(a,disc)-distance(b,disc));
        move(p,own[0]===p?disc:{x:disc.x+direction*(80+(p.id%3)*25),y:110+(p.id%3)*140},dt);
      }else if(p.team===carrier.team){move(p,{x:carrier.x+direction*130,y:100+(p.id%3)*150},dt);}
      else{const defenders=game.players.filter(q=>q.team===p.team).sort((a,b)=>distance(a,carrier)-distance(b,carrier));move(p,defenders[0]===p?carrier:{x:carrier.x-direction*70,y:110+(p.id%3)*140},dt);}
    }
    disc=game.disc;
    if(disc.owner>=0){const p=game.players[disc.owner];disc.x=p.x;disc.y=p.y;for(const q of game.players){if(q.team!==p.team&&distance(p,q)<25&&q.cooldown===0&&random()<aggression*dt*2){disc.owner=q.id;q.cooldown=0.7;p.cooldown=0.7;game.turnovers++;log((q.team?'Coral':'Blue')+' wins possession');break;}}}
    else{
      disc.lock=Math.max(0,(disc.lock||0)-dt);disc.x+=disc.vx*dt;disc.y+=disc.vy*dt;disc.vx*=Math.exp(-0.1*dt);disc.vy*=Math.exp(-0.1*dt);
      if((disc.x<8||disc.x>992)&&disc.y>165&&disc.y<335){const team=disc.x>992?0:1;game.score[team]++;log((team?'Coral':'Blue')+' scores');reset();return;}
      if(disc.x<8||disc.x>992){disc.x=Math.max(8,Math.min(992,disc.x));disc.vx*=-0.75;}
      if(disc.y<8||disc.y>492){disc.y=Math.max(8,Math.min(492,disc.y));disc.vy*=-0.75;}
      if(disc.lock===0){const candidates=game.players.filter(p=>p.cooldown===0&&distance(p,disc)<22).sort((a,b)=>distance(a,disc)-distance(b,disc));if(candidates.length){disc.owner=candidates[0].id;candidates[0].cooldown=0.4;disc.vx=disc.vy=0;}}
    }
  }
  reset();return {game,tick};
}

module.exports={createMatch};
