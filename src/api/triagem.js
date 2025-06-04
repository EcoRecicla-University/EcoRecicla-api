const connection = require('../core/connection.js');
const triagemValidator = require('../validator/triagem.js');

class ApiTriagem {

    listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT e.Cidade, c.*
                FROM centros c
                INNER JOIN endereco e ON c.ID_Centro = e.ID_Centro
                WHERE c.Ativo = 'S';
                `;

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

        inativarCentro(idCentro) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE centros SET Ativo = "N" WHERE ID_Centro = ?';

            connection.execute(sql, [idCentro], (err, result) => {
                if (err) {
                    return reject('Erro ao inativar centro: ' + err);
                }

                return resolve({ success: true });
            });
        });
    }

    editarCentroTriagem(idCentro, nomeCentro, capacidade) {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE centros 
        SET Nome_Centro = ?, Capaci_Armaze = ?
        WHERE ID_Centro = ?
        `;

        const values = [nomeCentro, capacidade, idCentro];

        connection.execute(sql, values, (err) => {
        if (err) {
            return reject(new Error('Erro ao editar centro: ' + err));
        }

        return resolve();
        });
      });
    }


    buscarPorId(idCentro) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT c.ID_Centro, c.Nome_Centro, c.Capaci_Armaze, 
                   e.CEP, e.Logradouro, e.Cidade, e.Estado, e.Bairro, e.Numero
            FROM centros c
            LEFT JOIN endereco e ON c.ID_Centro = e.ID_Centro
            WHERE c.ID_Centro = ?;
        `;

        connection.execute(sql, [idCentro], (err, rows) => {
            if (err) {
                return reject('Erro ao buscar centro: ' + err);
            }

            if (!rows || rows.length === 0) {
                return resolve(null);
            }

            const row = rows[0];

            return resolve({
                ID_Centro: row.ID_Centro,
                Nome_Centro: row.Nome_Centro,
                Capacidade_Armaze: row.Capaci_Armaze,
                Endereco: {
                    CEP: row.CEP,
                    Logradouro: row.Logradouro,
                    Localidade: row.Cidade, 
                    Estado: row.Estado,
                    Bairro: row.Bairro,
                    Numero: row.Numero
                }
            });
        });
    });
}



}

module.exports = new ApiTriagem();