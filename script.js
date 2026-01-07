// ===== CONTROLE DE LOGIN =====
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let leads = JSON.parse(localStorage.getItem("leads")) || [];
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

let users = JSON.parse(localStorage.getItem("users")) || [
  { user: "admin", pass: "123", role: "admin" }
];

// ===== LOGIN =====
function login() {
  const u = document.getElementById("loginUser").value;
  const p = document.getElementById("loginPass").value;

  const ok = users.find(x => x.user === u && x.pass === p);
  if (ok) {
    localStorage.setItem("logado", ok.role);
    window.location = "dashboard.html";
  } else {
    document.getElementById("loginErro").innerText = "Usuário ou senha inválidos";
  }
}

function logout() {
  localStorage.removeItem("logado");
  window.location = "index.html";
}

// ===== NAVEGAÇÃO =====
function openPage(id, btn) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));

  document.getElementById(id).style.display = "bl
