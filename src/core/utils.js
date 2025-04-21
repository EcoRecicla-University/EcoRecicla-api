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

    gerarSenhaTemporaria(){
        const senhaRandom = parseInt(Math.random() * 90000 + 10000).toString();

        return senhaRandom
    }
}


module.exports = new Utils();