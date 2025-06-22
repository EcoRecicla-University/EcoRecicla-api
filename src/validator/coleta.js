class ColetaValidator {

    validarCriacao(idCliente, dataColeta, quantidade) {
        if(!idCliente) {
            throw new Error('Cliente é obrigatório')
        }
        if(!dataColeta) {
            throw new Error('Data de coleta é obrigatório')
        }
        if(!quantidade || quantidade.length == 0) {
            throw new Error('Quantidade é obrigatório')
        }
    }

}

module.exports = new ColetaValidator()