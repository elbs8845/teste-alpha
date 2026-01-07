/* =========================
   INICIALIZAÇÃO DO SISTEMA
========================= */

// cria usuário admin padrão
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([
    { user: "admin", pass: "123", role: "admin" }
  ]));
}

// verifica login
const logged = JSON.parse(localStorage.getItem("logged"));
if (!logged) {
  window.location.href = "index.html";
}

/* =========================
   CONTROLE DE PERFIL
========================= */

window.onload = () => {
  if (logged.role !== "admin") {
    const btnUsers = document.getElementById("btnUsers");
    if (btnUsers) btnUsers.style.display = "none";
  }
  renderVendas();
  renderLeads();
  renderAgendamentos();
  renderRanking();
  renderUsers();
};

/* =========================
   LOGOUT
========================= */

function logout() {
  localStorage.removeItem("logged");
  window.location.href = "index.html";
}

/* =========================
   NAVEGAÇÃO
========================= */

function openPage(page, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  if (btn) btn.classList.add("active");
}

/* =========================
   VENDAS + META
========================= */

let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let meta = Number(localStorage.getItem("meta")) || 0;

function addVenda() {
  const cliente = vendCliente.value;
  const produto = vendProduto.value;
  const valor = Number(vendValor.value);
  const vendedor = vendVendedor.value;

  if (!cliente || !produto || !valor || !vendedor) {
    alert("Preencha todos os campos da venda");
    return;
  }

  vendas.push({
    cliente,
    produto,
    valor,
    vendedor,
    data: new Date().toLocaleDateString()
  });

  localStorage.setItem("vendas", JSON.stringify(vendas));
  renderVendas();
}

function renderVendas() {
  const lista = document.getElementById("listaVendas");
  const totalEl = document.getElementById("totalVendido");
  const percentEl = document.getElementById("percentMeta");
  const barra = document.getElementById("barraMeta");
  const metaInput = document.getElementById("metaValor");

  lista.innerHTML = "";
  let total = 0;

  vendas.forEach(v => {
    total += v.valor;
    lista.innerHTML += `<li>${v.cliente} | ${v.vendedor} | R$ ${v.valor.toFixed(2)}</li>`;
  });

  totalEl.innerText = total.toFixed(2);

  meta = Number(metaInput.value) || 0;
  localStorage.setItem("meta", meta);

  let percent = meta > 0 ? (total / meta) * 100 : 0;
  percentEl.innerText = percent.toFixed(1) + "%";
  barra.style.width = Math.min(percent, 100) + "%";

  renderRanking();
}

/* =========================
   RANKING
========================= */

function renderRanking() {
  const lista = document.getElementById("listaRanking");
  if (!lista) return;

  let ranking = {};

  vendas.forEach(v => {
    ranking[v.vendedor] = (ranking[v.vendedor] || 0) + v.valor;
  });

  lista.innerHTML = "";

  Object.entries(ranking)
    .sort((a, b) => b[1] - a[1])
    .forEach((v, i) => {
      lista.innerHTML += `<li>${i + 1}º ${v[0]} – R$ ${v[1].toFixed(2)}</li>`;
    });
}

/* =========================
   LEADS
========================= */

let leads = JSON.parse(localStorage.getItem("leads")) || [];

function addLead() {
  const nome = leadNome.value;
  const telefone = leadTelefone.value;

  if (!nome || !telefone) {
    alert("Preencha todos os campos do lead");
    return;
  }

  leads.push({ nome, telefone });
  localStorage.setItem("leads", JSON.stringify(leads));
  renderLeads();
}

function renderLeads() {
  const lista = document.getElementById("listaLeads");
  if (!lista) return;

  lista.innerHTML = "";
  leads.forEach(l => {
    lista.innerHTML += `<li>${l.nome} - ${l.telefone}</li>`;
  });
}

/* =========================
   AGENDAMENTOS
========================= */

let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

function addAgendamento() {
  const cliente = agCliente.value;
  const data = agData.value;

  if (!cliente || !data) {
    alert("Preencha todos os campos do agendamento");
    return;
  }

  agendamentos.push({ cliente, data });
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  renderAgendamentos();
}

function renderAgendamentos() {
  const lista = document.getElementById("listaAgendamentos");
  if (!lista) return;

  lista.innerHTML = "";
  agendamentos.forEach(a => {
    lista.innerHTML += `<li>${a.cliente} - ${a.data}</li>`;
  });
}

/* =========================
   USUÁRIOS (ADMIN)
========================= */

function addUser() {
  const user = newUser.value;
  const pass = newPass.value;
  const role = newRole.value;

  if (!user || !pass) {
    alert("Preencha usuário e senha");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ user, pass, role });
  localStorage.setItem("users", JSON.stringify(users));

  renderUsers();
}

function renderUsers() {
  const lista = document.getElementById("listaUsers");
  if (!lista) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  lista.innerHTML = "";

  users.forEach(u => {
    lista.innerHTML += `<li>${u.user} (${u.role})</li>`;
  });
}
