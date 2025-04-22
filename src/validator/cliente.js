class ClienteValidator {

    validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente) {
        if(!nome || nome.length == 0) {
            throw new Error('Nome é obrigatório')
        }
        if(!telefone || telefone.length == 0) {
            throw new Error('Telefone é obrigatório')
        }
        if(!pontoColeta || pontoColeta.length == 0) {
            throw new Error('Ponto de coleta é obrigatório')
        }
        if(!tipoCliente || tipoCliente.length == 0) {
            throw new Error('Tipo do cliente é obrigatório')
        }
    }

}

module.exports = new ClienteValidator()