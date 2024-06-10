const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '124272',
    database: 'snake_game'
});

connection.connect();

// Função para inserir um jogador
function inserirJogador(nome, pontos) {
    const query = 'INSERT INTO jogadores (nome, pontos) VALUES (?, ?)';
    connection.query(query, [nome, pontos], (error, results) => {
        if (error) throw error;
        console.log('Jogador inserido:', results.insertId);
    });
}

// Função para inserir um ranking
function inserirRanking(jogador_id, pontos) {
    console.log('Inserindo ranking para jogador_id:', jogador_id, 'com pontos:', pontos);
    const query = 'INSERT INTO ranking (jogador_id, pontos) VALUES (?, ?)';
    connection.query(query, [jogador_id, pontos], (error, results) => {
        if (error) {
            console.error('Erro ao inserir ranking:', error);
        } else {
            console.log('Ranking inserido:', results.insertId);
        }
    });
}

// Função para obter o ranking
function obterRanking(callback) {
    const query = `
    SELECT jogadores.nome, ranking.pontos 
    FROM ranking 
    JOIN jogadores ON ranking.jogador_id = jogadores.id 
    ORDER BY ranking.pontos DESC
    `;
    connection.query(query, (error, results) => {
        if (error) throw error;
        callback(results);
    });
}

// Função para obter jogadores
function obterJogadores(callback) {
    const query = 'SELECT * FROM jogadores';
    connection.query(query, (error, results) => {
        if (error) throw error;
        callback(results);
    });
}

// Função para obter rankings
function obterRankings(callback) {
    const query = 'SELECT * FROM ranking';
    connection.query(query, (error, results) => {
        if (error) throw error;
        callback(results);
    });
}

// Exemplo de uso para verificar os dados
inserirJogador('Jogador4', 130);
inserirRanking(4, 130);

obterJogadores((jogadores) => {
    console.log('Jogadores:', jogadores);
});

obterRankings((rankings) => {
    console.log('Rankings:', rankings);
});

obterRanking((ranking) => {
    console.log('Ranking detalhado:', ranking);
});

// Fecha a conexão após um tempo para garantir que todas as operações sejam concluídas
setTimeout(() => {
    connection.end();
}, 5000);
