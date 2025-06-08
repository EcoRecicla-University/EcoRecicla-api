const connection = require('../core/connection.js');
const triagemValidator = require('../validator/triagem.js')

class ApiTriagem {

    listarTodos() {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT e.Cidade, c.* from centros c INNER JOIN endereco e ON c.ID_Centro = e.ID_Centro;';
            
            connection.query(sql,(err, rows) => {

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
            + '(Capaci_Armaze, Nome_Centro)'
            + ' VALUES (?, ?)';

            const values = [
                capacidade,
                nomeCentro
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
}

module.exports = new ApiTriagem();