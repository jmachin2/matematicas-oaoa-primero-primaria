/* Representaciones imprimibles OAOA: se inspiran en las regletas, esquemas parte-todo y modelos de las páginas de actividades.
   API: OAOAVisuals.render({page,type,nums,mode}) -> SVG seguro. Mantener en sincronía con los datos de las fichas. */
(function(root){
'use strict';
const palette={1:'#f7f4ec',2:'#d95757',3:'#9acb6a',4:'#ed9abc',5:'#edda4a',6:'#2d7b4d',7:'#202020',8:'#8b5a35',9:'#337bb4',10:'#e58d32'};
function esc(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function text(x,y,s,size=19,weight=700,color='#17384e'){return '<text x="'+x+'" y="'+y+'" font-family="Arial,sans-serif" font-weight="'+weight+'" font-size="'+size+'" fill="'+color+'">'+esc(s)+'</text>'}
function reg(n,x,y,unit=21,h=32){
 const raw=Number(n);if(raw===0)return '<rect x="'+x+'" y="'+y+'" width="30" height="'+h+'" rx="6" fill="#fff" stroke="#819aa9" stroke-width="2" stroke-dasharray="4 4"/>'+text(x+9,y+h/2+7,0,20);
 const v=Math.max(1,Math.min(10,Number.isFinite(raw)?raw:1)),w=v*unit,fill=palette[v]||'#eee';return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="'+fill+'" stroke="#17384e" stroke-width="2"/><rect x="'+(x+3)+'" y="'+(y+3)+'" width="'+Math.max(1,w-6)+'" height="4" fill="#fff" opacity=".25" rx="2"/>'+text(x+w/2-6,y+h/2+7,v,20,800,[2,6,7,8,9].includes(v)?'#fff':'#17384e')}
function empty(x,y,w=77,h=33){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#fff" stroke="#819aa9" stroke-width="2" stroke-dasharray="6 5"/>'}
function box(x,y,w,h,label,fill='#fff',dash=false){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+fill+'" stroke="#323232" stroke-width="2"'+(dash?' stroke-dasharray="6 4"':'')+'/>'+text(x+w/2-7,y+h/2+7,label,22)}
function diagram(total,known){return box(274,10,78,35,total)+'<path d="M313 45 L207 77 M313 45 L419 77" fill="none" stroke="#333" stroke-width="3"/>'+box(160,76,92,37,known)+box(374,76,92,37,'?')}
function base(body,desc){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 126" width="100%" height="auto" role="img" aria-label="'+esc(desc)+'" preserveAspectRatio="xMidYMid meet" style="max-height:31mm;display:block">'+body+'</svg>'}
function render(model){
 const data=model||{},nums=Array.isArray(data.nums)?data.nums.map(Number):[],page=Number(data.page)||22;
 const type=data.type||'sum',mode=data.mode||'tarea',a=nums[0]||1,b=nums[1]||1;
 let body='',desc='';
 if(type==='commute'){
   const [left,right]=[a,b];body=reg(left,18,14,16,31)+reg(right,18+left*16,14,16,31)+text(279,38,'=',31)+reg(right,330,14,16,31)+reg(left,330+right*16,14,16,31);
   body+=text(20,91,left+' + '+right+' = '+right+' + '+left,26);
   desc='Conmutatividad: mismas regletas en orden diferente y total constante';
 }else if(type==='successor'){
   body=reg(a,20,28,21,36)+text(250,61,'+',32)+reg(1,295,28,21,36)+text(350,61,'=',32)+empty(405,26,116,40);
   body+=text(26,112,'Añadimos una unidad para llegar al número posterior',18,400);
   desc='Número posterior: añade una regleta de una unidad a la cantidad inicial';
 }else if(type==='compare45'){
   body=reg(4,27,23,26,42)+text(154,51,'4',25)+reg(5,323,23,26,42)+text(471,51,'5',25);
   body+=text(28,106,'COMPARO LAS CANTIDADES Y CLASIFICO',19);
   desc='Comparación del cuatro y el cinco con regletas de longitud proporcional';
 }else if(type==='compare56'){
   body=box(30,13,175,46,'2 + 3 = 5')+box(227,13,175,46,'3 + 3 = 6')+box(424,13,177,46,'2 + 3 = 6');
   body+=text(30,102,'Busca la igualdad incorrecta y compruébala',20);
   desc='Detective de los números cinco y seis: comprueba y corrige un error';
 }else if(type==='classify567'){
   [5,6,7].forEach((n,i)=>{const x=23+i*206;body+=reg(n,x,19,18,34)+text(x+31,97,'TOTAL '+n,20)});
   desc='Clasificación y construcción con regletas de sumas que forman cinco, seis y siete';
 }else if(type==='tree7'){
   body=box(279,3,82,30,7)+box(157,54,76,30,5)+box(426,54,76,30,2);
   body+='<path d="M320 33 L196 54 M320 33 L465 54 M196 84 L107 99 M196 84 L283 99" fill="none" stroke="#333" stroke-width="3"/>';
   body+=box(66,96,75,29,3)+box(241,96,75,29,2);
   desc='Árbol de descomposición sucesiva de siete: partes cinco y dos, y cinco descompuesto en tres y dos';
 }else if(page===32||type==='previous'){
   const v=Number(nums[0])||8;
   body=reg(v,20,28,22,40)+text(260,65,'−',35)+reg(1,306,28,22,40)+text(356,65,'=',35)+empty(410,29,105,40);
   desc='Regleta del '+v+' menos una unidad; escribe el número anterior';
 }else if(page===27||type==='money'){
   let x=20;for(const amount of nums.slice(0,4)){if(amount===5){body+='<rect x="'+x+'" y="28" width="104" height="58" rx="7" fill="#e6f2db" stroke="#3b7757" stroke-width="3"/>'+text(x+23,65,'5 €',29);x+=120}else{body+='<circle cx="'+(x+34)+'" cy="57" r="30" fill="#f4e7af" stroke="#a38a48" stroke-width="3"/>'+text(x+17,67,amount+' €',19);x+=85}}body+=text(Math.min(x+10,460),67,'=',29)+empty(Math.min(x+60,505),30,90,50);desc='Monedas y billetes del saco de Paco';
 }else if(page===29){
   const given=type==='brick'?b:a;
   body=reg(9,15,17,20,34)+text(226,45,'=',29)+reg(given,267,17,20,34)+text(461,45,'+',29)+empty(502,17,92,36);
   body+=text(20,100,'9 = '+given+' + ____',24);
   desc='Caza el 9: regleta azul como total, regleta conocida y complemento que falta';
 }else if(page===24||page===30||type==='diagram'){
   const total=type==='brick'?a:page===30?9:8,known=type==='brick'?b:a;
   body=diagram(total,known);
   body+=reg(total,15,40,12,28)+text(18,26,'REGLETA',15);
   body+=text(531,24,'DIBUJO',15);
   for(let dot=0;dot<total;dot++){const dx=542+(dot%4)*20,dy=41+Math.floor(dot/4)*20;body+='<circle cx="'+dx+'" cy="'+dy+'" r="6" fill="#e7f2f8" stroke="#527b94" stroke-width="2"/>'}
   desc='La misma cantidad representada con regleta, diagrama parte-todo y dibujo, como en la página original';
 }else if(page===26||type==='brick'){
   body=box(270,10,100,40,a)+'<path d="M320 50 L213 75 M320 50 L427 75" stroke="#333" stroke-width="3" fill="none"/>'+box(164,76,99,40,b)+box(377,76,99,40,'?');
   desc='Muro de ladrillos parte-todo: '+a+' como total, '+b+' como parte y parte desconocida';
 }else if(page===28||type==='compare'){
   body=reg(a,18,26,18,36)+text(200,58,'+',29)+reg(b,236,26,18,36)+text(434,58,'=',29)+empty(480,26,82,38)+text(200,104,'¿8 o menor que 8?',20);
   desc='Regletas para comparar el resultado de la suma con 8';
 }else if(page===31||page===23||page===22||page===29||type==='pair'){
   const total=type==='brick'?a:(a+b),given=type==='brick'?b:a;
   body=reg(Math.max(1,Math.min(total,10)),15,13,19,30);
   body+=text(243,38,'=',27)+reg(given,292,13,19,30)+text(470,39,'+',28)+empty(516,12,74,33);
   body+=text(20,97,total+' = '+given+' + ____',24);
   desc='Regleta del total '+total+' y regleta de la parte '+given+'; busca la pareja o complemento';
 }else{
   const first=Math.max(1,Math.min(a,9)),second=Math.max(1,Math.min(b,9));
   body=reg(first,17,26,20,38)+text(222,61,'+',32)+reg(second,263,26,20,38)+text(466,61,'=',32)+empty(520,28,85,39);
   desc='Representación de suma con dos regletas y casilla de resultado';
 }
 if(mode==='refuerzo')body+=text(18,119,'Mira las regletas · Dibuja · Escribe',16,400,'#527185');
 else if(mode==='ampliacion')body+=text(18,119,'Comprueba con otra representación',16,400,'#527185');
 return base(body,desc);
}
root.OAOAVisuals={render,palette};
})(typeof window!=='undefined'?window:this);
