class MovimenValidator {

    validarCriacao(quantidade, dataEntrada) {
        if(!quantidade || quantidade.length == 0) {
            throw new Error('Quantidade é obrigatório')
        }
        if(!dataEntrada || dataEntrada.length == 0) {
            throw new Error('Data de entrada que entrará é obrigatório')
        }   
    }
}

module.exports = new MovimenValidator()