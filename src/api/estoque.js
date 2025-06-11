const connection = require('../core/connection.js');

class ApiEstoque {
    
    getEstoqueById(idEstoque) {
    
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    ce.ID_Centro,
                    ce.Nome_Centro,
                    ro.ID_Rota,
                    m.ID_Movimen,
                    co.ID_Coleta,
                    cli.Nome AS Nome_Coleta,
                    m.Quantidade,
                    m.Categoria
                FROM centros ce
                INNER JOIN rotas ro ON ce.ID_Centro = ro.ID_Centro_Fim
                INNER JOIN coletas co ON ro.ID_Coleta = co.ID_Coleta
                INNER JOIN clientes cli ON co.ID_Cliente = cli.ID_Cliente
                INNER JOIN movimentacoes m ON ro.ID_Rota = m.ID_Rota
                WHERE ce.ID_Centro = ?;`, [idEstoque], (err, rows) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const estoque = rows;
                
                if (estoque) {
                    return resolve(estoque);
                }
                
                return resolve(null);
            });
        });
    }

}

module.exports = new ApiEstoque();