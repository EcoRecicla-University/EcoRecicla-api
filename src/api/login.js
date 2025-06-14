const connection = require('../core/connection.js');

class apiLogin {
    
    async buscarUsuario(email, senha) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT Nome, ID_Funci FROM funcionarios WHERE email = ? AND senha = ?';
            connection.query(query, [email, senha], (err, results) => {
                if (err) return reject('Erro ao consultar o banco: ' + err);
                return resolve(results[0] || null);
            });
        });
    }


    async getUsuarioPorEmail(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT ID_Funci, Email, Senha FROM funcionarios WHERE email = ?', [email], (err, rows) => {
                if (err) {
                    reject('Erro na consulta: ' + err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    async atualizarSenha(idFunci, novaSenha) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE funcionarios SET senha = ? WHERE ID_Funci = ?', [novaSenha, idFunci], (err, result) => {
                if (err) {
                    reject('Erro ao atualizar senha: ' + err);
                } else {
                    console.log('Senha atualizada com sucesso para o email:', idFunci);
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new apiLogin();
