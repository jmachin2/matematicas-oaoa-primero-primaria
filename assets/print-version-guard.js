/* OAOA Print Version Guard v1. Shared by legacy canvas PDF pages.
   A version is accepted only if the worksheet body changes, not merely its header. */
(function(){
"use strict";
function bodySignature(canvas){
 if(!(canvas instanceof HTMLCanvasElement))return null;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 if(!ctx)return null;
 const w=canvas.width,h=canvas.height;
 // Ignore headers and page/version metadata, but include exercise body and bottom tasks.
 const start=Math.round(h*.12),end=Math.round(h*.965);
 const sample=ctx.getImageData(0,start,w,end-start);
 let hash=2166136261;const a=sample.data;
 const jump=Math.max(1,Math.floor(w/235));
 const rowJump=Math.max(1,Math.floor((end-start)/190));
 for(let y=0;y<end-start;y+=rowJump){
   for(let x=0;x<w;x+=jump){
     const i=(y*w+x)*4;
     hash^=a[i];hash=Math.imul(hash,16777619);
     hash^=a[i+1];hash=Math.imul(hash,16777619);
     hash^=a[i+2];hash=Math.imul(hash,16777619);
   }
 }
 return hash>>>0;
}
function advance(opts){
 const {getCanvas,getVersion,setVersion,render,button,maxAttempts=12}=opts;
 const beforeVersion=getVersion(),initial=getCanvas();
 const fingerprint=bodySignature(initial);
 if(fingerprint===null){setVersion(beforeVersion+1);render();return true;}
 for(let attempt=1;attempt<=maxAttempts;attempt++){
   setVersion(beforeVersion+attempt);render();
   if(bodySignature(getCanvas())!==fingerprint){
     if(button){button.disabled=false;button.textContent="↻ Otra versión";button.title="Genera una ficha diferente";}
     return true;
   }
 }
 setVersion(beforeVersion);render();
 if(button){button.disabled=true;button.textContent="Sin más versiones distintas";button.title="Esta modalidad no ofrece más variantes. Selecciona otra modalidad.";}
 const status=document.getElementById("pdfStatus");
 if(status)status.textContent="No hay más ejercicios diferentes para esta modalidad.";
 return false;
}
window.OAOAPrintVersionGuard={advance,bodySignature};
})();
