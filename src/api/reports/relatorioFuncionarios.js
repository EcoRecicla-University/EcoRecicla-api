const ExcelJS = require('exceljs');
const connection = require('../../core/connection');

class ApiReportsFuncionarios {

    async gerarRelatorioFuncionariosExcel(req, res) {
        try {
            const [funcionarios] = await connection.promise().query(`
                SELECT 
                    f.ID_Funci,
                    f.Nome,
                    f.Data_Nascimento,
                    f.CPF,
                    f.RG,
                    f.Data_Contratacao,
                    f.Estado_Civil,
                    f.Telefone,
                    f.Email,
                    f.Funcionario_Ativo,
                    CASE WHEN m.ID_Funci IS NOT NULL THEN 'Sim' ELSE 'Não' END AS Eh_Motorista
                FROM funcionarios f
                LEFT JOIN motoristas m ON f.ID_Funci = m.ID_Funci
            `);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Funcionários');

            worksheet.columns = [
                { header: 'ID', key: 'ID_Funci', width: 10 },
                { header: 'Nome', key: 'Nome', width: 30 },
                { header: 'Data de Nascimento', key: 'Data_Nascimento', width: 20 },
                { header: 'CPF', key: 'CPF', width: 20 },
                { header: 'RG', key: 'RG', width: 15 },
                { header: 'Data de Contratação', key: 'Data_Contratacao', width: 20 },
                { header: 'Estado Civil', key: 'Estado_Civil', width: 15 },
                { header: 'Telefone', key: 'Telefone', width: 15 },
                { header: 'Email', key: 'Email', width: 25 },
                { header: 'Ativo', key: 'Funcionario_Ativo', width: 10 },
                { header: 'E Motorista', key: 'Eh_Motorista', width: 15 },
            ];

            funcionarios.forEach(funcionario => {
                worksheet.addRow(funcionario);
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=relatorio_funcionarios.xlsx');

            res.send(buffer);

        } catch (error) {
            console.error('Erro ao gerar relatório de funcionários:', error);
            res.status(500).json({ error: 'Erro ao gerar relatório de funcionários' });
        }
    }
}

module.exports = new ApiReportsFuncionarios();
