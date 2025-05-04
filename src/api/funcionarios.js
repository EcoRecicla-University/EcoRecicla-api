const connection = require('../core/connection.js');

class ApiFuncionarios {

    listarTodos(){

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM funcionarios', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }

}

module.exports = new ApiFuncionarios();