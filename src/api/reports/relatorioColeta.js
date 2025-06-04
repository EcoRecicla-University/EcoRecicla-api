const ExcelJS = require('exceljs');
const connection = require('../../core/connection');

class ApiReportsColetas {

    async obterColetasPorIntervalo(dataInicio, dataFim) {
        const [coletas] = await connection
            .promise()
            .query(`
                SELECT 
                    c.ID_Coleta,
                    c.Data_Coleta,
                    cli.Nome AS Nome_Cliente,
                    c.Quantidade,
                    c.Status_Coleta
                FROM coletas c
                INNER JOIN clientes cli ON cli.ID_Cliente = c.ID_Cliente
                WHERE c.Data_Coleta BETWEEN ? AND ?;
            `, [dataInicio, dataFim]);   
        
        return coletas;
    }

  async gerarRelatorioColetasPorData(dataInicio, dataFim) {
    const coletas = await this.obterColetasPorIntervalo(dataInicio, dataFim);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Coletas');

    worksheet.columns = [
      { header: 'ID', key: 'ID_Coleta', width: 10 },
      { header: 'Data_Coleta', key: 'Data_Coleta', width: 15 },
      { header: 'Cliente', key: 'Nome_Cliente', width: 30 },
      { header: 'Quantidade', key: 'Quantidade', width: 30 },
      { header: 'StatusColeta', key: 'Status_Coleta', width: 40 },
    ];

    coletas.forEach((coleta) => {
        const label = {
            'AB': 'Aberta',
            'CO': 'Concluída',
            'EA': 'Em andamento',
            'CA': 'Cancelada'
        };
        coleta.Status_Coleta = label[coleta.Status_Coleta];
        worksheet.addRow(coleta);
    });

    return workbook;
  }
}

module.exports = new ApiReportsColetas();