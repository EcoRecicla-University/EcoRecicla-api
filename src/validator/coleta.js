class ColetaValidator {

    validarCriacao(idCliente, dataColeta, quantidade, statusColeta) {
        if(!idCliente) {
            throw new Error('Cliente é obrigatório')
        }
        if(!dataColeta) {
            throw new Error('Data de coleta é obrigatório')
        }
        if(!quantidade || quantidade.length == 0) {
            throw new Error('Quantidade é obrigatório')
        }
        if(!statusColeta){
            throw new Error('Status de coleta é obrigatório')
        }
    }

}

module.exports = new ColetaValidator()