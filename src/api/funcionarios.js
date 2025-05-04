const connection = require('../core/connection.js');

class ApiFuncionarios {

    listarTodos(){

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM funcionarios', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }

    criarNovoFuncionario(nome, cpf, rg, telefone, dataNascimento, dataContratacao, estadoCivil){

        // clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const sql = 'INSERT INTO funcionarios '
        + '(Nome, Data_Nascimento, CPF, RG, Data_Contratacao, Estado_Civil, Telefone)'
        + ' VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            nome,
            dataNascimento,
            cpf,
            rg,
            dataContratacao,
            estadoCivil,
            telefone,
        ];

        connection.execute(sql, values);
    }

}

module.exports = new ApiFuncionarios();