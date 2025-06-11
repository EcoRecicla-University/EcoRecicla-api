const connection = require('../core/connection.js');
const MovimenValidator = require('../validator/movimen.js')

class ApiMovimen {

    criarNovaMovimen(quantidade, dataEntrada, idRota, categoria, avisarEstoqueMax, avisarEstoqueMin){

        MovimenValidator.validarCriacao(quantidade, dataEntrada, idRota, categoria)

        const sql = 'INSERT INTO movimentacoes '
        + '(Quantidade, Data_Entrada, Categoria, AvisarEstoqueMax, AvisarEstoqueMin, Status_Movimentacao, ID_Rota)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        const values = [
            quantidade,
            dataEntrada,
            categoria,
            avisarEstoqueMax,
            avisarEstoqueMin,
            'A',
            idRota
        ];

        connection.execute(sql, values);
    }

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT m.*, cli.Nome as Nome FROM movimentacoes m
                INNER JOIN rotas r
                ON m.ID_Rota = r.ID_Rota 
                INNER JOIN coletas co
                ON r.ID_Coleta = co.ID_Coleta
                INNER JOIN clientes cli
                ON co.ID_Cliente = cli.ID_Cliente
                WHERE Status_Movimentacao = ?;`, ['A'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getMovimenById(idMovimen) {
    
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT m.*, cli.Nome as Nome FROM movimentacoes m
                INNER JOIN rotas r
                ON m.ID_Rota = r.ID_Rota 
                INNER JOIN coletas co
                ON r.ID_Coleta = co.ID_Coleta
                INNER JOIN clientes cli
                ON co.ID_Cliente = cli.ID_Cliente
                WHERE ID_Movimen = ?;`, [idMovimen], (err, row) => {
            
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

    

    editarMovimen(idMovimentacao, idRota, quantidade, dataEntrada, categoria, avisarEstoqueMax, avisarEstoqueMin) {

        MovimenValidator.validarCriacao(idRota, quantidade, dataEntrada, categoria)

        const sql = 'UPDATE movimentacoes set '
        + 'Quantidade = ?, Data_Entrada = ?, ID_Rota = ?, Categoria = ?, AvisarEstoqueMax = ?, AvisarEstoqueMin = ? '
        + 'WHERE ID_Movimen = ?'

        const values = [
            quantidade,
            dataEntrada,
            idRota,
            categoria,
            avisarEstoqueMax,
            avisarEstoqueMin,
            idMovimentacao
        ]

        connection.execute(sql, values);
    }

    excluirMovimen(id) {

        const sql = 'UPDATE movimentacoes SET Status_Movimentacao = ? '
        + 'WHERE ID_Movimen = ?'
        const values = ['I', id]

        connection.execute(sql, values)
    }

}

module.exports = new ApiMovimen();