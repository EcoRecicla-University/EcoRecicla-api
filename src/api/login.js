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
            connection.query('SELECT email, senha FROM funcionarios WHERE email = ?', [email], (err, rows) => {
                if (err) {
                    reject('Erro na consulta: ' + err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    async atualizarSenha(email, novaSenha) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE funcionario SET senha = ? WHERE email = ?', [novaSenha, email], (err, result) => {
                if (err) {
                    reject('Erro ao atualizar senha: ' + err);
                } else {
                    console.log('Senha atualizada com sucesso para o email:', email);
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new apiLogin();
