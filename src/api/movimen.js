const connection = require('../core/connection.js');
const MovimenValidator = require('../validator/movimen.js')

class ApiMovimen {

    listarTodos() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        m.ID_Movimen,
        m.Quantidade,
        m.Data_Entrada,
        tr.Nome AS Tipo_Residuo
      FROM movimentacoes m
      JOIN Coleta_Tipo_Residuo ctr ON m.ID_Coleta_Tipo_Residuo = ctr.ID_Coleta_Tipo_Residuo
      JOIN Tipo_Residuo tr ON ctr.ID_Tipo_Residuo = tr.ID_Tipo_Residuo
    `;

    connection.query(sql, (err, rows) => {
      if (err) return reject('Erro ao listar movimentações: ' + err);
      return resolve(rows);
    });
  });
}

    getChavesColeta() {
        return new Promise((resolve, reject) => {
          const sql = `
            SELECT
              ctr.ID_Coleta_Tipo_Residuo,
              tr.Nome
            FROM Coleta_Tipo_Residuo ctr
            JOIN Tipo_Residuo tr ON ctr.ID_Tipo_Residuo = tr.ID_Tipo_Residuo
          `;

          connection.query(sql, (err, rows) => {
            if (err) return reject('Erro ao buscar chaves de coleta: ' + err);
            return resolve(rows);
          });
        });
        }

    
    getMovimenById(idMovimen) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM movimentacoes WHERE ID_Movimen = ?', [idMovimen], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const movimen = row[0];
                
                if (movimen) {
                    return resolve(movimen);
                }
                
                return resolve(null);
            });
        });
    }

    criarNovaMovimen(idColetaTipoResiduo, quantidade, dataEntrada, avisarEstoqueMax, avisarEstoqueMin) {
  try {
    MovimenValidator.validarCriacao(quantidade, dataEntrada);
  } catch (err) {
    throw new Error(err.message);
  }

  const sql = `
  INSERT INTO movimentacoes (
    ID_Coleta_Tipo_Residuo,
    Quantidade,
    Data_Entrada,
    AvisarEstoqueMax,
    AvisarEstoqueMin
  ) VALUES (?, ?, ?, ?, ?)
`;

  const values = [idColetaTipoResiduo, quantidade, dataEntrada, avisarEstoqueMax, avisarEstoqueMin]; 

  return new Promise((resolve, reject) => {
    connection.execute(sql, values, (err, result) => {
      if (err) return reject('Erro ao inserir movimentação: ' + err);
      return resolve({ id: result.insertId });
    });
  });
}

    editarMovimen(id, idColetaTipoResiduo, quantidade, dataEntrada, avisarEstoqueMax, avisarEstoqueMin) {
  try {
    MovimenValidator.validarCriacao(quantidade, dataEntrada);
  } catch (err) {
    throw new Error(err.message);
  }

  const sql = `
    UPDATE movimentacoes
    SET 
      ID_Coleta_Tipo_Residuo = ?,
      Quantidade = ?,
      Data_Entrada = ?,
      AvisarEstoqueMax = ?,
      AvisarEstoqueMin = ?
    WHERE ID_Movimen = ?
  `;

  const values = [
    idColetaTipoResiduo,
    quantidade,
    dataEntrada,
    avisarEstoqueMax,
    avisarEstoqueMin,
    id
  ];

  return new Promise((resolve, reject) => {
    connection.execute(sql, values, (err, result) => {
      if (err) return reject('Erro ao atualizar movimentação: ' + err);
      return resolve({ atualizado: true });
    });
  });
}

   excluirMovimen(id) {
  const sql = 'DELETE FROM movimentacoes WHERE ID_Movimen = ?';
  const values = [id];

  return new Promise((resolve, reject) => {
    connection.execute(sql, values, (err, result) => {
      if (err) return reject('Erro ao excluir movimentação: ' + err);
      return resolve({ excluido: true });
    });
  });
 }
}

module.exports = new ApiMovimen();