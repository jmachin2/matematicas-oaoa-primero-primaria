/* Contrato OAOA páginas 29–33. Fuentes: DATA y pasos 1–6 de pagina-NN/index.html.
   Los enunciados y las soluciones de refuerzo/ampliación deben respetar el foco matemático.
   Validación de modelos, no certificación de equivalencia visual ni adecuación al alumnado. */
(function(root){
'use strict';
const matrix={
29:{name:'Caza el 9 y complementos',source:'pagina-29/index.html',reference:'55–56',focus:'complemento9',vocabulary:'COMPLEMENTO',
 steps:['Regletas: dos partes que forman 9','Parte desconocida a partir del total','Recuperación de parejas','Cálculo y comprobación','Caza otra pareja del 9','Problema de parte desconocida'],
 representations:['regleta azul de 9','dos regletas complementarias','parte desconocida','suma 9 = a + ?'],
 refuerzo:'Regleta total visible, parte conocida y una incógnita; comprobar la longitud',
 ordinaria:'Completar complementos variados y representarlos',
 ampliacion:'Buscar otras parejas de 9 y justificar su equivalencia',
 evidence:'Expresa correctamente 9 = a + b, usando parejas y regletas'},
30:{name:'Dibuja el 9 y completa diagramas',source:'pagina-30/index.html',reference:'57–58',focus:'representacion9',vocabulary:'DIAGRAMA',
 steps:['Construir 9 con regletas y dibujar nueve elementos','Parte que falta','Recuperación de parejas','Cálculo','Cambiar orden y comprobar','Problema de suma 4 + 5'],
 representations:['regleta del 9','dibujo de nueve elementos','diagrama parte-todo','expresión simbólica'],
 refuerzo:'Modelo de 9, parte conocida y dibujo parcialmente apoyado',
 ordinaria:'Vincular regleta, dibujo, diagrama y suma',
 ampliacion:'Dos descomposiciones distintas y conexión entre todas sus representaciones',
 evidence:'El total y las partes son coherentes entre las representaciones'},
31:{name:'Parejas del 7, 8 y 9',source:'pagina-31/index.html',reference:'59–60',focus:'parejas789',vocabulary:'PAREJAS',
 steps:['Construir parejas con regletas','Encontrar parte desconocida','Recuperación rápida tras comprender','Cálculo','Comparar orden de sumandos','Problema de parte desconocida'],
 representations:['regleta del total','regleta de una parte','pareja faltante','sumas de 7, 8 y 9'],
 refuerzo:'Una pareja de cada total con regletas como apoyo',
 ordinaria:'Completar y comprobar parejas de los tres totales',
 ampliacion:'Buscar parejas alternativas, organizarlas y explicar patrones',
 evidence:'Aparecen los totales 7, 8 y 9, con descomposiciones correctas'},
32:{name:'El número anterior',source:'pagina-32/index.html',reference:'61',focus:'anteriorMenosUno',vocabulary:'ANTERIOR',
 steps:['Quitar una unidad de una regleta','Calcular n−1','Recuperación mental del anterior','Práctica con números distintos','Identificar el patrón −1','Retroceder una unidad en contexto'],
 representations:['regleta inicial','regleta de una unidad que se quita','n − 1 = ?','secuencia descendente'],
 refuerzo:'Regleta inicial y unidad retirada claramente visibles',
 ordinaria:'Calcular el inmediatamente anterior y comprobar con −1',
 ampliacion:'Argumentar por qué quitar exactamente una unidad da el anterior',
 evidence:'No se mezclan sumas generales ni restas de más de una unidad'},
33:{name:'Sumas y relaciones del 7 al 9',source:'pagina-33/index.html',reference:'63–64',focus:'sumas789',vocabulary:'RESULTADO',
 steps:['Construir sumas con regletas','Completar partes','Recuperar hechos aditivos','Calcular','Relacionar suma con resultado 7, 8 o 9','Problema de composición'],
 representations:['dos regletas de sumandos','operación y resultado','clasificación en 7, 8 o 9','relación suma–total'],
 refuerzo:'Dos regletas y resultado que se pueda contrastar',
 ordinaria:'Clasificar sumas por sus resultados 7, 8 o 9',
 ampliacion:'Crear sumas equivalentes y justificar su clasificación',
 evidence:'Todos los resultados de la clasificación pertenecen a {7,8,9}'}
};
function isInt(x){return Number.isInteger(x)}
function check(page,model){
 const p=matrix[page];if(!p)return {ok:false,errors:['Página fuera de la matriz de validación 29–33']};
 const err=[];const list=(model?.tasks)||[];if(!list.length)err.push('Sin ejercicios');
 const targets=[];
 for(let i=0;i<list.length;i++){
  const t=list[i], a=t.nums||[];
  if(!Array.isArray(a)||!a.every(isInt)){err.push('Ejercicio '+(i+1)+': números no enteros');continue}
  if(page===32){
   if(t.type!=='previous'||a.length!==1||a[0]<2||a[0]>9)err.push('Ejercicio '+(i+1)+': debe ser exclusivamente el anterior de un número del 2 al 9');
  } else if(page===29){
   const total=t.type==='brick'?a[0]:a.reduce((x,y)=>x+y,0);
   if(total!==9||!['brick','sum'].includes(t.type))err.push('Ejercicio '+(i+1)+': falta un complemento válido del 9');
   if(t.type==='brick'&&!(a[1]>=0&&a[1]<=9))err.push('Ejercicio '+(i+1)+': parte inválida');
  } else if(page===30){
   const total=t.type==='brick'?a[0]:a.reduce((x,y)=>x+y,0);
   if(total!==9)err.push('Ejercicio '+(i+1)+': el total representado debe ser 9');
  } else if(page===31){
   const total=t.type==='brick'?a[0]:a.reduce((x,y)=>x+y,0);
   if(![7,8,9].includes(total))err.push('Ejercicio '+(i+1)+': debe formar 7, 8 o 9');
   targets.push(total);
  } else if(page===33){
   const total=t.type==='brick'?a[0]:a.reduce((x,y)=>x+y,0);
   if(![7,8,9].includes(total))err.push('Ejercicio '+(i+1)+': suma fuera del 7 al 9');
   targets.push(total);
  }
 }
 if([31,33].includes(page)&&model?.requireAllTotals!==false){
   for(const n of [7,8,9])if(!targets.includes(n))err.push('Falta un ejercicio cuyo total sea '+n);
 }
 return {ok:err.length===0,errors:err};
}
root.OAOAStrategyContract={matrix,check};
})(typeof window!=='undefined'?window:this);
