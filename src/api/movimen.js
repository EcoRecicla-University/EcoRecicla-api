const connection = require('../core/connection.js');
const MovimenValidator = require('../validator/movimen.js')

class ApiMovimen {

    criarNovaMovimen(quantidade, dataEntrada, idColeta, categoria, avisarEstoqueMax, avisarEstoqueMin){

        MovimenValidator.validarCriacao(quantidade, dataEntrada, idColeta, categoria)

        if(avisarEstoqueMax == true){
            avisarEstoqueMax = 'S';
        } else{
            avisarEstoqueMax = 'N';
        }

        if(avisarEstoqueMin == true){
            avisarEstoqueMin = 'S';
        } else{
            avisarEstoqueMin = 'N';
        }

        const sql = 'INSERT INTO movimentacoes '
        + '(Quantidade, Data_Entrada, ID_Coleta, Categoria, AvisarEstoqueMax, AvisarEstoqueMin, Status_Movimentacao)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        const values = [
            quantidade,
            dataEntrada,
            idColeta,
            categoria,
            avisarEstoqueMax,
            avisarEstoqueMin,
            'A'
        ];

        connection.execute(sql, values);
    }

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT m.*, cli.Nome as Nome_Coleta FROM movimentacoes m
                INNER JOIN coletas co
                ON m.ID_Coleta = co.ID_Coleta
                INNER JOIN clientes cli
                ON cli.ID_Cliente = co.ID_Cliente WHERE Status_Movimentacao = ?;`, ['A'], (err, rows) => {

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
                SELECT m.*, cli.Nome as Nome_Coleta FROM movimentacoes m
                INNER JOIN coletas co
                ON m.ID_Coleta = co.ID_Coleta
                INNER JOIN clientes cli
                ON cli.ID_Cliente = co.ID_Cliente WHERE ID_Movimen = ?;`, [idMovimen], (err, row) => {
            
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

    

    // editarMovimen(quantidade, dataEntrada) {

    //     MovimenValidator.validarCriacao(quantidade, dataEntrada)

    //     const sql = 'UPDATE movimentacoes set'
    //     + 'Quantidade = ?, Data_Entrada = ?'
    //     + 'WHERE ID_Movimen = ?'

    //     const values = [
    //         quantidade,
    //         dataEntrada,
    //         id
    //     ]
    //     connection.execute(sql, values);
    // }

    // excluirMovimen(id) {

    //     const sql = 'DELETE from movimentacoes '
    //     + 'WHERE ID_Movimen = ?'
    //     const values = [id]

    //     connection.execute(sql, values)
    // }

}

module.exports = new ApiMovimen();