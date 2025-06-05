const connection = require('../core/connection.js');
const VeiculoValidator = require('../validator/veiculos.js');

class ApiVeiculo {
  // Criar novo veículo
  async criarNovoVeiculo(placa, modelo, quilometragem, renavam, capacidade) {
    placa = VeiculoValidator.formatarPlaca(placa);
    VeiculoValidator.validarCriacaoOuEdicao(placa, modelo, quilometragem, renavam, capacidade);

    const sql = `
      INSERT INTO Veiculos 
        (Placa, Modelo, Quilometragem, Renavam, Capacidade_em_Kg) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [placa, modelo, quilometragem, renavam, capacidade];
    await connection.promise().execute(sql, values);
  }

  // Listar todos os veículos (somente ativos)
  async listarTodos() {
    const [rows] = await connection.promise().query("SELECT * FROM Veiculos WHERE Ativo = 'S'");
    return rows;
  }

  // Listar veículos disponíveis
  async listarTodosDiponiveis() {
    const sql = `
      SELECT v.* FROM Veiculos v
      LEFT JOIN veiculo_motorista m ON v.ID_Veiculo = m.ID_Veiculo 
      LEFT JOIN rotas r ON m.ID_Veiculo_Motorista = r.ID_Veiculo_Motorista
      WHERE (m.ID_Veiculo IS NULL OR r.Status_Rota != ?) AND v.Ativo = 'S'
    `;
    const [rows] = await connection.promise().query(sql, ['AB']);
    return rows;
  }

  // Detalhar veículo por ID
  async detalharVeiculo(id) {
    const sql = 'SELECT * FROM Veiculos WHERE ID_Veiculo = ?';
    const [rows] = await connection.promise().query(sql, [id]);

    if (rows.length === 0) {
      throw new Error('Veículo não encontrado');
    }

    return rows[0];
  }

  // Editar veículo
  async editarVeiculo(id, { placa, modelo, quilometragem, renavam, capacidade }) {
    placa = VeiculoValidator.formatarPlaca(placa);
    VeiculoValidator.validarCriacaoOuEdicao(placa, modelo, quilometragem, renavam, capacidade);

    const sql = `
      UPDATE Veiculos SET 
        Placa = ?, 
        Modelo = ?, 
        Quilometragem = ?, 
        Renavam = ?, 
        Capacidade_em_Kg = ?
      WHERE ID_Veiculo = ?
    `;
    const values = [placa, modelo, quilometragem, renavam, capacidade, id];
    const [result] = await connection.promise().execute(sql, values);
    return result;
  }

  // Inativar veículo
  async inativarVeiculo(id) {
    const sql = `UPDATE Veiculos SET Ativo = 'N' WHERE ID_Veiculo = ?`;
    const [result] = await connection.promise().execute(sql, [id]);
    return result;
  }
}

module.exports = new ApiVeiculo();