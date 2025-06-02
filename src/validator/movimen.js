class MovimenValidator {
  validarCriacao(idColetaTipoResiduo, quantidade, dataEntrada) {
    if (!idColetaTipoResiduo || isNaN(idColetaTipoResiduo)) {
      throw new Error('ID da chave de coleta é obrigatório e deve ser numérico');
    }

    if (quantidade === undefined || quantidade === null) {
      throw new Error('Quantidade é obrigatória');
    }

    if (isNaN(quantidade) || quantidade <= 0) {
      throw new Error('Quantidade deve ser um número maior que zero');
    }

    if (!dataEntrada) {
      throw new Error('Data de entrada é obrigatória');
    }

    const data = new Date(dataEntrada);
    if (isNaN(data.getTime())) {
      throw new Error('Data de entrada inválida');
    }
  }
}

module.exports = new MovimenValidator();
