class FuncionarioValidator {
    validarCriacao(nome, dataNascimento, cpf, rg, dataContratacao, estadoCivil, telefone) {
        if (!nome || nome.length === 0) {
            throw new Error('Nome é obrigatório');
        }
        if (!dataNascimento || dataNascimento.length === 0) {
            throw new Error('Data de nascimento é obrigatória');
        }
        if (!cpf || cpf.length === 0) {
            throw new Error('CPF é obrigatório');
        }
        if (!rg || rg.length === 0) {
            throw new Error('RG é obrigatório');
        }
        if (!dataContratacao || dataContratacao.length === 0) {
            throw new Error('Data de contratação é obrigatória');
        }
        if (!estadoCivil || estadoCivil.length === 0) {
            throw new Error('Estado civil é obrigatório');
        }
    }

}

module.exports = new FuncionarioValidator();