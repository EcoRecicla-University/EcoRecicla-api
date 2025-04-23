class CentroValidator {

    validarCriacao(endereco, capaciArmaze) {
        if(!endereco || endereco.length == 0) {
            throw new Error('Endereço é obrigatório')
        }
        if(!capaciArmaze || capaciArmaze.length == 0) {
            throw new Error('Capacidade de armazeamento é obrigatório')
        }
    }

}

module.exports = new CentroValidator()