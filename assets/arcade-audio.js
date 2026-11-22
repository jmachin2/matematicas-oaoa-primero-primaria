/* OAOA Arcade Audio: original short synthesized soundtrack, no external downloads. */
(function(root){
'use strict';
function makeAudio(style){
 let ctx=null,master=null,loop=null,active=false,fxEnabled=true,step=0;
 const Ctx=()=>window.AudioContext||window.webkitAudioContext;
 const themes={
  robot:{notes:[392,0,523.25,0,587.33,523.25,440,0,392,0,659.25,0,587.33,523.25,440,0],bass:[196,196,220,196],tempo:270,wave:'triangle'},
  castle:{notes:[261.63,329.63,392,523.25,392,329.63,293.66,0,349.23,440,523.25,659.25,523.25,440,392,0],bass:[130.81,174.61,146.83,196],tempo:335,wave:'sine'}
 };
 const theme=themes[style]||themes.robot;
 function ensure(){if(ctx)return true;const C=Ctx();if(!C)return false;try{
 ctx=new C();master=ctx.createGain();master.gain.value=.12;master.connect(ctx.destination);return true;
 }catch(e){return false;}}
 function tone(freq,duration,level,wave,delay=0){
  if(!ensure()||!freq)return;
  const now=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=wave||theme.wave;o.frequency.setValueAtTime(freq,now);
  g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(level,now+.012);
  g.gain.exponentialRampToValueAtTime(.0001,now+duration);
  o.connect(g);g.connect(master);o.start(now);o.stop(now+duration+.025);
 }
 function tick(){
  if(!active||document.hidden)return;
  const note=theme.notes[step%theme.notes.length],beat=theme.tempo/1000;
  if(note)tone(note,beat*.68,.14,theme.wave);
  if(step%4===0)tone(theme.bass[Math.floor(step/4)%4],beat*.85,.085,'sine');
  step++;
 }
 async function start(){if(!ensure())return false;try{await ctx.resume()}catch(e){}
  if(active)return true;active=true;tick();loop=setInterval(tick,theme.tempo);return true;}
 function stop(){active=false;if(loop!==null)clearInterval(loop);loop=null;}
 function effect(kind){
  if(!fxEnabled||!ensure())return;
  if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  if(kind==='win'){tone(523.25,.16,.23,'sine');tone(659.25,.18,.22,'sine',.13);tone(783.99,.3,.22,'sine',.26)}
  else if(kind==='finish'){[392,523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,.28,.2,'triangle',i*.14))}
  else if(kind==='error'){tone(196,.12,.14,'sawtooth');tone(164.81,.14,.09,'sine',.16)}
  else if(kind==='tap'){tone(440,.065,.065,'triangle')}
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&loop!==null){clearInterval(loop);loop=null}else if(!document.hidden&&active&&loop===null){loop=setInterval(tick,theme.tempo)}});
 window.addEventListener('pagehide',stop);
 return {start,stop,effect,get active(){return active},get fxEnabled(){return fxEnabled},setEffects(on){fxEnabled=!!on}};
}
root.OAOAArcadeAudio=makeAudio;
})(window);
