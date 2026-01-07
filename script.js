let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  {login:"admin", senha:"123", tipo:"admin"}
];

function salvarUsuarios(){
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}


// DADOS
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let leads = JSON.parse(localStorage.getItem("leads")) || [];
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [
  {user:"admin", pass:"123", role:"admin"}
];

// LOGIN
function login(){
  let u = document.getElementById("usuario").value;
  let s = document.getElementById("senha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    {login:"admin", senha:"123", tipo:"admin"}
  ];

  let user = usuarios.find(x=>x.login===u && x.senha===s);

  if(!user){
    alert("Usuário ou senha inválidos");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(user));

  if(user.tipo === "vendedor"){
    window.location.href = "vendedor.html";
  }else{
    window.location.href = "dashboard.html";
  }
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
  let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
  atualizar();
}

// SALVAR VENDA
function salvarVenda(){
  let venda = {
    vendedor: vendedor.value,
    valor: Number(valor.value),
    meta: Number(metaVendedor.value) || 0
  };

  vendas.push(venda);
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

function cadastrarUsuario(){
  usuarios.push({
    login: novoLogin.value,
    senha: novaSenha.value,
    tipo: tipoUsuario.value
  });
  salvarUsuarios();
  alert("Usuário cadastrado");
}


// ATUALIZAÇÕES
function atualizar(){
  let totalVenda = vendas.reduce((s,v)=>s+v.valor,0);
  total.innerText = totalVenda.toLocaleString("pt-BR");

  let m = Number(meta.value);
  let pct = m > 0 ? (totalVenda / m) * 100 : 0;

  percent.innerText = pct.toFixed(1) + "%";
  percentTexto.innerText = pct.toFixed(1) + "%";
  metaProgresso.style.width = Math.min(pct,100) + "%";

  listar();
  desenharGrafico();
  atualizarRanking();
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

function atualizarRanking(){
  let ranking = {};
  let metas = {};

  vendas.forEach(v => {
    if(!ranking[v.vendedor]) ranking[v.vendedor] = 0;
    ranking[v.vendedor] += v.valor;

    if(v.meta && v.meta > 0){
      metas[v.vendedor] = v.meta;
    }
  });

  let ordenado = Object.entries(ranking)
    .sort((a,b)=>b[1]-a[1]);

  rankingLista.innerHTML = "";

  let metaGlobal = Number(meta.value);

  ordenado.forEach((item,i)=>{
    let nome = item[0];
    let total = item[1];

    let metaFinal = metas[nome] || metaGlobal;
    let bateuMeta = metaFinal > 0 && total >= metaFinal;

    let medalha = "";
    if(i==0) medalha="🥇";
    else if(i==1) medalha="🥈";
    else if(i==2) medalha="🥉";

    let li = document.createElement("li");
    if(bateuMeta) li.classList.add("meta-batida");

    li.innerHTML = `
      <div>${medalha} ${nome} ${bateuMeta ? "🎯" : ""}</div>
      <span>R$ ${total.toLocaleString("pt-BR")} / Meta ${metaFinal.toLocaleString("pt-BR")}</span>
    `;

    rankingLista.appendChild(li);
  });
}

function carregarPainelVendedor(){
  let user = JSON.parse(localStorage.getItem("usuarioLogado"));
  if(!user || user.tipo!="vendedor"){
    location.href="index.html";
    return;
  }

  let vendasVend = vendas.filter(v=>v.vendedor==user.login);
  let total = vendasVend.reduce((s,v)=>s+v.valor,0);

  let metaVend = vendasVend.find(v=>v.meta>0)?.meta || Number(meta.value);

  let pct = metaVend>0 ? (total/metaVend)*100 : 0;

  totalVendedor.innerText = total.toLocaleString("pt-BR");
  metaVend.innerText = metaVend.toLocaleString("pt-BR");
  pctVend.innerText = pct.toFixed(1)+"%";
  barraVend.style.width = Math.min(pct,100)+"%";
}
