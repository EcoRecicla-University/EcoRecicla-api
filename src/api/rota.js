const connection = require('../core/connection.js');
const RotaValidator = require('../validator/rota.js');

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
                    c.Data_Coleta,
                    cli.Nome AS Nome
                FROM rotas r  
                INNER JOIN centros c1 ON r.ID_Centro_Inicio = c1.ID_Centro
                INNER JOIN centros c2 ON r.ID_Centro_Fim = c2.ID_Centro
                INNER JOIN coletas c ON r.ID_Coleta = c.ID_Coleta
                INNER JOIN clientes cli ON c.ID_Cliente = cli.ID_Cliente WHERE Status_Rota != ?;`;

            connection.query(sql, ['CA'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });

    }

    getRotaById(idRota) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM rotas r INNER JOIN veiculo_motorista vm ON r.ID_Veiculo_Motorista = vm.ID_Veiculo_Motorista WHERE ID_Rota = ?', [idRota], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const rota = row[0];
                
                if (rota) {
                    return resolve(rota);
                }
                
                return resolve(null);
            });
        });
    }

    editarRota(idRota, idFuncionario, idCentroInicio, idCentroFim) {

        // clienteValidator.validarCriacao(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)

        const sql = 'UPDATE rotas set '
        + 'ID_Centro_Inicio = ?, ID_Centro_Fim = ?, ID_Funci = ?, ID_Coleta = ? '
        + 'WHERE ID_Rota = ?'

        const values = [
            idCentroInicio,
            idCentroFim,
            idFuncionario,
            idFuncionario,
            idRota
        ]
        connection.execute(sql, values);
    }

    async excluirRota(id) {
        
        try{

            const sql = 'UPDATE rotas set Status_Rota = ? WHERE ID_Rota = ?'
            const values = ['CA' ,id]
            connection.execute(sql, values)

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }

    }

    async buscarTriagemEmRota(idTriagem){
        return new Promise((resolve, reject) => {

            const sql = 'SELECT ID_Rota FROM rotas WHERE (ID_Centro_Inicio = ? or ID_Centro_Fim = ?) and Status_Rota != ?'
            const values = [idTriagem, idTriagem, 'CA']

            connection.execute(sql, values, (err, row) => {
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }

                return resolve(row);

            })
    
        })

    }
}

module.exports = new ApiRota();