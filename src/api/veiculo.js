const connection = require('../core/connection.js');
const veiculoValidator = require('../validator/veiculos.js');

class ApiVeiculo {

    // Criar novo veiculo
    criarNovoVeiculo(placa, modelo, quilometragem, renavam, capacidade){

        veiculoValidator.validarCriacaoVeiculo(placa, modelo, quilometragem, renavam, capacidade)

        const sql = 'INSERT INTO Veiculos'
        + '(Placa, Modelo, Quilometragem, Renavam, Capacidade_em_Kg)'
        + ' VALUES (?, ?, ?, ?, ?)';

        
        const values = [
            placa,
            modelo,
            quilometragem,
            renavam,
            capacidade
        ];
        connection.execute(sql, values);
    }

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Veiculos', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    listarTodosDiponiveis() {
        return new Promise((resolve, reject) => {

            const sql = `select v.* from veiculos v
                LEFT JOIN veiculo_motorista m
                ON v.ID_Veiculo = m.ID_Veiculo 
                left JOIN rotas r
                on m.ID_Veiculo_Motorista = r.ID_Veiculo_Motorista
                Where m.ID_Veiculo is null or r.Status_Rota != ?`

            connection.query(sql, ['AB'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    getVeiculoById(idVeiculo) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM veiculos WHERE ID_Veiculo = ?;', [idVeiculo], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const veiculo = row[0];
                
                if (veiculo) {
                    return resolve(veiculo);
                }
                
                return resolve(null);
            });
        });
    }

    editarVeiculo(id, placa, modelo, quilometragem, renavam, capacidade) {

        veiculoValidator.validarCriacaoVeiculo(placa, modelo, quilometragem, renavam, capacidade)

        const sql = 'UPDATE veiculos set '
        + 'Placa = ?, Modelo = ?, Quilometragem = ?, Renavam = ?, Capacidade_em_Kg = ? '
        + 'WHERE ID_Veiculo = ?'

        const values = [
            placa,
            modelo,
            quilometragem,
            renavam,
            capacidade,
            id
        ]
        connection.execute(sql, values);
    }

    excluirVeiculo(id) {

        const sql = 'DELETE from veiculos WHERE ID_Veiculo = ?'
        const values = [id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiVeiculo();