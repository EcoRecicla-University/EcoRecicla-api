const connection = require('../core/connection.js');

class ApiEndereco {

    criarEndereco(idCliente, endereco){

        const sql = 'INSERT INTO Endereco_Cliente'
        + '(CEP, Logradouro, Cidade, Estado, Numero, ID_Cliente)'
        + ' VALUES (?, ?, ?, ?, ?, ?)';

        
        const values = [
            endereco.CEP,
            endereco.Logradouro,
            endereco.Cidade,
            endereco.Estado,
            endereco.Numero,
            idCliente
        ];

        connection.execute(sql, values);
    }

    buscarEnderecoDoCliente(clienteId){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * from Endereco_Cliente WHERE ID_Cliente = ?';
            connection.query(sql, [clienteId], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows[0]);
            });
        });

    }

    excluirEnderecoDoCliente(clienteId) {

        const sql = 'DELETE from Endereco_Cliente '
        + 'WHERE ID_Cliente = ?'
        const values = [clienteId]

        connection.execute(sql, values)
    }
}

module.exports = new ApiEndereco();