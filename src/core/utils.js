class Utils {
    gerarToken(email) {
        const base64String = Buffer.from(email + Math.random() * 12).toString('base64');

        return base64String
    }

    definirDataExpiracaoToken(){
        
        const tokenExpiracao = new Date();
        tokenExpiracao.setDate(tokenExpiracao.getDate() + 1);

        return tokenExpiracao
    }

    gerarSenhaTemporaria() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let senha = '';
        for (let i = 0; i < 10; i++) {
            const index = Math.floor(Math.random() * caracteres.length);
            senha += caracteres[index];
        }
        return senha;
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


module.exports = new Utils();