const connection = require('../core/connection.js');
const CentroValidator = require('../validator/centro.js')

class ApiCentro {

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM centros', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getCentroById(idCentro) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM centros WHERE ID_Centro = ?', [idCentro], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const centro = row[0];
                
                if (centro) {
                    return resolve(centro);
                }
                
                return resolve(null);
            });
        });
    }

    criarNovoCentro(endereco, capaciArmaze){

        CentroValidator.validarCriacao(endereco, capaciArmaze)

        const sql = 'INSERT INTO centros '
        + '(Endereço, Capaci_Armaze)'
        + ' VALUES (?, ?)';
        const values = [
            endereco,
            capaciArmaze,
            
        ];

        connection.execute(sql, values);
    }

    editarCentro(endereco, capaciArmaze) {

        CentroValidator.validarCriacao(endereco, capaciArmaze)

        const sql = 'UPDATE Centros set '
        + 'Endereço = ?, Capaci_Armaze = ? '
        + 'WHERE ID_Centro = ?'

        const values = [
            endereco,
            capaciArmaze,
            id
        ]
        connection.execute(sql, values);
    }

    excluirCentro(id) {

        const sql = 'DELETE from centros '
        + 'WHERE ID_Centro = ?'
        const values = [id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiCentro();