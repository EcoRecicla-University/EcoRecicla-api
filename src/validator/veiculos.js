class VeiculoValidator {
  validarCriacaoOuEdicao(placa, modelo, quilometragem, renavam, capacidade) {
    // Validação da placa
    if (!placa || placa.trim().length === 0) {
      throw new Error('Placa é obrigatória');
    }

    const placaFormatada = placa.trim().toUpperCase();
    const regexPlaca = /^[A-Z]{3}-?\d{1}[A-Z\d]{1}\d{2}$/;
    if (!regexPlaca.test(placaFormatada)) {
      throw new Error('Placa inválida. Formatos aceitos: ABC-1234 ou ABC1D23');
    }

    if (placaFormatada.replace('-', '').length > 7) {
      throw new Error('Placa deve ter no máximo 7 caracteres alfanuméricos (sem contar o hífen)');
    }

    // Validação do modelo
    if (!modelo || modelo.trim().length === 0) {
      throw new Error('Modelo é obrigatório');
    }

    if (modelo.length > 20) {
      throw new Error('Modelo deve ter no máximo 20 caracteres');
    }

    // Validação da quilometragem
    const km = quilometragem?.toString().trim();
    if (!km || km.length === 0) {
      throw new Error('Quilometragem é obrigatória');
    }

    if (!/^\d+$/.test(km)) {
      throw new Error('Quilometragem deve conter apenas números');
    }

    if (km.length > 7) {
      throw new Error('Quilometragem deve ter no máximo 7 dígitos');
    }

    // Validação do renavam
    const ren = renavam?.toString().trim();
    if (!ren || ren.length === 0) {
      throw new Error('RENAVAM é obrigatório');
    }

    if (!/^\d{9,11}$/.test(ren)) {
      throw new Error('RENAVAM deve conter entre 9 e 11 dígitos numéricos');
    }

    // Validação da capacidade
    const cap = capacidade?.toString().trim();
    if (!cap || cap.length === 0) {
      throw new Error('Capacidade é obrigatória');
    }

    if (!/^\d+$/.test(cap)) {
      throw new Error('Capacidade deve conter apenas números');
    }

    if (cap.length > 6) {
      throw new Error('Capacidade deve ter no máximo 6 dígitos');
    }
  }

  formatarPlaca(placa) {
    return placa?.trim().toUpperCase() ?? '';
  }
}

module.exports = new VeiculoValidator();