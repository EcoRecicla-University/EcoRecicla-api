const connection = require('../core/connection.js');

class ApiEndereco {

    criarEnderecoCentroTriagem(idCentro, endereco) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO endereco (ID_Centro, CEP, Logradouro, Cidade, Estado, Bairro, Numero)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                idCentro,
                endereco.CEP,
                endereco.Logradouro,
                endereco.Localidade,
                endereco.Estado,
                endereco.Bairro,
                endereco.Numero
            ];

            connection.execute(sql, values, (err) => {
                if (err) {
                    return reject('Erro ao inserir endereço: ' + err);
                }

                return resolve(true);
            });
        });
    }

    editarEnderecoCentroTriagem(idCentro, endereco) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE endereco
                SET CEP = ?, Logradouro = ?, Cidade = ?, Estado = ?, Bairro = ?, Numero = ?
                WHERE ID_Centro = ?
            `;

            const values = [
                endereco.CEP,
                endereco.Logradouro,
                endereco.Localidade,
                endereco.Estado,
                endereco.Bairro,
                endereco.Numero,
                idCentro
            ];

            connection.execute(sql, values, (err) => {
                if (err) {
                    return reject('Erro ao editar endereço: ' + err);
                }

                return resolve(true);
            });
        });
    }
}

module.exports = new ApiEndereco();
