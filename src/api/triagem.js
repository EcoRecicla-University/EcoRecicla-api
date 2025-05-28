const connection = require('../core/connection.js');
const triagemValidator = require('../validator/triagem.js')

class ApiTriagem {

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
}

module.exports = new ApiTriagem();