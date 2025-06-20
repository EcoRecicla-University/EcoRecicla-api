const connection = require('../core/connection.js');
const funcionarioValidator = require('../validator/funcionario.js')

const utils = require('../core/utils.js')
const ApiMotoristas = require('./motoristas.js');

class ApiFuncionarios {

    listarTodos(){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM funcionarios WHERE Funcionario_Ativo = ?';
            connection.query(sql, ['A'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }

    criarNovoFuncionario(nome, cpf, rg, telefone, dataNascimento, dataContratacao, estadoCivil, email){

        funcionarioValidator.validarCriacao(nome, cpf, rg, telefone, dataNascimento, dataContratacao, estadoCivil)

        const senhaTemporaria = utils.gerarSenhaTemporaria()

        const sql = 'INSERT INTO funcionarios '
        + '(Nome, Data_Nascimento, CPF, RG, Data_Contratacao, Estado_Civil, Telefone, Email, Senha, Funcionario_Ativo)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            nome,
            new Date(dataNascimento),
            cpf,
            rg,
            new Date(dataContratacao),
            estadoCivil,
            telefone,
            email,
            senhaTemporaria,
            'A'
        ];

        connection.execute(sql, values);
    }

    getFuncionarioById(idFuncionario) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM funcionarios WHERE ID_Funci = ?', [idFuncionario], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const funcionario = row[0];
                
                if (funcionario) {
                    return resolve(funcionario);
                }
                
                return resolve(null);
            });
        });
    }

    editarFuncionario(id, nome, cpf, rg, telefone, dataNascimento, dataContratacao, estadoCivil, email) {

        // clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const sql = 'UPDATE funcionarios set '
        + 'Nome = ?, Telefone = ?, CPF = ?, RG = ?, Data_Nascimento = ?, Data_Contratacao = ?, Estado_Civil = ?, Email = ? '
        + 'WHERE ID_Funci = ?'

        const values = [
            nome,
            telefone,
            cpf,
            rg,
            new Date(dataNascimento),
            new Date(dataContratacao),
            estadoCivil,
            email,
            id
        ]
        connection.execute(sql, values);
    }

    async excluirFuncionario(id) {

        const funcionarioMotorista = await ApiMotoristas.buscarPorFuncionario(id)

        if(funcionarioMotorista.length > 0){
            throw new Error('Não pode excluir esse funcionário porque ele é um motorista.')
        }

        const sql = 'UPDATE funcionarios set Funcionario_Ativo = ?'
        + ' WHERE ID_Funci = ?'
        const values = ['I', id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiFuncionarios();