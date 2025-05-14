const connection = require('../core/connection.js');
const veiculoValidator = require('../validator/veiculos.js');

class ApiVeiculo {

    // Criar novo veiculo
    criarNovoVeiculo(placa, modelo, quilometragem, renavam, capacidade){

        veiculoValidator.validarCriacaoVeiculo(placa, modelo, quilometragem, renavam, capacidade)

        const sql = 'INSERT INTO Veiculos'
        + '(Placa, Modelo, Quilometragem, Renavam, Capacidade_em_Kg)'
        + ' VALUES (?, ?, ?, ?, ?)';

        
        const values = [
            placa,
            modelo,
            quilometragem,
            renavam,
            capacidade
        ];

        console.log(values)
        // idMotorista
        connection.execute(sql, values);
    }

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Veiculos', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
}

module.exports = new ApiVeiculo();