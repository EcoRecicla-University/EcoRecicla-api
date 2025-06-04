const connection = require('../core/connection.js');
const RotaValidator = require('../validator/rota.js')
const ApiVeiculoMotorista = require('./veiculoMotorista.js')

class ApiRota {

    async criarNovaRota(idColeta, motoristaVeiculoId , idFuncionario, idCentroInicio, idCentroFim){

        RotaValidator.validarCriacao(idColeta, motoristaVeiculoId , idFuncionario, idCentroInicio, idCentroFim)
        
        const sql = 'INSERT INTO Rotas '
        + '(ID_Veiculo_Motorista, ID_Centro_Inicio, ID_Centro_Fim, ID_Funci, ID_Coleta, Status_Rota)'
        + ' VALUES (?, ?, ?, ?, ?, ?)';
        const values = [
            motoristaVeiculoId,
            idCentroInicio,
            idCentroFim,
            idFuncionario,
            idColeta,
            'AB'
        ];

        connection.execute(sql, values);
    }

    listarTodos(){

        return new Promise((resolve, reject) => {
            const sql = `SELECT 
                    r.ID_Rota, 
                    r.ID_Centro_Inicio AS CentroInicio, 
                    c1.Nome_Centro AS CentroInicioNome, 
                    r.ID_Centro_Fim AS CentroFim,
                    c2.Nome_Centro AS CentroFimNome,
                    c.Data_Coleta
                FROM rotas r  
                INNER JOIN centros c1 ON r.ID_Centro_Inicio = c1.ID_Centro
                INNER JOIN centros c2 ON r.ID_Centro_Fim = c2.ID_Centro
                INNER JOIN coletas c ON r.ID_Coleta = c.ID_Coleta;`;

            connection.query(sql, (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }
}

module.exports = new ApiRota();