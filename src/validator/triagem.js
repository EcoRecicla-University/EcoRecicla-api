class TriagemValidator {

    validarCriacao(nomeCentro, capacidade) {
        if(!nomeCentro || nomeCentro.length == 0) {
            throw new Error('Nome é obrigatorio')
        }
        if(!capacidade || capacidade.length == 0) {
            throw new Error('Capacidade é obrigatório')
        }
    }

}

module.exports = new TriagemValidator()