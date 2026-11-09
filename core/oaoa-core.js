/* OAOA Core 0.1 | Núcleo de demostración independiente.
   No modifica los generadores legacy: las migraciones se realizan por página tras validar. */
export const OAOA_COLORS=Object.freeze({
  1:"#f7f6f1",2:"#e44b49",3:"#8acb6a",4:"#eb9bc0",5:"#f4d95b",
  6:"#3b8958",7:"#252525",8:"#96653e",9:"#367ac1",10:"#ea8d37"
});
export const PRINT_MODES=Object.freeze(["ampliacion","refuerzo","tarea","tea","pictogramas"]);
const headings=Object.freeze(["Manipulo","Represento","Comprendo","Calculo","Relaciono","Resuelvo","Libro original","Imprimibles"]);
export function assertPage(data){
  if(!data||!Number.isInteger(data.page)||!data.title)throw Error("Ficha: página y título obligatorios.");
  if(!Array.isArray(data.items)||data.items.length<4)throw Error("Ficha: mínimo 4 ejercicios.");
  for(const item of data.items){
    if(!item||!["sum","part","compare","money"].includes(item.type))throw Error("Tipo de ejercicio no reconocido.");
    if(!Array.isArray(item.nums)||item.nums.length<2||item.nums.some(n=>!Number.isInteger(n)||n<0||n>10))throw Error("Números inválidos.");
    if(item.type==="part"&&item.nums[1]>item.nums[0])throw Error("Parte mayor que total.");
  }
  return data;
}
export function exerciseText(item){
  const a=item.nums;
  switch(item.type){
    case "part":return "Completa: "+a[0]+" = "+a[1]+" + ____";
    case "compare":return a.join(" + ")+" = ____ . ¿Es igual a 8 o menor que 8?";
    case "money":return a.map(n=>n+" €").join(" + ")+" = ____ €";
    default:return a.join(" + ")+" = ____";
  }
}
export function variantItems(data,mode,version){
  assertPage(data);
  if(!PRINT_MODES.includes(mode))throw Error("Modalidad incorrecta");
  if(!Number.isInteger(version)||version<0)throw Error("Versión incorrecta");
  const counts={ampliacion:5,refuerzo:4,tarea:4,tea:3,pictogramas:4};
  const pool=data.items,shift=version%pool.length,round=Math.floor(version/pool.length);
  return Array.from({length:Math.min(counts[mode],pool.length)},(_,i)=>{
    const source=pool[(shift+i)%pool.length];
    const nums=[...source.nums];
    if(source.type==="sum"&&(round%2===1))nums.reverse();
    return {id:source.id||String((shift+i)%pool.length),type:source.type,nums};
  });
}
export function rodHTML(n){
  if(n===0)return "<span class='oaoa-zero'>0</span>";
  const color=OAOA_COLORS[n];
  if(!color)throw Error("Regleta no contemplada");
  return "<span class='oaoa-rod' style='--rod-color:"+color+";--rod-size:"+n+"'>"+n+"</span>";
}
export function validatePrint(root){
  const sheet=root.querySelector(".oaoa-sheet");
  if(!sheet)return {ok:false,reason:"Sin hoja A4"};
  const footer=sheet.querySelector(".oaoa-sheet-footer"),content=sheet.querySelector(".oaoa-sheet-body");
  if(!footer||!content)return {ok:false,reason:"Estructura de hoja incompleta"};
  const footerRect=footer.getBoundingClientRect(),children=[...content.children];
  const out=children.some(el=>{const r=el.getBoundingClientRect();return r.left<sheet.getBoundingClientRect().left-1||r.right>sheet.getBoundingClientRect().right+1;});
  const bottom=children.length?children[children.length-1].getBoundingClientRect().bottom:content.getBoundingClientRect().bottom;
  const collision=children.some((el,i)=>i>0&&el.getBoundingClientRect().top<children[i-1].getBoundingClientRect().bottom-1);
  if(out||collision||bottom>footerRect.top-6)return {ok:false,reason:out?"Hay contenido fuera de los márgenes":collision?"Dos bloques se superponen":"El contenido invade el pie o excede el A4"};
  return {ok:true,reason:"Composición A4 dentro de los límites"};
}
function make(tag,attrs={},text=""){const el=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));el.textContent=text;return el;}
export function mountOAOA(host,page){
  assertPage(page);
  if(!host)throw Error("Contenedor inexistente");
  host.replaceChildren();
  host.classList.add("oaoa-app");
  let step=1,version=0,mode="ampliacion",selected=null,dirty=false;
  const top=make("header",{class:"oaoa-top"});
  top.append(make("a",{href:"../fichas/"},"← Fichas"),make("strong",{}, "Página "+page.page+" · "+page.title));
  const progress=make("nav",{class:"oaoa-progress","aria-label":"Pasos de la ficha"});
  const main=make("main",{class:"oaoa-main"}),note=make("p",{class:"oaoa-status","aria-live":"polite"});
  const tabs=headings.map((name,i)=>{const b=make("button",{type:"button"},""+(i+1)+" · "+name);b.onclick=()=>open(i+1);progress.append(b);return b;});
  const title=make("h2"),work=make("div",{class:"oaoa-work"});
  main.append(title,work,note);host.append(top,progress,main);
  function open(n){step=n;tabs.forEach((b,i)=>b.classList.toggle("active",i===n-1));title.textContent=n+". "+headings[n-1];work.replaceChildren();note.textContent="";
    if(n===7){const link=make("a",{href:page.bookUrl||"#",target:"_blank",rel:"noopener"},"Abrir el libro original");work.append(make("p",{},"Consulta la página "+page.page+" del libro OAOA."),link);}
    else if(n===8)renderPrint();
    else renderPractice(n);
  }
  function renderPractice(n){
    const item=page.items[(n-1)%page.items.length];
    const description=make("div",{class:"oaoa-card"});description.append(make("p",{},page.instructions?.[n-1]||"Representa con material y explica cómo lo has pensado."),make("div",{class:"oaoa-task"},exerciseText(item)));
    const diagram=make("div",{class:"oaoa-rods"});item.nums.forEach(x=>{const wrap=make("span");wrap.innerHTML=rodHTML(x);diagram.append(wrap);});description.append(diagram);
    const result=item.type==="part"?item.nums[0]-item.nums[1]:item.nums.reduce((a,b)=>a+b,0);
    const field=make("input",{type:"number",min:"0",max:"20","aria-label":"Resultado"});
    const check=make("button",{type:"button"},"Comprobar");check.onclick=()=>{note.textContent=Number(field.value)===result?"✓ Correcto; explica tu estrategia.":"Revisa las partes con material manipulativo.";};
    const next=make("button",{type:"button"},"Otro ejemplo");next.onclick=()=>{const idx=(page.items.indexOf(item)+1)%page.items.length;description.querySelector(".oaoa-task").textContent=exerciseText(page.items[idx]);note.textContent="";};
    description.append(field,check,next);work.append(description);
  }
  function renderPrint(){
    const sidebar=make("div",{class:"oaoa-print-controls"});
    const select=make("select",{"aria-label":"Tipo de ficha"});PRINT_MODES.forEach(x=>select.append(make("option",{value:x},x.toUpperCase())));select.value=mode;sidebar.append(select);
    const regen=make("button",{type:"button"},"↻ Otra versión");
    const save=make("button",{type:"button"},"💾 Guardar diseño");
    const print=make("button",{type:"button"},"🖨️ Imprimir / Guardar PDF");
    const reset=make("button",{type:"button"},"Restaurar");
    sidebar.append(regen,save,reset,print);
    const sheet=make("article",{class:"oaoa-sheet"}),head=make("header",{class:"oaoa-sheet-header"},"MATEMÁTICAS OAOA · PÁGINA "+page.page);
    const meta=make("p",{class:"oaoa-sheet-meta"},"Nombre: ______________________   Fecha: ______________");
    const instruction=make("p",{class:"oaoa-sheet-instruction"},"Construye, piensa y escribe.");
    const body=make("div",{class:"oaoa-sheet-body"}),foot=make("footer",{class:"oaoa-sheet-footer"});
    sheet.append(head,meta,instruction,body,foot);
    const panel=make("div",{class:"oaoa-print-grid"});panel.append(sidebar,sheet);work.append(panel);
    function draw(){
      const items=variantItems(page,mode,version);body.replaceChildren();selected=null;
      items.forEach((item,i)=>{const section=make("div",{class:"oaoa-print-exercise"});
        const text=make("div",{class:"oaoa-editable",contenteditable:"true",spellcheck:"true"},(i+1)+". "+exerciseText(item));
        text.addEventListener("input",()=>{dirty=true;checkFit()});section.onclick=()=>{[...body.children].forEach(x=>x.classList.remove("selected"));section.classList.add("selected");selected=section};
        section.append(text);
        if(mode==="ampliacion"||mode==="tea")section.append(make("div",{class:"oaoa-write-area"}));
        body.append(section);
      });
      foot.textContent="P"+page.page+" · "+mode+" · versión "+(version+1);
      if(!dirty)note.textContent="Versión "+(version+1)+" · "+items.map(i=>i.nums.join("+")).join(" | ");
      requestAnimationFrame(checkFit);
    }
    function checkFit(){const checked=validatePrint(sheet.parentElement);print.disabled=!checked.ok;note.textContent=checked.ok?"✓ "+checked.reason+" · Versión "+(version+1):"⚠️ "+checked.reason;}
    select.onchange=()=>{mode=select.value;version=0;dirty=false;draw();};
    regen.onclick=()=>{version++;dirty=false;draw()};
    reset.onclick=()=>{dirty=false;draw()};
    save.onclick=()=>{try{localStorage.setItem("oaoa-core:"+page.page+":"+mode+":"+version,JSON.stringify([...body.querySelectorAll(".oaoa-editable")].map(x=>x.textContent)));note.textContent="Diseño guardado en este navegador.";}catch(e){note.textContent="El navegador no permite guardar estos cambios."}};
    print.onclick=()=>{const checked=validatePrint(sheet.parentElement);if(checked.ok)window.print();else note.textContent="No se puede imprimir: "+checked.reason};
    draw();
  }
  open(1);
  return {go:open,step:()=>step};
}
