const connection = require('../core/connection.js');

class MotoristaVeiculoValidator {

    validarCriacao(idMotorista, idVeiculo) {
        if(!idMotorista) {
            throw new Error('Motorista é obrigatório')
        }
        if(!idVeiculo) {
            throw new Error('Veículo é obrigatório')
        }  

    }
}

module.exports = new MotoristaVeiculoValidator()