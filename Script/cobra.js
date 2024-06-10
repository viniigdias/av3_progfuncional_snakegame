var tela;
var ctx;
var pontosHTML = document.getElementById("score");
var numero = 0;

var cabeca;
var maca;
var bola;
var bomba;
var macaPodre;

var pontos;
var maca_x;
var maca_y;
var bomba_x;
var bomba_y;
var macaPodre_x;
var macaPodre_y;

var paraEsquerda = false;
var paraDireita = true;
var paraCima = false;
var paraBaixo = false;
var noJogo = true;

const TAMANHO_PONTO = 10;
const ALEATORIO_MAXIMO = 29;
const ATRASO = 140;
const C_ALTURA = 300;
const C_LARGURA = 300;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;
const TECLA_ESPACO = 32;

var x = [];
var y = [];

let players = []; // Declaração única da variável players

onkeydown = verificarTecla; // Define função chamada ao se pressionar uma tecla

iniciar(); // Chama função inicial do jogo

// Função para inserir um jogador no banco de dados
function inserirJogador(nome, pontos) {
    console.log('Jogador inserido:', nome, pontos);
}

// Função para inserir um ranking no banco de dados
function inserirRanking(jogador_id, pontos) {
    console.log('Inserindo ranking para jogador_id:', jogador_id, 'com pontos:', pontos);
}

// Função para exibir o ranking no jogo
function exibirRanking() {
    var rankingDiv = document.getElementById("ranking");
    rankingDiv.innerHTML = "<h3>Ranking:</h3>";
}

if (localStorage.getItem("partida")) {
    players = JSON.parse(localStorage.getItem("partida"));
    exibirRanking();
}

// Definição das funções
function iniciar() {
    tela = document.getElementById("tela");
    ctx = tela.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    carregarImagens();
    pontos = 3;
    criarCobra();
    localizarBomba();
    localizarMaca();
    localizarMacaPodre();
    setTimeout(cicloDeJogo, ATRASO);
}

function carregarImagens() {
    cabeca = new Image();
    cabeca.src = "/Imagens/cabeca.png";

    bola = new Image();
    bola.src = "/Imagens/ponto.png";

    maca = new Image();
    maca.src = "/Imagens/maca.png";

    bomba = new Image();
    bomba.src = "/Imagens/bomba.png";

    macaPodre = new Image();
    macaPodre.src = "/Imagens/macaPodre.png";
}

// Definição da função criarCobra 
function criarCobra() {
    for (let z = 0; z < pontos; z++) {
        x[z] = 50 - z * TAMANHO_PONTO;
        y[z] = 50;
    }
}


function localizarMaca() {
    var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_y = r * TAMANHO_PONTO;
}

function localizarBomba() {
    var n = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    bomba_x = n * TAMANHO_PONTO;

    n = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    bomba_y = n * TAMANHO_PONTO;
}

function localizarMacaPodre() {
    var m = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    macaPodre_x = m * TAMANHO_PONTO;

    m = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    macaPodre_y = m * TAMANHO_PONTO;
}

function cicloDeJogo() {
    if (noJogo) {
        verificarMaca();
        verificarBomba();
        verificarMacaPodre();
        verificarColisao();
        mover();
        fazerDesenho();
        setTimeout(cicloDeJogo, ATRASO);
    }
}

//Funcao lambda recursiva
const verificarPremioPrimeiroLugar = (pontuacaoAtual, maiorPontuacao) => {
    if (pontuacaoAtual > maiorPontuacao) {
        console.log("Parabéns! Você alcançou uma nova maior pontuação!");
    }
};

// Função lambda com currying
const bonusPontos = (bonus) => (macaCount) => {
    return bonus * macaCount;
}

let macaCount = 0;

// Função lambda com List Comprehension
const calcularPontosGanhos = (macaCount) => (
    (pontosNormais) => pontosNormais + (2 * macaCount)
);

// Função lambda que recebe macaCount e retorna outra função. Essa função retornada usa uma List Comprehension para calcular os pontos ganhos pela cobra quando come uma maçã
function verificarMaca() {
    if ((x[0] == maca_x) && (y[0] == maca_y)) {
        macaCount++;
        pontos += calcularPontosGanhos(macaCount)(1); // Calcula os pontos ganhos
        pontosHTML.innerHTML = pontos;
        localizarMaca();
    } else {
        macaCount = 0; // Reseta o contador se a cobra não comer a maçã
    }
}

