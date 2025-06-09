const connection = require('../core/connection.js');
const triagemValidator = require('../validator/triagem.js');

class ApiTriagem {

    listarTodos() {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT e.Cidade, c.* from centros c INNER JOIN endereco e ON c.ID_Centro = e.ID_Centro WHERE Status_Centro = ?;';
            const values = ['A']

            connection.query(sql, values, (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    criarNovoCentroTriagem(nomeCentro, capacidade){

        triagemValidator.validarCriacao(nomeCentro, capacidade)
        
        try{

            const sql = 'INSERT INTO centros '
            + '(Capaci_Armaze, Nome_Centro, Status_Centro)'
            + ' VALUES (?, ?, ?)';

            const values = [
                capacidade,
                nomeCentro,
                'A'
            ];
            
            return new Promise((resolve, reject) => {
                connection.execute(sql, values, (err, result) => {
                    if (err) {
                        return reject('Erro ao inserir centro de triagem: ' + err);
                    }
                    
                    const centroId = result.insertId
                    
                    if (centroId) {
                        return resolve(centroId);
                    }
                    
                    return resolve(null);
                });
            })
        } catch(e){
            throw new Error('Erro ao cadastrar centro de triagem')
        }
    }

    getTriagemById(idTriagem) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM centros WHERE ID_Centro = ?;', [idTriagem], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const triagem = row[0];
                
                if (triagem) {
                    return resolve(triagem);
                }
                
                return resolve(null);
            });
        });
    }

    editarTriagem(id, nomeCentro, capacidade) {

        triagemValidator.validarCriacao(nomeCentro, capacidade)

        const sql = 'UPDATE centros set '
        + 'Capaci_Armaze = ?, Nome_Centro = ? '
        + 'WHERE ID_Centro = ?'

        const values = [
            capacidade,
            nomeCentro,
            id
        ]

        connection.execute(sql, values);
    }

    
    excluirTriagem(id) {
        
        const sql = 'UPDATE centros SET Status_Centro = ? WHERE ID_Centro = ?'
        const values = ['I', id]

        connection.execute(sql, values)

    }
}

module.exports = new ApiTriagem();