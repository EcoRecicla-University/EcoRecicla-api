class RotaValidator {

    validarCriacao(idColeta, motoristaVeiculoId , idFuncionario, idCentroInicio, idCentroFim) {
        if(!idColeta) {
            throw new Error('Coleta é obrigatório')
        }
        if(!motoristaVeiculoId) {
            throw new Error('Veículo e motorista são obrigatórios')
        }  
        if(!idFuncionario) {
            throw new Error('Funcionário é obrigatório')
        }   
        if(!idCentroInicio) {
            throw new Error('Centro de inicio é obrigatório')
        }   
        if(!idCentroFim) {
            throw new Error('Centro de fim é obrigatório')
        }   
    }
}

module.exports = new RotaValidator()