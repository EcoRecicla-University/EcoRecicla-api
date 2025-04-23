class MovimenValidator {

    validarCriacao(dataEntrada, quantEntrada) {
        if(!dataEntrada || dataEntrada.length == 0) {
            throw new Error('Data de entrada é obrigatório')
        }
        if(!quantEntrada || quantEntrada.length == 0) {
            throw new Error('Quantidade que entrará é obrigatório')
        }
        
    }

}

module.exports = new MovimenValidator()