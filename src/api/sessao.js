const connection = require('../core/connection.js');

class ApiSessao {
    async criarSessao(token, username, dataExpiracaoToken, idLogin) {
        try {
            const sql = 'INSERT INTO sessao (username, token, Token_Expiraacao, ID_Login) VALUES (?, ?, ?, ?)';
            const values = [username, token, dataExpiracaoToken, idLogin];

            await connection.execute(sql, values);
            console.log('Token salvo no banco de dados com sucesso!');
        } catch (error) {
            console.error('Erro ao inserir token no banco de dados:', error);
            throw error;
        }
    }
}

module.exports = new ApiSessao()