const connection = require('../core/connection.js');
const FuncionarioValidator = require('../validator/funcionario.js')

class ApiFuncionario {

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM funcionarios', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getFucionarioById(idFuncionario) {
    
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

    criarNovoFuncionario(nome, dataNascimento, cpf, rg, estadoCivil, telefone){

        FuncionarioValidator.validarCriacao(nome, dataNascimento, cpf, rg, dataContract, estadoCivil, telefone)

        const date = new Date()

        const sql = 'INSERT INTO funcionaros '
        + '(Nome, Data_Nascimento, CPF, RG, Estado_Civil, Telefone)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            nome,
            dataNascimento,
            cpf ?? null,
            rg ?? null,
            date,
            estadoCivil,
            telefone,
        ];

        connection.execute(sql, values);
    }

    editarFuncionario(id, nome, dataNascimento, cpf, rg, estadoCivil, telefone) {

        FuncionarioValidator.validarCriacao(nome, dataNascimento, cpf, rg, estadoCivil, telefone)

        const sql = 'UPDATE Funcioarios set '
        + 'Nome = ?, Data_Nascimento = ?, CPF = ?, RG = ?, Estado_Civil = ?, Telefone = ? '
        + 'WHERE ID_Funci = ?'

        const values = [
            nome,
            dataNascimento,
            cpf ?? null,
            rg ?? null,
            estadoCivil,
            telefone,
            id
        ]
        connection.execute(sql, values);
    }

    excluirFuncionario(id) {

        const sql = 'DELETE from funcionarios '
        + 'WHERE ID_Funci = ?'
        const values = [id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiFuncionario();