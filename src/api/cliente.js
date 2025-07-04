const connection = require('../core/connection.js');
const clienteValidator = require('../validator/cliente.js')
const utils = require('../core/utils.js')

const ApiColeta = require('./coleta.js');

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
        
        if(cnpj){
            utils.validarCNPJ(cnpj)
        }
        if(cpf){
            utils.validarCPF(cpf)
        }
        
        try{
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
            
            return new Promise((resolve, reject) => {
                connection.execute(sql, values, (err, result) => {
                    if (err) {
                        return reject('Erro ao inserir cliente: ' + err);
                    }
                    
                    const clienteId = result.insertId
                    
                    if (clienteId) {
                        return resolve(clienteId);
                    }
                    
                    return resolve(null);
                });
            })
        } catch(e){
            throw new Error('Erro ao cadastrar cliente')
        }
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

    async excluirCliente(id) {

        const clienteColeta = await ApiColeta.buscaPorCliente(id)
        
        if(clienteColeta.length > 0){
            throw new Error('Não pode excluir esse Cliente porque ele esta incluso em uma coleta.')
        }

        const sql = 'UPDATE Clientes set Cliente_Ativo = ?'
        + ' WHERE ID_Cliente = ?'
        const values = ['I', id]

        connection.execute(sql, values)
    }
}


module.exports = new ApiCliente();