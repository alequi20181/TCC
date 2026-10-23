const meses=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

let hoje=new Date(2026,8,18);
let mesAtual=new Date(2026,8,1);
let selecionado=new Date(2026,8,18);
let acessibilidade=false;
let eventos={
 "2026-09-05":[{tipo:"marcador",titulo:"Marcador"}],
 "2026-09-07":[{tipo:"marcador",titulo:"Marcador"}],
 "2026-09-08":[{tipo:"marcador",titulo:"Marcador"}],
 "2026-09-10":[{tipo:"compromisso",titulo:"Compromisso"}],
 "2026-09-12":[{tipo:"marcador",titulo:"Marcador"}],
 "2026-09-15":[{tipo:"compromisso",titulo:"Compromisso"}]
};

function chave(data){
 return data.getFullYear()+"-"+String(data.getMonth()+1).padStart(2,"0")+"-"+String(data.getDate()).padStart(2,"0");
}

function render(){
 document.getElementById("monthTitle").textContent=meses[mesAtual.getMonth()]+" "+mesAtual.getFullYear();
 document.getElementById("selectedTitle").textContent="Hoje — "+String(selecionado.getDate()).padStart(2,"0")+"/"+String(selecionado.getMonth()+1).padStart(2,"0")+"/"+selecionado.getFullYear();

 const calendar=document.getElementById("calendar");
 calendar.innerHTML="";
 const primeiro=new Date(mesAtual.getFullYear(),mesAtual.getMonth(),1).getDay();
 const total=new Date(mesAtual.getFullYear(),mesAtual.getMonth()+1,0).getDate();

 for(let i=0;i<primeiro;i++){
   const vazio=document.createElement("div");
   vazio.className="day empty";
   calendar.appendChild(vazio);
 }

 for(let dia=1;dia<=total;dia++){
   const data=new Date(mesAtual.getFullYear(),mesAtual.getMonth(),dia);
   const key=chave(data);
   const botao=document.createElement("button");
   botao.className="day"+(key===chave(selecionado)?" selected":"");
   botao.onclick=()=>{selecionado=data;mostrarCalendario();render()};
   let html='<span class="day-number">'+dia+'</span>';
   if(eventos[key]){
     html+='<span class="dots">';
     eventos[key].slice(0,3).forEach(e=>html+='<i class="dot '+e.tipo+'"></i>');
     html+='</span>';
   }
   botao.innerHTML=html;
   calendar.appendChild(botao);
 }
 renderDetalhes();
}

function renderDetalhes(){
 const key=chave(selecionado);
 const lista=eventos[key]||[];
 const detalhes=document.getElementById("details");

 if(lista.length===0){
   detalhes.innerHTML='<div class="empty-icon">🗓️</div><h3>Nenhum compromisso neste dia</h3><p>Clique em "Compromisso" para criar ou "Marcador" para destacar este dia</p>';
 }else{
   detalhes.innerHTML='<div class="event-list">'+lista.map(e=>'<div class="event"><span>'+(e.tipo==="marcador"?"🏷️":"📌")+'</span><div><strong>'+e.titulo+'</strong><small>'+(e.tipo==="marcador"?"Dia destacado":"Compromisso adicionado")+'</small></div></div>').join("")+'</div>';
 }
}

function mudarMes(valor){
 mesAtual=new Date(mesAtual.getFullYear(),mesAtual.getMonth()+valor,1);
 render();
}

function adicionarMarcador(){
 const key=chave(selecionado);
 if(!eventos[key])eventos[key]=[];
 eventos[key].push({tipo:"marcador",titulo:"Marcador"});
 render();
}

function adicionarCompromisso(){
 const key=chave(selecionado);
 if(!eventos[key])eventos[key]=[];
 eventos[key].push({tipo:"compromisso",titulo:"Novo compromisso"});
 render();
}

function mostrarLista(){
 document.getElementById("calendar").classList.add("hidden");
 document.querySelector(".weekdays").classList.add("hidden");
 document.getElementById("list").classList.remove("hidden");
 const prefix=mesAtual.getFullYear()+"-"+String(mesAtual.getMonth()+1).padStart(2,"0");
 const itens=Object.keys(eventos).filter(k=>k.startsWith(prefix)).sort();
 const lista=document.getElementById("list");
 lista.innerHTML=itens.length?itens.map(k=>{
   const dia=k.split("-")[2];
   return '<button class="list-item" onclick="selecionarDaLista(\''+k+'\')"><strong>'+dia+'</strong><span>'+eventos[k].map(e=>e.titulo).join(", ")+'</span></button>';
 }).join(""):'<p class="empty-list">Nenhum item neste mês.</p>';
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
 document.querySelectorAll(".nav-btn")[1].classList.add("active");
}

function selecionarDaLista(k){
 const partes=k.split("-").map(Number);
 selecionado=new Date(partes[0],partes[1]-1,partes[2]);
 mostrarCalendario();
 render();
}

function mostrarCalendario(){
 document.getElementById("calendar").classList.remove("hidden");
 document.querySelector(".weekdays").classList.remove("hidden");
 document.getElementById("list").classList.add("hidden");
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
 document.querySelectorAll(".nav-btn")[0].classList.add("active");
 render();
}

function voltarHoje(){
 hoje=new Date(2026,8,18);
 mesAtual=new Date(hoje.getFullYear(),hoje.getMonth(),1);
 selecionado=new Date(hoje);
 render();
}

function alternarAcessibilidade(){
 acessibilidade=!acessibilidade;
 document.body.classList.toggle("accessible",acessibilidade);
}

render();