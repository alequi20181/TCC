const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Estado da aplicação
let hoje = new Date(2026, 9, 27); // Atualizado para a data corrente simulada
let mesAtual = new Date(2026, 9, 1);
let selecionado = null;

let tamanhoFonte = 0; 
let altoContraste = false;
let fonteDislexia = false;

// Objeto para armazenar as seleções do usuário ao longo do fluxo
let dadosAgendamento = {
  tipo: "",
  especialidade: "",
  profissional: "",
  dataStr: "",
  horario: ""
};

// Bancos de dados simulados de opções
const dadosEspecialidades = ["Clínica Médica", "Pediatria", "Ginecologia e Obstetrícia", "Cardiologia", "Ortopedia"];
const dadosProfissionais = {
  "Clínica Médica": ["Dr. Roberto Alencar (Unidade Central)", "Dra. Juliana Mendes (Unidade Norte)"],
  "Pediatria": ["Dra. Clara Rocha (Unidade Infantil)", "Dr. Marcos Vinícius (Unidade Sul)"],
  "Ginecologia e Obstetrícia": ["Dra. Patrícia Silva (Centro da Mulher)"],
  "Cardiologia": ["Dr. Henrique Souza (Instituto do Coração)"],
  "Ortopedia": ["Dr. Fábio Lima (Pronto Atendimento Ortopédico)"]
};
const horariosDisponiveis = ["08:00", "09:30", "10:00", "11:30", "14:00", "15:30", "16:00"];

function chave(data) {
  return data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0") + "-" + String(data.getDate()).padStart(2, "0");
}

// Mecanismo central de navegação entre as telas/etapas
function irParaEtapa(etapaId) {
  // Esconde todas as seções
  document.querySelectorAll(".step-container").forEach(el => el.classList.add("hidden"));
  // Mostra a seção desejada
  document.getElementById("step-" + etapaId).classList.remove("hidden");
  
  // Controle de exibição do menu do topo
  if (etapaId === 'login') {
    document.getElementById("top-nav").classList.add("hidden");
  } else {
    document.getElementById("top-nav").classList.remove("hidden");
  }
  
  // Renderizadores específicos de tela
  if (etapaId === 'especialidade') renderEspecialidades();
  if (etapaId === 'profissional') renderProfissionais();
  if (etapaId === 'data-horario') renderCalendario();
  if (etapaId === 'confirmar') renderResumo();
}

function executarLogin() {
  // Simulação simples de validação de login
  irParaEtapa('inicio');
}

function selecionarAtendimento(tipo) {
  dadosAgendamento.tipo = tipo;
  irParaEtapa('especialidade');
}

function renderEspecialidades() {
  const container = document.getElementById("lista-especialidades");
  container.innerHTML = dadosEspecialidades.map(esp => `
    <button class="option-btn text-left" onclick="selecionarEspecialidade('${esp}')">
      <strong>${esp}</strong>
    </button>
  `).join("");
}

function selecionarEspecialidade(esp) {
  dadosAgendamento.especialidade = esp;
  irParaEtapa('profissional');
}

function renderProfissionais() {
  const container = document.getElementById("lista-profissionais");
  const lista = dadosProfissionais[dadosAgendamento.especialidade] || ["Nenhum profissional disponível"];
  
  container.innerHTML = lista.map(prof => `
    <button class="option-btn text-left" onclick="selecionarProfissional('${prof}')">
      <strong>${prof}</strong>
    </button>
  `).join("");
}

function selecionarProfissional(prof) {
  dadosAgendamento.profissional = prof;
  irParaEtapa('data-horario');
}

// --- Gerenciador de Calendário Incorporado ---
function renderCalendario() {
  document.getElementById("monthTitle").textContent = meses[mesAtual.getMonth()] + " " + mesAtual.getFullYear();
  
  if (selecionado) {
    document.getElementById("selectedTitle").textContent = "Dia escolhido — " + String(selecionado.getDate()).padStart(2, "0") + "/" + String(selecionado.getMonth() + 1).padStart(2, "0") + "/" + selecionado.getFullYear();
    document.getElementById("horarios-container").classList.remove("hidden");
    renderHorarios();
  } else {
    document.getElementById("selectedTitle").textContent = "Selecione um dia no calendário acima";
    document.getElementById("horarios-container").classList.add("hidden");
  }

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  const primeiro = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1).getDay();
  const total = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();

  for (let i = 0; i < primeiro; i++) {
    const vazio = document.createElement("div");
    vazio.className = "day empty";
    calendar.appendChild(vazio);
  }

  for (let dia = 1; dia <= total; dia++) {
    const data = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);
    const key = chave(data);
    const botao = document.createElement("button");
    
    botao.className = "day" + (selecionado && key === chave(selecionado) ? " selected" : "");
    botao.onclick = () => { 
      selecionado = data; 
      dadosAgendamento.dataStr = String(selecionado.getDate()).padStart(2, "0") + "/" + String(selecionado.getMonth() + 1).padStart(2, "0") + "/" + selecionado.getFullYear();
      renderCalendario(); 
    };
    
    botao.innerHTML = '<span class="day-number">' + dia + '</span>';
    calendar.appendChild(botao);
  }
}

function mudarMes(valor) {
  mesAtual = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + valor, 1);
  renderCalendario();
}

function renderHorarios() {
  const container = document.getElementById("horarios-container");
  container.innerHTML = horariosDisponiveis.map(hr => `
    <button class="time-slot-btn" onclick="selecionarHorario('${hr}')">${hr}</button>
  `).join("");
}

function selecionarHorario(horario) {
  dadosAgendamento.horario = horario;
  irParaEtapa('confirmar');
}

function renderResumo() {
  document.getElementById("summary-tipo").textContent = dadosAgendamento.tipo;
  document.getElementById("summary-especialidade").textContent = dadosAgendamento.especialidade;
  document.getElementById("summary-medico").textContent = dadosAgendamento.profissional;
  document.getElementById("summary-data").textContent = dadosAgendamento.dataStr;
  document.getElementById("summary-horario").textContent = dadosAgendamento.horario;
}

function finalizarAgendamento() {
  const numProtocolo = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("ticket-protocolo").textContent = `Protocolo: #AG${numProtocolo}`;
  document.getElementById("ticket-detalhes").innerHTML = `
    <strong>${dadosAgendamento.especialidade} (${dadosAgendamento.tipo})</strong><br>
    ${dadosAgendamento.profissional}<br>
    Data: ${dadosAgendamento.dataStr} às ${dadosAgendamento.horario}
  `;
  irParaEtapa('concluido');
}

function reiniciarFluxo() {
  dadosAgendamento = { tipo: "", especialidade: "", profissional: "", dataStr: "", horario: "" };
  selecionado = null;
  irParaEtapa('inicio');
}

// --- Controle Flutuante de Acessibilidade ---
function toggleMenuAcessibilidade() {
  const painel = document.getElementById("accessibility-panel");
  painel.classList.toggle("hidden");
}

function alterarFonte() {
  tamanhoFonte = (tamanhoFonte + 1) % 3;
  document.body.classList.remove("font-large", "font-xlarge");
  if (tamanhoFonte === 1) document.body.classList.add("font-large");
  if (tamanhoFonte === 2) document.body.classList.add("font-xlarge");
}

function alternarContraste() {
  altoContraste = !altoContraste;
  document.body.classList.toggle("high-contrast", altoContraste);
}

function alternarDislexia() {
  fonteDislexia = !fonteDislexia;
  document.body.classList.toggle("dyslexia-friendly", fonteDislexia);
}

// Inicialização na tela de login
irParaEtapa('login');
