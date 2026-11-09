/* Módulos de contenido de demostración: motores compartidos, datos separados.
   Los contenidos son propuestas piloto, NO sustituyen los originales. */
const bookUrl="https://drive.google.com/file/d/1kDDt6by7DsmGHHMrXVqcMUpFkual-RKB/view";
const sums=pairs=>pairs.map((nums,id)=>({id:String(id),type:"sum",nums}));
export const demoPages={
  20:{page:20,title:"Número posterior (+1) · piloto",bookUrl,items:sums([[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1]]),instructions:["Construye una regleta y añade una blanca.","Dibuja uno más.","Explica qué es posterior.","Calcula el número posterior.","Compara cada número con su siguiente.","Resuelve una situación con uno más."]},
  22:{page:22,title:"Parejas del 8 · piloto",bookUrl,items:sums([[1,7],[2,6],[3,5],[4,4],[5,3],[6,2],[7,1],[0,8]]),instructions:["Forma 8 con dos regletas.","Representa las dos partes.","Explica cómo se complementan.","Completa y calcula.","¿Qué sucede si cambias el orden?","Resuelve un problema de partes y todo."]},
  27:{page:27,title:"Sacos de Paco · piloto",bookUrl,items:[[5,2],[5,1,2],[2,2,1],[5,1,1],[2,2,2],[5,2,1],[1,2,1],[5,2,2]].map((nums,id)=>({id:String(id),type:"money",nums})),instructions:["Representa las cantidades con monedas.","Dibuja los valores.","Explica el total.","Suma los importes.","Compara dos formas de pagar.","Resuelve una compra sencilla."]},
  28:{page:28,title:"Igual o menor que 8 · piloto",bookUrl,items:[[5,3],[6,0],[4,2],[6,1],[1,7],[2,2],[3,5],[2,3],[6,2]].map((nums,id)=>({id:String(id),type:"compare",nums})),instructions:["Construye las sumas con regletas.","Representa el resultado.","Explica si llega a 8.","Calcula.","Clasifica iguales a 8 y menores.","Completa la pareja hasta 8."]}
};