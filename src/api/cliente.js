const connection = require('../core/connection.js');
const clienteValidator = require('../validator/cliente.js')

class ApiCliente {

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM clientes', (err, rows) => {

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

    criarNovoCliente(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente){

        clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const date = new Date()

        const sql = 'INSERT INTO clientes '
        + '(Nome, Telefone, CPF, CNPJ, Pontos_Coleta, Numero_Pedidos, Tipo_Cliente, Data_Cadastro)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nome, telefone, cpf, cnpj, pontoColeta, 0, tipoCliente, date];

        connection.execute(sql, values);
    }


    editarCliente(id, nome, cpf, cnpj, telefone, pontoColeta, tipoCliente) {

        clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const sql = 'UPDATE Clientes set '
        + 'Nome = ?, Telefone = ?, CPF = ?, CNPJ = ?, Pontos_Coleta = ?, Tipo_Cliente = ? '
        + 'WHERE ID_Cliente = ?'

        const values = [
            nome,
            telefone,
            cpf ?? null,
            cnpj ?? null,
            pontoColeta,
            tipoCliente,
            id
        ]
        connection.execute(sql, values);
    }

}


module.exports = new ApiCliente();