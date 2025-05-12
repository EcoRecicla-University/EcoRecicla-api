const connection = require('../core/connection.js');

const utils = require('../core/utils.js')

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

        // clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const senhaTemporaria = utils.gerarSenhaTemporaria()

        const sql = 'INSERT INTO funcionarios '
        + '(Nome, Data_Nascimento, CPF, RG, Data_Contratacao, Estado_Civil, Telefone, Email, Senha, Funcionario_Ativo)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            nome,
            dataNascimento,
            cpf,
            rg,
            dataContratacao,
            estadoCivil,
            telefone,
            email,
            senhaTemporaria,
            'A'
        ];

        connection.execute(sql, values);
    }

}

module.exports = new ApiFuncionarios();