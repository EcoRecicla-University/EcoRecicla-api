const connection = require('../core/connection');

class apiEstoque {

    listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT Categoria, Qtd_Total, Ult_Data_Entrada
                FROM estoque
                ORDER BY Categoria
            `;

            connection.query(sql, (err, rows) => {
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }

                return resolve(rows);
            });
        });
    }
    /**
     * @param {string} categoria 
     * @param {number} quantidade 
     * @param {string} dataEntrada 
     * @returns {Promise<{atualizado?: boolean, criado?: boolean}>}
     */
    atualizarEstoque(categoria, quantidade, dataEntrada) {
        return new Promise((resolve, reject) => {
            const sqlVerifica = `SELECT 1 FROM estoque WHERE Categoria = ?`;

            connection.query(sqlVerifica, [categoria], (err, rows) => {
                if (err) {
                    return reject('Erro na verificação de estoque: ' + err);
                }

                if (rows.length > 0) {
                    // Atualiza quantidade e data
                    const sqlUpdate = `
                        UPDATE estoque
                        SET Qtd_Total = Qtd_Total + ?, Ult_Data_Entrada = ?
                        WHERE Categoria = ?
                    `;
                    connection.query(sqlUpdate, [quantidade, dataEntrada, categoria], (err2) => {
                        if (err2) {
                            return reject('Erro ao atualizar estoque: ' + err2);
                        }
                        return resolve({ atualizado: true });
                    });
                } else {
                    // Insere novo registro
                    const sqlInsert = `
                        INSERT INTO estoque (Categoria, Qtd_Total, Ult_Data_Entrada)
                        VALUES (?, ?, ?)
                    `;
                    connection.query(sqlInsert, [categoria, quantidade, dataEntrada], (err3) => {
                        if (err3) {
                            return reject('Erro ao inserir estoque: ' + err3);
                        }
                        return resolve({ criado: true });
                    });
                }
            });
        });
    }
}

module.exports = new apiEstoque();
