const connection = require('../core/connection.js');

class ApiMotoristas {

    criarNovoMotorista(idFuncionario, categoria, numeroRogistro, validadeCarteira){

        // clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const sql = 'INSERT INTO motoristas '
        + '(ID_Funci, Numero_Registro, Categoria, Validade)'
        + ' VALUES (?, ?, ?, ?)';
        const values = [
            idFuncionario,
            numeroRogistro,
            categoria,
            validadeCarteira
        ];

        connection.execute(sql, values);
    }

    listarTodos(){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT f.Nome AS Nome, m.* from motoristas m INNER JOIN funcionarios f ON m.ID_Funci = f.ID_Funci';
            connection.query(sql, (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }
}

module.exports = new ApiMotoristas();