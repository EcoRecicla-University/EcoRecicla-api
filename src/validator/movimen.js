class MovimenValidator {

    validarCriacao(quantidade, dataEntrada, idColeta, categoria) {
        if(!quantidade || quantidade.length == 0) {
            throw new Error('Quantidade é obrigatório')
        }
        if(!dataEntrada || dataEntrada.length == 0) {
            throw new Error('Data de entrada do residuo é obrigatório')
        }
        if(!idColeta) {
            throw new Error('Coleta é obrigatório')
        }  
        if(!categoria) {
            throw new Error('Tipo do residuo é obrigatório')
        }  
    }
}

module.exports = new MovimenValidator()