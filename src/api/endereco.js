const connection = require('../core/connection.js');

class ApiEndereco {

    criarEnderecoCentroTriagem(IdTriagem, endereco) {
        const sql = 'INSERT INTO Endereco'
        + '(CEP, Logradouro, Cidade, Estado, Numero, ID_Cliente, Bairro, Tipo_Endereco, ID_Centro)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        const values = [
            endereco.CEP,
            endereco.Logradouro,
            endereco.Localidade,
            endereco.Estado,
            endereco.Numero,
            null,
            endereco.Bairro,
            'T',
            IdTriagem
        ];

        connection.execute(sql, values);
    }

    criarEnderecoCliente(idCliente, endereco){

        const sql = 'INSERT INTO Endereco'
        + '(CEP, Logradouro, Cidade, Estado, Numero, ID_Cliente, Bairro, Tipo_Endereco, ID_Centro)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        
        const values = [
            endereco.CEP,
            endereco.Logradouro,
            endereco.Localidade,
            endereco.Estado,
            endereco.Numero,
            idCliente,
            endereco.Bairro,
            'C',
            null
        ];


        connection.execute(sql, values);
    }

    buscarEnderecoDoCliente(clienteId){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * from Endereco WHERE ID_Cliente = ?';
            connection.query(sql, [clienteId], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows[0]);
            });
        });

    }

    excluirEnderecoDoCliente(clienteId) {

        const sql = 'DELETE from Endereco '
        + 'WHERE ID_Cliente = ?'
        const values = [clienteId]

        connection.execute(sql, values)
    }

    editarEnderecoDaTriagem(idTriagem, endereco) {

        const sql = 'UPDATE Endereco SET CEP = ?, Logradouro = ?, Cidade = ?, Estado = ?, Numero = ?, Bairro = ?'
        + ' WHERE ID_Centro = ?'

        const values = [
            endereco.CEP,
            endereco.Logradouro,
            endereco.Cidade,
            endereco.Estado,
            endereco.Numero,
            endereco.Bairro,
            idTriagem
        ]

        connection.execute(sql, values)
    }

    editarEnderecoDoCliente(idCliente, endereco) {

        const sql = 'UPDATE Endereco SET CEP = ?, Logradouro = ?, Cidade = ?, Estado = ?, Numero = ?, Bairro = ?'
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

    buscarEnderecoDaTriagem(idTriagem){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * from Endereco WHERE ID_Centro = ?';
            connection.query(sql, [idTriagem], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows[0]);
            });
        });

    }
}

module.exports = new ApiEndereco();