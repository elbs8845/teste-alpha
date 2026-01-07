// DADOS
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let leads = JSON.parse(localStorage.getItem("leads")) || [];
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [
  {user:"admin", pass:"123", role:"admin"}
];

// LOGIN
function login(){
  const u = user.value;
  const p = pass.value;
  const ok = users.find(x=>x.user===u && x.pass===p);
  if(ok){
    localStorage.setItem("logado", ok.role);
    window.location = "dashboard.html";
  } else {
    erro.innerText = "Usuário ou senha inválidos";
  }
}

function logout(){
  localStorage.removeItem("logado");
  window.location = "index.html";
}

// NAVEGAÇÃO
function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// VENDAS
function addVenda(){
  vendas.push({
    cliente:vCliente.value,
    produto:vProduto.value,
    valor:Number(vValor.value),
    vendedor:vVendedor.value
  });
  localStorage.setItem("vendas", JSON.stringify(vendas));
  atualizar();
}

// LEADS
function addLead(){
  leads.push({nome:lNome.value, tel:lTel.value});
  localStorage.setItem("leads", JSON.stringify(leads));
  listar();
}

// AGENDAMENTOS
function addAgendamento(){
  agendamentos.push({cliente:aCliente.value, data:aData.value});
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  listar();
}

// USUÁRIOS
function addUser(){
  users.push({user:uUser.value, pass:uPass.value, role:uRole.value});
  localStorage.setItem("users", JSON.stringify(users));
  listar();
}

// ATUALIZAÇÕES
function atualizar(){
  let totalVenda = vendas.reduce((s,v)=>s+v.valor,0);
  total.innerText = totalVenda.toLocaleString("pt-BR");

  let m = Number(meta.value);
  let pct = m > 0 ? (totalVenda / m) * 100 : 0;

  percent.innerText = pct.toFixed(1) + "%";

  listar();
  desenharGrafico();
}



function listar(){
  listaVendas.innerHTML = vendas.map(v=>`<li>${v.cliente} - ${v.vendedor} - R$${v.valor}</li>`).join("");
  listaLeads.innerHTML = leads.map(l=>`<li>${l.nome} - ${l.tel}</li>`).join("");
  listaAgendamentos.innerHTML = agendamentos.map(a=>`<li>${a.cliente} - ${a.data}</li>`).join("");

  let rank = {};
  vendas.forEach(v=>rank[v.vendedor]=(rank[v.vendedor]||0)+v.valor);
  listaRanking.innerHTML = Object.entries(rank)
    .sort((a,b)=>b[1]-a[1])
    .map((r,i)=>`<li>${i+1}º ${r[0]} - R$${r[1]}</li>`).join("");

  listaUsers.innerHTML = users.map(u=>`<li>${u.user} (${u.role})</li>`).join("");
}

window.onload = atualizar;

function desenharGrafico(){
  const canvas = document.getElementById("grafico");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let dados = {};
  vendas.forEach(v=>{
    dados[v.vendedor] = (dados[v.vendedor] || 0) + v.valor;
  });

  const vendedores = Object.keys(dados);
  const valores = Object.values(dados);
  const max = Math.max(...valores, 1);

  const larguraBarra = 50;
  const espacamento = 30;
  const base = canvas.height - 30;

  vendedores.forEach((v,i)=>{
    let altura = (valores[i] / max) * 200;
    let x = 40 + i * (larguraBarra + espacamento);

    ctx.fillStyle = "#ff8c00";
    ctx.fillRect(x, base - altura, larguraBarra, altura);

    ctx.fillStyle = "#fff";
    ctx.fillText(v, x, base + 15);
    ctx.fillText("R$"+valores[i], x, base - altura - 5);
  });
}

