class FuncionarioValidator {

    validarCriacao(nome, dataNascimento, cpf, rg, dataContratacao, estadoCivil, telefone) {
        if(!nome || nome.length == 0) {
            throw new Error('Nome é obrigatório')
        }
        if(!dataNascimento || dataNascimento.length == 0) {
            throw new Error('Data de nascimento é obrigatório')
        }
        if(!cpf || cpf.length == 0) {
            throw new Error('CPF é obrigatório')
        }
        if(!rg || rg.length == 0) {
            throw new Error('RG é obrigatório')
        }
        if(!dataContratacao || dataContratacao.length == 0) {
            throw new Error('Data de contratação é obrigatório')
        }
        if(!estadoCivil || estadoCivil.length == 0) {
            throw new Error('Estado civil é obrigatório')
        }
        if(!telefone || telefone.length == 0) {
            throw new Error('telefone é obrigatório')
        }
    }

}

module.exports = new FuncionarioValidator()