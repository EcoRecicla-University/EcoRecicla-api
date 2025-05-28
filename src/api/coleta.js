const connection = require('../core/connection.js');
const ColetaValidator = require('../validator/coleta.js')

class ApiColeta {

    criarNovaColeta(idCliente, dataColeta, quantidade, statusColeta){

        ColetaValidator.validarCriacao(idCliente, dataColeta, quantidade, statusColeta)

        const sql = 'INSERT INTO coletas '
        + '(Data_Coleta, Quantidade, Status_Coleta, ID_Cliente)'
        + ' VALUES (?, ?, ?, ?)';
        const values = [
            dataColeta,
            quantidade,
            statusColeta,
            idCliente
        ];

        connection.execute(sql, values);
    }

}

module.exports = new ApiColeta();