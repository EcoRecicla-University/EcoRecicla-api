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

    validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
            throw new Error('CNPJ deve conter 14 dígitos válidos e não pode ter todos os números iguais');
        }

        const calcularDigito = (cnpj, pesos) => {
            let soma = 0;
            for (let i = 0; i < pesos.length; i++) {
                soma += parseInt(cnpj.charAt(i)) * pesos[i];
            }
            let resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const digito1 = calcularDigito(cnpj, pesos1);
        if (digito1 !== parseInt(cnpj.charAt(12))) {
            throw new Error('Dígito verificador 1 do CNPJ inválido');
        }

        const pesos2 = [6].concat(pesos1);
        const digito2 = calcularDigito(cnpj, pesos2);
        if (digito2 !== parseInt(cnpj.charAt(13))) {
            throw new Error('Dígito verificador 2 do CNPJ inválido');
        }

        return true;
    }
}


module.exports = new Utils();