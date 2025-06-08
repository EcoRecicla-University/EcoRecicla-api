class VeiculoValidator {

    validarCriacaoVeiculo(placa, modelo, quilometragem, renavam, capacidade) {
        
        if(!placa || placa.length == 0) {
            throw new Error('Placa é obrigatório')
        } else {
            if(placa.length > 8){
                throw new Error('Placa deve ter no máximo 8 caracteres')
            }
        }

        if(!modelo || modelo.length == 0) {
            throw new Error('Modelo é obrigatório')
        } else {
            if(modelo.length > 20){
                throw new Error('Modelo deve ter no máximo 20 caracteres')
            }
        }

        if(!quilometragem || quilometragem.length == 0) {
            throw new Error('Quilometragem é obrigatório')
        } else {
            if(quilometragem.length > 7){
                throw new Error('Quilometragem deve ter no máximo 7 caracteres')
            }
        }

        if(!renavam || renavam.length == 0) {
            throw new Error('RENAVAM do veiculo é obrigatório')
        } else {
            if(renavam.length > 11){
                throw new Error('RENAVAM deve ter no máximo 11 caracteres')
            }
        }

        if(!capacidade || !capacidade){
            throw new Error('Capacidade é obrigatório')
        } else {
            if(capacidade.length > 6){
                throw new Error('Capacidade deve ter no máximo 6 caracteres')
            }
        }
    }

}

module.exports = new VeiculoValidator()