const connection = require('../core/connection.js');
const MovimenValidator = require('../validator/movimen.js')

class ApiMovimen {

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM movimentacoes', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getMovimenById(idMovimen) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM movimentacoes WHERE ID_Movimen = ?', [idMovimen], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const movimen = row[0];
                
                if (movimen) {
                    return resolve(movimen);
                }
                
                return resolve(null);
            });
        });
    }

    criarNovaMovimen(quantidade, dataEntrada){

        MovimenValidator.validarCriacao(quantidade, dataEntrada)

        const sql = 'INSERT INTO movimentacoes '
        + '(Quantidade, Data_Entrada)'
        + ' VALUES (?, ?)';
        const values = [
            quantidade,
            dataEntrada,
        ];

        connection.execute(sql, values);
    }

    editarMovimen(quantidade, dataEntrada) {

        MovimenValidator.validarCriacao(quantidade, dataEntrada)

        const sql = 'UPDATE movimentacoes set'
        + 'Quantidade = ?, Data_Entrada = ?'
        + 'WHERE ID_Movimen = ?'

        const values = [
            quantidade,
            dataEntrada,
            id
        ]
        connection.execute(sql, values);
    }

    excluirMovimen(id) {

        const sql = 'DELETE from movimentacoes '
        + 'WHERE ID_Movimen = ?'
        const values = [id]

        connection.execute(sql, values)
    }

    buscarColeta(idsColeta){

        const sql = 'SELECT ID_Coleta_Tipo_Residuo FROM movimentacoes'
        connection.execute(sql)
    }
}

module.exports = new ApiMovimen();