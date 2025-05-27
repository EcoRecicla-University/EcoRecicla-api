const connection = require('../core/connection.js');

class ApiEndereco {

    criarEndereco(idCliente, endereco){

        const sql = 'INSERT INTO Endereco_Cliente'
        + '(CEP, Logradouro, Cidade, Estado, Numero, ID_Cliente, Bairro)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?)';

        
        const values = [
            endereco.CEP,
            endereco.Logradouro,
            endereco.Localidade,
            endereco.Estado,
            endereco.Numero,
            idCliente,
            endereco.Bairro,
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

    editarEnderecoDoCliente(idCliente, endereco) {

        const sql = 'UPDATE Endereco_Cliente SET CEP = ?, Logradouro = ?, Cidade = ?, Estado = ?, Numero = ?, Bairro = ?'
        + ' WHERE ID_Cliente = ?'

        const values = [
            endereco.CEP,
            endereco.Logradouro,
            endereco.Localidade,
            endereco.Estado,
            endereco.Numero,
            endereco.Bairro,
            idCliente
        ]

        connection.execute(sql, values)
    }
}

module.exports = new ApiEndereco();