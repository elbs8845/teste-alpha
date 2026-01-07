let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [
  {user:"admin",pass:"123",role:"admin"}
];

function login(){
  const u = loginUser.value;
  const p = loginPass.value;
  const ok = users.find(x=>x.user===u && x.pass===p);
  if(ok){
    localStorage.setItem("logado",ok.role);
    window.location="dashboard.html";
  }else{
    loginErro.innerText="Usuário ou senha inválidos";
  }
}

function logout(){
  localStorage.removeItem("logado");
  window.location="index.html";
}

function addVenda(){
  vendas.push({
    cliente:vendCliente.value,
    valor:Number(vendValor.value),
    vendedor:vendVendedor.value
  });
  localStorage.setItem("vendas",JSON.stringify(vendas));
  atualizar();
}

function atualizar(){
  let total = vendas.reduce((s,v)=>s+v.valor,0);
  totalVendido.innerText = total.toLocaleString("pt-BR");
  let meta = Number(metaValor.value||0);
  let pct = meta?((total/meta)*100):0;
  percentMeta.innerText = pct.toFixed(1)+"%";
  barraMeta.style.width = pct+"%";

  listaVendas.innerHTML="";
  vendas.forEach(v=>{
    listaVendas.innerHTML+=`<li>${v.cliente} | ${v.vendedor} | R$ ${v.valor}</li>`;
  });

  let rank = {};
  vendas.forEach(v=>rank[v.vendedor]=(rank[v.vendedor]||0)+v.valor);
  listaRanking.innerHTML="";
  Object.entries(rank).sort((a,b)=>b[1]-a[1])
    .forEach((r,i)=>{
      listaRanking.innerHTML+=`<li>${i+1}º ${r[0]} — R$ ${r[1]}</li>`;
    });
}

window.onload=atualizar;
