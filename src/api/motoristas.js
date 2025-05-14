const connection = require('../core/connection.js');

const motoristaValidator = require('../validator/motorista.js')

class ApiMotoristas {

    criarNovoMotorista(idFuncionario, categoria, numeroRogistro, validadeCarteira){

        motoristaValidator.validarCriacao(idFuncionario, categoria, numeroRogistro, validadeCarteira)

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

    buscarPorFuncionario(id){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * from motoristas WHERE ID_Funci = ?';
            connection.query(sql, [id], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }

    getMotoristaById(idMotorista) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT f.Nome AS Nome, m.* FROM motoristas m INNER JOIN funcionarios f ON m.ID_Funci = f.ID_Funci WHERE m.ID_Motorista = ?', [idMotorista], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const motorista = row[0];
                
                if (motorista) {
                    return resolve(motorista);
                }
                
                return resolve(null);
            });
        });
    }

    editarMotorista(idMotorista, idFuncionario, categoria, numeroRegistro, validade) {

        // clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const sql = 'UPDATE motoristas set '
        + 'ID_Funci = ?, Numero_Registro = ?, Categoria = ?, Validade = ? '
        + 'WHERE ID_Motorista = ?'

        const values = [
            idFuncionario,
            numeroRegistro,
            categoria,
            new Date(validade),
            idMotorista
        ]
        connection.execute(sql, values);
    }

    excluirMotorista(id) {

        const sql = 'DELETE from motoristas WHERE ID_Motorista = ?'
        const values = [id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiMotoristas();