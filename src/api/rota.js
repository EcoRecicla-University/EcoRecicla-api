const connection = require('../core/connection.js');
const RotaValidator = require('../validator/rota.js')
const ApiVeiculoMotorista = require('./veiculoMotorista.js')

class ApiRota {

    async criarNovaRota(idColeta, motoristaVeiculoId , idFuncionario, idCentroInicio, idCentroFim){

        RotaValidator.validarCriacao(idColeta, motoristaVeiculoId , idFuncionario, idCentroInicio, idCentroFim)
        
        const sql = 'INSERT INTO Rotas '
        + '(ID_Veiculo_Motorista, ID_Centro_Inicio, ID_Centro_Fim, ID_Funci, ID_Coleta, Status_Rota)'
        + ' VALUES (?, ?, ?, ?, ?, ?)';
        const values = [
            motoristaVeiculoId,
            idCentroInicio,
            idCentroFim,
            idFuncionario,
            idColeta,
            'AB'
        ];

        connection.execute(sql, values);
    }

}

module.exports = new ApiRota();