function verificarMacaPodre() {
    if ((x[0] == macaPodre_x) && (y[0] == macaPodre_y)) {
        pontos--;
        pontosHTML.innerHTML = pontos;
        localizarMacaPodre();
    }
}

function verificarBomba() {
    if ((x[0] == bomba_x) && (y[0] == bomba_y)) {
        localizarBomba();
        fimDeJogo();
    }
}

// Função lambda de alta ordem
function verificarColisao() {
    // Função lambda de alta ordem para verificar se a cobra colidiu com ela mesma
    const colidiuComCobra = (z) => (z > 4) && (x[0] == x[z]) && (y[0] == y[z]);

    // Usando o método some() com a função lambda para verificar a colisão
    if (Array.from({ length: pontos }, (_, z) => z).some(colidiuComCobra)) {
        noJogo = false;
    }

    // Verificações de colisão com as bordas
    const colidiuComBorda = (coord, limite) => (coord[0] >= limite || coord[0] < 0);

    if (colidiuComBorda(y, C_ALTURA) || colidiuComBorda(x, C_LARGURA)) {
        noJogo = false;
    }
}

function mover() {
    if (numero == 0) {
        for (var z = pontos; z > 0; z--) {
            x[z] = x[z - 1];
            y[z] = y[z - 1];
        }

        if (paraEsquerda) {
            x[0] -= TAMANHO_PONTO;
        }

        if (paraDireita) {
            x[0] += TAMANHO_PONTO;
        }

        if (paraCima) {
            y[0] -= TAMANHO_PONTO;
        }

        if (paraBaixo) {
            y[0] += TAMANHO_PONTO;
        }
    }
    if (numero == 1) {
        console.log('');
    }
}

function fazerDesenho() {
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    if (noJogo) {
        ctx.drawImage(maca, maca_x, maca_y);
        ctx.drawImage(bomba, bomba_x, bomba_y);
        ctx.drawImage(macaPodre, macaPodre_x, macaPodre_y);
        for (var z = 0; z < pontos; z++) {
            if (z == 0) {
                ctx.drawImage(cabeca, x[z], y[z]);
            } else {
                ctx.drawImage(bola, x[z], y[z]);
            }
        }
    } else {
        fimDeJogo();
    }
}

function fimDeJogo() {
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "normal bold 18px serif";
    ctx.fillText("Fim de Jogo", C_LARGURA / 2, C_ALTURA / 2);

    var jogadorNome = prompt('Digite seu nome');
    var player = {
        nome: jogadorNome,
        jogadorPontos: pontos
    };

    console.log('Fim de jogo. Jogador:', player);

    players.push(player);
    armazenarJogadores(players); // Armazenar todos os jogadores no banco de dados

    // Exibir o ranking na tela
    exibirRanking();
}

function armazenarJogadores(jogadores) {
    jogadores.forEach(jogador => {
        inserirJogador(jogador.nome, jogador.jogadorPontos);
    });
}



function verificarTecla(e) {
    var tecla = e.keyCode;
    if (tecla == TECLA_ESPACO) {
        if (numero == 0) {
            numero = 1;
            return;
        }
        if (numero == 1) {
            numero = 0;
            return;
        }
    }

    if ((tecla == TECLA_ESQUERDA) && (!paraDireita)) {
        paraEsquerda = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_DIREITA) && (!paraEsquerda)) {
        paraDireita = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_ACIMA) && (!paraBaixo)) {
        paraCima = true;
        paraDireita = false;
        paraEsquerda = false;
    }

    if ((tecla == TECLA_ABAIXO) && (!paraCima)) {
        paraBaixo = true;
        paraDireita = false;
        paraEsquerda = false;
    }
}

// Função lambda que recebe o array de jogadores e retorna o ranking como um dicionário
const calcularRanking = (players) => {
    const ranking = {};
    players.forEach(player => {
        ranking[player.nome] = player.jogadorPontos;
    });
    return ranking;
};

