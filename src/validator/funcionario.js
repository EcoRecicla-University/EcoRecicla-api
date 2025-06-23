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

    validarCPF(cpf) {
         cpf = cpf.replace(/[^\d]+/g, '');
    
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            throw new Error('CPF deve conter 11 dígitos válidos e não pode ter todos os números iguais');
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) {
            throw new Error('Dígito verificador 1 do CPF inválido');
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) {
            throw new Error('Dígito verificador 2 do CPF inválido');
        }

        return true;
    }
}

module.exports = new FuncionarioValidator();