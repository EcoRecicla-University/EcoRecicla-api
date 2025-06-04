const connection = require('../core/connection.js');
const MovimenValidator = require('../validator/movimen.js');
const apiEstoque = require('../api/estoque.js');


function formatarData(data) {
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
class ApiMovimen {

    listarTodos() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          m.ID_Movimen,
          m.ID_Coleta, 
          m.Quantidade,
          m.Data_Entrada,
          m.Categoria,
          m.AvisarEstoqueMax,
          m.AvisarEstoqueMin,
          c.Data_Coleta,
          cl.Nome AS Cliente
        FROM movimentacoes m
        JOIN coletas c ON m.ID_Coleta = c.ID_Coleta
        JOIN clientes cl ON c.ID_Cliente = cl.ID_Cliente
        WHERE m.Ativo = 'S'
      `;

      connection.query(sql, (err, rows) => {
        if (err) return reject('Erro ao listar movimentações: ' + err);
        return resolve(rows);
      });
    });
  }


  getColetas() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.ID_Coleta,
          c.Data_Coleta,
          cl.Nome
        FROM coletas c
        JOIN clientes cl ON c.ID_Cliente = cl.ID_Cliente
      `;

      connection.query(sql, (err, rows) => {
        if (err) return reject('Erro ao buscar coletas: ' + err);
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

  criarNovaMovimen(idColeta, quantidade, dataEntrada, avisarEstoqueMax, avisarEstoqueMin, categoria) {
    console.log('[DEBUG] Dados recebidos para inserção:', {
      idColeta,
      quantidade,
      dataEntrada,
      avisarEstoqueMax,
      avisarEstoqueMin,
      categoria
    });

    quantidade = parseFloat(quantidade);

    if (isNaN(quantidade)) {
      throw new Error('Quantidade inválida: não é um número.');
    }

    try {
      MovimenValidator.validarCriacao(idColeta, quantidade, dataEntrada, categoria);
    } catch (err) {
      throw new Error(err.message);
    }

    const sql = `
      INSERT INTO movimentacoes (
        ID_Coleta,
        Quantidade,
        Data_Entrada,
        AvisarEstoqueMax,
        AvisarEstoqueMin,
        Categoria
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      idColeta,
      quantidade,
      formatarData(dataEntrada),
      avisarEstoqueMax,
      avisarEstoqueMin,
      categoria
    ];

    return new Promise((resolve, reject) => {
      connection.execute(sql, values, (err, result) => {
        if (err) {
          console.error('[ERRO DB] ao inserir movimentação:', err);
          return reject('Erro ao inserir movimentação: ' + err);
        }

        console.log('[SUCESSO] Movimentação criada com ID:', result.insertId);

        // Atualiza o estoque após inserir a movimentação
        apiEstoque.atualizarEstoque(categoria, quantidade, formatarData(dataEntrada))
          .then(() => {
            console.log('[ESTOQUE] Estoque atualizado com sucesso.');
          })
          .catch((estoqueErr) => {
            console.error('[ERRO ESTOQUE] Falha ao atualizar estoque:', estoqueErr);
          });

        return resolve({ id: result.insertId });
      });
    });
  }

    editarMovimen(idMovimen, dadosAtualizados) {
    return new Promise((resolve, reject) => {
      // Buscar dados antigos da movimentação
      const sqlBusca = `SELECT Quantidade, Categoria, Data_Entrada FROM movimentacoes WHERE ID_Movimen = ?`;

      connection.query(sqlBusca, [idMovimen], (errBusca, rows) => {
        if (errBusca || rows.length === 0) {
          console.error('[ERRO DB] ao buscar movimentação:', errBusca);
          return reject('Movimentação não encontrada ou erro na busca.');
        }

        const movAntiga = rows[0];

        // Atualiza a movimentação
        const sqlUpdate = `
          UPDATE movimentacoes
          SET ID_Coleta = ?, Quantidade = ?, Data_Entrada = ?, Categoria = ?, AvisarEstoqueMax = ?, AvisarEstoqueMin = ?
          WHERE ID_Movimen = ?
        `;

        const values = [
          dadosAtualizados.ID_Coleta ?? null,
          dadosAtualizados.Quantidade ?? null,
          formatarData(dadosAtualizados.Data_Entrada) ?? null,
          dadosAtualizados.Categoria ?? null,
          dadosAtualizados.AvisarEstoqueMax ?? null,
          dadosAtualizados.AvisarEstoqueMin ?? null,
          idMovimen
        ];

        connection.execute(sqlUpdate, values, async (errUpdate) => {
          if (errUpdate) {
            console.error('[ERRO DB] ao atualizar movimentação:', errUpdate);
            return reject('Erro ao atualizar movimentação: ' + errUpdate);
          }

          console.log('[SUCESSO] Movimentação atualizada:', idMovimen);

          // Atualizar o estoque
          try {
            // Se a categoria mudou, reverte na antiga e adiciona na nova
            if (movAntiga.Categoria !== dadosAtualizados.Categoria) {
              await apiEstoque.atualizarEstoque(movAntiga.Categoria, -movAntiga.Quantidade, movAntiga.Data_Entrada);
              await apiEstoque.atualizarEstoque(dadosAtualizados.Categoria, dadosAtualizados.Quantidade, formatarData(dadosAtualizados.Data_Entrada));
            } else {
              // Se a categoria for a mesma, só atualiza a diferença da quantidade
              const diffQtd = dadosAtualizados.Quantidade - movAntiga.Quantidade;
              await apiEstoque.atualizarEstoque(dadosAtualizados.Categoria, diffQtd, formatarData(dadosAtualizados.Data_Entrada));
            }

            return resolve({ atualizado: true });
          } catch (estoqueErr) {
            console.error('[ERRO ESTOQUE] Falha ao atualizar estoque:', estoqueErr);
            return reject('Movimentação atualizada, mas erro ao atualizar estoque.');
          }
        });
      });
    });
  }

    inativarMovimen(id) {
    const sql = `
      UPDATE movimentacoes
      SET Ativo = 'N'
      WHERE ID_Movimen = ?
    `;

    return new Promise((resolve, reject) => {
      connection.execute(sql, [id], (err, result) => {
        if (err) return reject('Erro ao inativar movimentação: ' + err.message);
        return resolve({ inativado: true });
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