function exibirRankingg() {
    var rankingDiv = document.getElementById("ranking");
    rankingDiv.innerHTML = "<h3>Ranking:</h3>";

    // Função lambda para calcular o ranking
    const calcularRanking = (players) => {
        const ranking = {};
        players.forEach(player => {
            ranking[player.nome] = player.jogadorPontos;
        });
        return ranking;
    };

    // Calcula o ranking
    const ranking = calcularRanking(players);

    // Ordena o ranking em ordem decrescente utilizando funções lambda
    const sortedRanking = Object.entries(ranking)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    // Exibe o ranking ordenado na página
    for (const [nome, pontos] of Object.entries(sortedRanking)) {
        var playerDiv = document.createElement("div");
        playerDiv.textContent = `${nome}: ${pontos} pontos`;
        rankingDiv.appendChild(playerDiv);
    }
}

function exibirRanking() {
    var rankingDiv = document.getElementById("ranking");
    rankingDiv.innerHTML = "<h3>Ranking:</h3>";

    // Ordenar os jogadores pelo número de pontos (em ordem decrescente)
    players.sort((a, b) => b.jogadorPontos - a.jogadorPontos);

    // Exibir cada jogador e sua pontuação na div de ranking
    players.forEach(player => {
        var playerDiv = document.createElement("div");
        playerDiv.textContent = `${player.nome}: ${player.jogadorPontos} pontos`;
        rankingDiv.appendChild(playerDiv);
    });
}


// Exemplo de dados de jogadores
players = [
    { nome: 'Jogador1', jogadorPontos: 10 },
    { nome: 'Jogador2', jogadorPontos: 15 },
    { nome: 'Jogador3', jogadorPontos: 1 }
];

// Chama a função para exibir o ranking
exibirRanking();

// Função para extrair e exibir os nomes dos jogadores utilizando o map
function exibirNomesDosJogadores() {
    const nomesDosJogadores = players.map(player => player.nome);
    console.log("Nomes dos jogadores:", nomesDosJogadores);
}

// Chama a função para exibir os nomes dos jogadores
exibirNomesDosJogadores();

// Definição do monad Maybe para tratamento seguro de exceções
const Maybe = function (value) {
    this.__value = value;
};

// Método bind para encadear operações seguras
Maybe.prototype.bind = function (func) {
    if (this.__value instanceof Error) {
        // Se o valor for uma instância de Error, retorna um novo Maybe com o mesmo valor
        return Maybe.of(this.__value);
    }
    // Se o valor for válido, aplica a função ao valor e retorna um novo Maybe com o resultado
    try {
        const result = func(this.__value);
        return Maybe.of(result);
    } catch (error) {
        return Maybe.of(error);
    }
};

// MONAD Maybe para garantir que a movimentação da cobra seja feita de forma segura, lidando com as exceções.

// Método fmap para mapear sobre o valor de forma segura
Maybe.prototype.fmap = function (func) {
    return this.bind(value => Maybe.of(func(value)));
};

// Método estático para criar um novo Maybe com um valor
Maybe.of = function (value) {
    return new Maybe(value);
};

// Exemplo de uso do monad Maybe no contexto do jogo da cobrinha
// Função para movimentar a cobra com tratamento seguro de exceções
const moveSnake = (direction) => {
    // Implementação da lógica para movimentar a cobra
    if (direction === 'left') {
        // Lógica para mover a cobra para a esquerda
        return 'Snake moved left'; // Exemplo de retorno bem-sucedido
    } else if (direction === 'right') {
        // Lógica para mover a cobra para a direita
        return 'Snake moved right'; // Exemplo de retorno bem-sucedido
    } else {
        // Lançamento de uma exceção se a direção for inválida
        throw new Error('Invalid direction');
    }
};

// Aplicação do moveSnake utilizando fmap com tratamento seguro de exceções
const safeMove = Maybe.of('left').fmap(moveSnake);

// Exibindo o resultado
safeMove.bind(result => {
    if (result instanceof Error) {
        console.error(result.message); // Se a direção for inválida, exibe a mensagem de erro
    } else {
        console.log(result); // Exibe o resultado do movimento da cobra
    }
});
