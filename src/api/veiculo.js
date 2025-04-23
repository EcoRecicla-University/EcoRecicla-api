const connection = require('../core/connection.js');
const veiculoValidator = require('../validator/veiculos.js');

class ApiVeiculo {

    // Criar novo veiculo
    criarNovoVeiculo(placa, modelo, quilometragem, renavam, capacidade){

        veiculoValidator.validarCriacaoVeiculo(placa, modelo, quilometragem, renavam, capacidade)

        const sql = 'INSERT INTO Veiculos'
        + '(Placa, Modelo, Quilometragem, Renavam, Capacidade_em_Kg, ID_Motorista)'
        + ' VALUES (?, ?, ?, ?, ?, ?)';

        
        const values = [
            placa,
            modelo,
            quilometragem,
            renavam,
            capacidade,
            1
        ];

        console.log(values)
        // idMotorista
        connection.execute(sql, values);
    }
}

module.exports = new ApiVeiculo();