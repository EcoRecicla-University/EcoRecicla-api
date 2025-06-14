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
}


module.exports = new Utils();