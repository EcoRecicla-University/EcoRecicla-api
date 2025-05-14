class MotoristaValidator {

    validarCriacao(idFuncionario, categoria, numeroRogistro, validadeCarteira) {
        if(!idFuncionario) {
            throw new Error('Funcionario é obrigatorio')
        }
        if(!categoria) {
            throw new Error('Categoria da carteira é obrigatório')
        }
        if(!numeroRogistro || numeroRogistro.length == 0) {
            throw new Error('Número do registro é obrigatório')
        }
        if(!validadeCarteira || validadeCarteira == 0) {
            throw new Error('Data de validade é obrigatório')
        }
    }

}

module.exports = new MotoristaValidator()