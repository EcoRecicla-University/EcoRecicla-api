class ClienteValidator {

    validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente) {
        if(!nome || nome.length == 0) {
            throw new Error('Nome é obrigatório')
        }
        if(!telefone || telefone.length == 0) {
            throw new Error('Telefone é obrigatório')
        }
        if(!tipoCliente || tipoCliente.length == 0) {
            throw new Error('Tipo do cliente é obrigatório')
        }
        if(!cpf && !cnpj){
            throw new Error('CPF ou CNPJ é obrigatório')
        }
    }

}

module.exports = new ClienteValidator()