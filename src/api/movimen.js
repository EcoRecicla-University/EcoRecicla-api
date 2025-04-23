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

    criarNovoMovimen(dataEntrada, quantEntrada){

        MovimenValidator.validarCriacao(dataEntrada, quantEntrada)

        const sql = 'INSERT INTO movimentacoes '
        + '(Data_Entrada, Capaci_Armaze)'
        + ' VALUES (?, ?)';
        const values = [
            dataEntrada,
            quantEntrada,
            
        ];

        connection.execute(sql, values);
    }

    editarCentro(dataEntrada, quantEntrada) {

        MovimenValidator.validarCriacao(dataEntrada, quantEntrada)

        const sql = 'UPDATE movimentacoes set'
        + 'Data_Entrada = ?, Quantidade_Entra = ? '
        + 'WHERE ID_Movimen = ?'

        const values = [
            dataEntrada,
            quantEntrada,
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
}

module.exports = new ApiMovimen();