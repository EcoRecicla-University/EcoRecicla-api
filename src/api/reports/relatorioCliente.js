const ExcelJS = require('exceljs');
const connection = require('../../core/connection');

class ApiReportsClientes {

    async gerarRelatorioClientesExcel(req, res) {
        try {
            const [clientes] = await connection.promise().query(`
                SELECT * FROM clientes c
                INNER JOIN endereco e
                ON e.ID_Cliente = c.ID_Cliente
            `);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Clientes');

            worksheet.columns = [
                { header: 'ID', key: 'ID_Cliente', width: 10 },
                { header: 'Nome', key: 'Nome', width: 30 },
                { header: 'Telefone', key: 'Telefone', width: 15 },
                { header: 'Tipo_Cliente', key: 'Tipo_Cliente', width: 15 },
                { header: 'CPF', key: 'CPF', width: 20 },
                { header: 'CNPJ', key: 'CNPJ', width: 20 },
                { header: 'Data_Cadastro', key: 'Data_Cadastro', width: 15 },
                { header: 'Numero_Pedidos', key: 'Numero_Pedidos', width: 20 },
                { header: 'CEP', key: 'CEP', width: 20 },
                { header: 'Logradouro', key: 'Logradouro', width: 20 },
                { header: 'Cidade', key: 'Cidade', width: 15 },
                { header: 'Bairro', key: 'Bairro', width: 15 },
                { header: 'Estado', key: 'Estado', width: 15 },
                { header: 'Numero', key: 'Numero', width: 15 },
            ];

            clientes.forEach((cliente) => {
                worksheet.addRow(cliente);
            });

            // Gera o buffer do Excel
            const buffer = await workbook.xlsx.writeBuffer();

            // Cabeçalhos corretos
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio_clientes.xlsx');

            res.send(buffer);

        } catch (error) {
            console.error('Erro ao gerar relatório de clientes:', error);
            res.status(500).json({ error: 'Erro ao gerar relatório de clientes' });
        }
    }
}

module.exports = new ApiReportsClientes();
