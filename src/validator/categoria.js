class CategoriaValidator {

    validarCriacao(Categoria) {
        if(!Categoria || Categoria.length == 0) {
            throw new Error('Categoria é obrigatório')
        }
    }

}

module.exports = new CategoriaValidator()