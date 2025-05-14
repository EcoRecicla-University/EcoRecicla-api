const connection = require('../core/connection.js');
const clienteValidator = require('../validator/cliente.js')

class ApiCliente {

    listarTodos() {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM clientes WHERE Cliente_Ativo = ?';
            
            connection.query(sql, ['A'],(err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getClienteById(idCliente) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM clientes WHERE ID_Cliente = ?', [idCliente], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const cliente = row[0];
                
                if (cliente) {
                    return resolve(cliente);
                }
                
                return resolve(null);
            });
        });
    }

    criarNovoCliente(nome, cpf, cnpj, telefone, tipoCliente){

        clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, tipoCliente)

        const date = new Date()

        const sql = 'INSERT INTO clientes '
        + '(Nome, Telefone, CPF, CNPJ, Numero_Pedidos, Tipo_Cliente, Data_Cadastro, Cliente_Ativo)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            nome,
            telefone,
            cpf ?? null,
            cnpj ?? null,
            0,
            tipoCliente,
            date,
            'A'
        ];

        console.log(values)
        connection.execute(sql, values);
        console.log('Gravado')
    }


    editarCliente(id, nome, cpf, cnpj, telefone, tipoCliente) {

        clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, tipoCliente)

        const sql = 'UPDATE Clientes set '
        + 'Nome = ?, Telefone = ?, CPF = ?, CNPJ = ?, Tipo_Cliente = ? '
        + 'WHERE ID_Cliente = ?'

        const values = [
            nome,
            telefone,
            cpf ?? null,
            cnpj ?? null,
            tipoCliente,
            id
        ]
        connection.execute(sql, values);
    }

    excluirCliente(id) {

        const sql = 'UPDATE Clientes set Cliente_Ativo = ?'
        + ' WHERE ID_Cliente = ?'
        const values = ['I', id]

        connection.execute(sql, values)
    }
}


module.exports = new ApiCliente();