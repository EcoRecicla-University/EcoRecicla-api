const connection = require('../core/connection.js');

class ApiSessao {
    async criarSessao(tokenCriado, dataExpiracaoToken, idFunci) {
        try {
            const sql = 'INSERT INTO sessao (token, Token_Expiracao, ID_Funci) VALUES (?, ?, ?)';
            const values = [tokenCriado, dataExpiracaoToken, idFunci];

            connection.execute(sql, values);
            console.log('Token salvo no banco de dados com sucesso!');
        } catch (error) {
            console.error('Erro ao inserir token no banco de dados:', error);
            throw error;
        }
    }
}

module.exports = new ApiSessao()