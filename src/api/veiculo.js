const connection = require('../core/connection.js');
const veiculoValidator = require('../validator/veiculos.js');

class ApiVeiculo {

    // Criar novo veiculo
    criarNovoVeiculo(placa, modelo, quilometragem, renavam, capacidade){

        veiculoValidator.validarCriacaoVeiculo(placa, modelo, quilometragem, renavam, capacidade)

        const sql = 'INSERT INTO Veiculos'
        + '(Placa, Modelo, Quilometragem, Renavam, Capacidade_em_Kg, Status_Veiculo)'
        + ' VALUES (?, ?, ?, ?, ?, ?)';

        
        const values = [
            placa,
            modelo,
            quilometragem,
            renavam,
            capacidade,
            'A'
        ];
        connection.execute(sql, values);
    }

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Veiculos WHERE Status_Veiculo = ?',['A'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    listarTodosDiponiveis() {
        return new Promise((resolve, reject) => {

            // const sql = `SELECT * FROM veiculos v
            //     LEFT JOIN veiculo_motorista vm
            //     ON v.ID_Veiculo = vm.ID_Veiculo
            //     WHERE vm.Status_Veiculo_Motorista != 'I'
            //     AND v.Status_Veiculo != 'I';`
            const sql = `SELECT v.* FROM veiculos v
                LEFT JOIN veiculo_motorista vm
                ON v.ID_Veiculo = vm.ID_Veiculo
                WHERE vm.ID_Veiculo is null;`

            connection.query(sql, (err, rows) => {

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

        const sql = 'UPDATE veiculos set Status_Veiculo = ? WHERE ID_Veiculo = ?'
        const values = ['I', id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiVeiculo();