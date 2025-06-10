const connection = require('../core/connection.js');
const MovimenValidator = require('../validator/movimen.js')

class ApiMovimen {

    // listarTodos() {

    //     return new Promise((resolve, reject) => {
    //         connection.query('SELECT * FROM movimentacoes', (err, rows) => {

    //             if (err) {
    //                 return reject('Erro na consulta: ' + err);
    //             }
                
    //             return resolve(rows);
    //         });
    //     });
    // }
    
    // getMovimenById(idMovimen) {
    
    //     return new Promise((resolve, reject) => {
    //         connection.query('SELECT * FROM movimentacoes WHERE ID_Movimen = ?', [idMovimen], (err, row) => {
            
    //             if (err) {
    //                 return reject('Erro na consulta: ' + err);
    //             }
                
    //             const movimen = row[0];
                
    //             if (movimen) {
    //                 return resolve(movimen);
    //             }
                
    //             return resolve(null);
    //         });
    //     });
    // }

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
        + '(Quantidade, Data_Entrada, ID_Coleta, Categoria, avisarEstoqueMax, avisarEstoqueMin, Status_Movimentacao)'
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