const connection = require('../core/connection.js');
const MotoristaVeiculoValidator = require('../validator/veiculoMotorista.js')

class ApiVeiculoMotorista {

    criarVinculoVeiculoMotorista(idMotorista, idVeiculo) {
        
        MotoristaVeiculoValidator.validarCriacao(idMotorista, idVeiculo)
        
        try{

            const sql = 'INSERT INTO veiculo_motorista '
            + '(ID_Motorista, ID_Veiculo, Status_Veiculo_Motorista)'
            + ' VALUES (?, ?, ?)';
            
            const values = [
                idMotorista,
                idVeiculo,
                'A'
            ];
            
            return new Promise((resolve, reject) => {
                connection.execute(sql, values, (err, result) => {
                    if (err) {
                        return reject('Erro ao vincular motorista e veiculo: ' + err);
                    }
                    
                    const motoristaVeiculoId = result.insertId
                    
                    if (motoristaVeiculoId) {
                        return resolve(motoristaVeiculoId);
                    }
                    
                    return resolve(null);
                });
            })
        } catch(e){
            throw new Error('Erro ao vincular motorista e veiculo')
        }

    }

    verificarExistenciaMotoristaVeiculo(idMotorista, idVeiculo) {
        return new Promise((resolve, reject) => {

            if(idVeiculo && idMotorista == null){

                const sql = 'SELECT ID_Veiculo_Motorista FROM veiculo_motorista WHERE ID_Veiculo = ? and Status_Veiculo_Motorista = ?'
                connection.query(sql, [idVeiculo, 'A'], (err, rows) => {

                    if (err) {
                        return reject('Erro na consulta: ' + err);
                    }
                    
                    return resolve(rows);
                });

            }

            if(idMotorista && idVeiculo == null){

                const sql = 'SELECT ID_Veiculo_Motorista FROM veiculo_motorista WHERE ID_Motorista = ? and Status_Veiculo_Motorista = ?'
                connection.query(sql, [idMotorista, 'A'], (err, rows) => {

                    if (err) {
                        return reject('Erro na consulta: ' + err);
                    }
                    
                    return resolve(rows);
                });

            }

            const sql = 'SELECT ID_Veiculo_Motorista FROM veiculo_motorista WHERE (ID_Motorista = ? and ID_Veiculo = ?) and Status_Veiculo_Motorista = ?';
            connection.query(sql, [idMotorista, idVeiculo, 'A'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }


    editarMotoristaVeiculo(idVeiculoMotorista, idMotorista, idVeiculo) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE veiculo_motorista SET ID_Motorista = ? and ID_Veiculo = ? WHERE ID_Veiculo_Motorista = ?';
            connection.query(sql, [idMotorista, idVeiculo, idVeiculoMotorista], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    excluirVeiculoMotorista(id){
        return new Promise((resolve, reject) => {

            const sql = 'UPDATE veiculo_motorista SET Status_Veiculo_Motorista = ? WHERE ID_Veiculo_Motorista = ?';
            connection.query(sql, ['I', id], (err, rows) => {

                if (err) {
                    return reject('Erro na exclusao: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
}

module.exports = new ApiVeiculoMotorista();