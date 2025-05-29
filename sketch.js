let estado = 'plantio'; // Estados: plantio, crescimento, colheita, fermentacao, assando, pao_pronto
let tempo = 0;
let trigo = [];
const NUM_PLANTAS = 20;
let alturaMaxTrigo = 80;
let larguraTrigo = 20;
let corTrigo = [101, 67, 33]; // Marrom terra inicial
let faseCrescimento = 0; // 0: plantado, 1: crescendo, 2: maduro

// Variáveis de Qualidade e Condição (Valores iniciais definidos)
let saudeSolo = 0.8;
let chuva = 0.7;
let pragas = 0.1; // Nível de infestação (0 a 1)
let nutrientesSolo = 0.9;
let crescimento = 0;
let qualidadeTrigoColheita = 0.7;
let qualidadeFarinha = 0.8; // A qualidade da farinha agora é baseada diretamente na colheita
let fermentacaoNatural = true;
let tempoFermentacao = 0;
const TEMPO_FERMENTACAO_MAX = 300; // Simulado em frames
let tempoAssando = 0;
const TEMPO_ASSANDO_MAX = 200; // Simulado em frames
let qualidadePaoFinal = 0.8;

function setup() {
  createCanvas(600, 450);
  textSize(16);
  textAlign(CENTER, CENTER);
  // Plantio inicial automático
  for (let i = 0; i < NUM_PLANTAS; i++) {
    trigo.push({
      x: random(larguraTrigo / 2, width - larguraTrigo / 2),
      y: height - 30,
      altura: 5,
      fase: 0
    });
  }
}

function draw() {
  background(240);

  if (estado === 'plantio') {
    mostrarPlantio();
    tempo++;
    if (tempo > 100) {
      estado = 'crescimento';
      tempo = 0;
    }
  } else if (estado === 'crescimento') {
    mostrarCrescimento();
    tempo++;
    if (tempo % 5 === 0) {
      for (let i = 0; i < trigo.length; i++) {
        if (trigo[i].fase < 2) {
          trigo[i].altura += (saudeSolo + chuva + nutrientesSolo) * (1 - pragas) * 0.5;
          trigo[i].altura = constrain(trigo[i].altura, 5, alturaMaxTrigo);
          if (trigo[i].altura > alturaMaxTrigo * 0.7 && trigo[i].fase < 1) {
            trigo[i].fase = 1; // Fase de espiga
            corTrigo = [255, 204, 0]; // Amarelo maduro
          }
          if (trigo[i].altura >= alturaMaxTrigo && trigo[i].fase < 2) {
            trigo[i].fase = 2; // Maduro para colheita
          }
        }
      }
    }
    if (tempo > 400) {
      estado = 'colheita';
      tempo = 0;
    }
  } else if (estado === 'colheita') {
    mostrarColheita();
    tempo++;
    if (tempo % 10 === 0) {
      if (trigo.length > 0) {
        trigo.pop(); // Simula a colheita de uma planta
      }
      if (trigo.length === 0) {
        estado = 'fermentacao';
        tempo = 0;
        // A qualidade da farinha é determinada pela qualidade do trigo colhido
        qualidadeFarinha = map(qualidadeTrigoColheita, 0, 1, 0.6, 0.9);
      }
    }
  } else if (estado === 'fermentacao') {
    mostrarFermentacao();
    tempoFermentacao++;
    if (tempoFermentacao > TEMPO_FERMENTACAO_MAX) {
      estado = 'assando';
      tempo = 0;
      tempoFermentacao = 0;
    }
  } else if (estado === 'assando') {
    mostrarAssando();
    tempoAssando++;
    if (tempoAssando > TEMPO_ASSANDO_MAX) {
      estado = 'pao_pronto';
      tempo = 0;
      tempoAssando = 0;
      qualidadePaoFinal = constrain(qualidadeFarinha + (fermentacaoNatural ? 0.1 : 0) + map(tempoAssando, 0, TEMPO_ASSANDO_MAX, -0.1, 0.2), 0.4, 1);
    }
  } else if (estado === 'pao_pronto') {
    mostrarPaoPronto();
  }
}

function mostrarPlantio() {
  fill(101, 67, 33); // Cor da terra
  rect(0, height - 30, width, 30);
  fill(0);
  textSize(20);
  text("Plantando o Trigo...", width / 2, 50);
  for (let planta of trigo) {
    fill(84, 139, 84); // Verde da planta jovem
    rect(planta.x - larguraTrigo / 4, planta.y - planta.altura, larguraTrigo / 2, planta.altura);
  }
}

function mostrarCrescimento() {
  fill(101, 67, 33); // Cor da terra
  rect(0, height - 30, width, 30);
  fill(0);
  textSize(20);
  text("Trigo Crescendo...", width / 2, 50);
  for (let planta of trigo) {
    fill(corTrigo);
    rect(planta.x - larguraTrigo / 4, planta.y - planta.altura, larguraTrigo / 2, planta.altura);
  }
  textSize(14);
  text(`Solo: S:${saudeSolo.toFixed(2)} N:${nutrientesSolo.toFixed(2)}`, 150, 100);
  text(`Chuva: ${chuva.toFixed(2)}`, 150, 120);
  text(`Pragas: ${pragas.toFixed(2)}`, 150, 140);
}

function mostrarColheita() {
  fill(101, 67, 33); // Cor da terra
  rect(0, height - 30, width, 30);
  fill(0);
  textSize(20);
  text("Colhendo o Trigo...", width / 2, 50);
  for (let planta of trigo) {
    fill(corTrigo);
    rect(planta.x - larguraTrigo / 4, planta.y - planta.altura, larguraTrigo / 2, planta.altura);
  }
}

function mostrarFermentacao() {
  fill(0);
  textSize(20);
  text("Fermentação da Massa", width / 2, 50);
  fill(210, 180, 140);
  ellipse(width / 2, height / 2, 80, 60);
  fill(0);
  textSize(14);
  text(`Tempo de Fermentação: ${floor(map(tempoFermentacao, 0, TEMPO_FERMENTACAO_MAX, 0, 24))} horas`, width / 2, height / 2 + 80);
  text(`Fermentação Natural: ${fermentacaoNatural ? 'Sim' : 'Não'}`, width / 2, height / 2 + 100);
}

function mostrarAssando() {
  fill(0);
  textSize(20);
  text("Assando o Pão", width / 2, 50);
  fill(139, 69, 19);
  rect(width / 2 - 60, height / 2 - 40, 120, 80, 10);
  fill(0);
  textSize(14);
  text(`Tempo Assando: ${floor(map(tempoAssando, 0, TEMPO_ASSANDO_MAX, 0, 40))} minutos`, width / 2, height / 2 + 80);
}

function mostrarPaoPronto() {
  background(200);
  fill(0);
  textSize(24);
  text("Pão Pronto!", width / 2, height * 0.3);
  fill(139, 69, 19); // Cor marrom do pão
  ellipse(width / 2, height / 2 - 20, 90, 70);
  textSize(16);
  text(`Qualidade Final do Pão: ${qualidadePaoFinal.toFixed(2)}`, width / 2, height * 0.6);
  text("Um delicioso pão feito com o trigo colhido.", width / 2, height * 0.7);
}