const connection = require('../core/connection.js');
const ColetaValidator = require('../validator/coleta.js')

class ApiColeta {

    listarTodos() {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT c.Nome AS Nome, t.* from coletas t  INNER JOIN clientes c ON t.ID_Cliente = c.ID_Cliente';
            
            connection.query(sql,(err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    listarTodosHabilitadas() {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT c.Nome AS Nome, t.* from coletas t  INNER JOIN clientes c ON t.ID_Cliente = c.ID_Cliente Where Status_Coleta != ? and Status_Coleta != ?';
            
            connection.query(sql,['CA', 'CO'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    criarNovaColeta(idCliente, dataColeta, quantidade){

        ColetaValidator.validarCriacao(idCliente, dataColeta, quantidade)

        const sql = 'INSERT INTO coletas '
        + '(Data_Coleta, Quantidade, Status_Coleta, ID_Cliente)'
        + ' VALUES (?, ?, ?, ?)';
        const values = [
            dataColeta,
            quantidade,
            'AB',
            idCliente
        ];

        connection.execute(sql, values);
    }

    getColetaById(idColeta) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT c.Nome AS Nome, t.* from coletas t  INNER JOIN clientes c ON t.ID_Cliente = c.ID_Cliente WHERE t.ID_Coleta = ?', [idColeta], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const coleta = row[0];
                
                if (coleta) {
                    return resolve(coleta);
                }
                
                return resolve(null);
            });
        });
    }

    editarColeta(idColeta, idCliente, dataColeta, quantidade, statusColeta) {

        const sql = 'UPDATE coletas set '
        + 'ID_Cliente = ?, Quantidade = ?, Data_Coleta = ? '
        + 'WHERE ID_Coleta = ?'

        const values = [
            idCliente,
            quantidade,
            new Date(dataColeta),
            idColeta
        ]
        connection.execute(sql, values);

    }

    buscaPorCliente(id){

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * from coletas WHERE ID_Cliente = ? and Status_Coleta != ?';

            connection.query(sql, [id, 'CA'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    
    definirStatusEmAndamentoColeta(idColeta){
        
        const sql = 'UPDATE Coletas SET Status_Coleta = ? WHERE ID_Coleta = ?;';

        const values = [
            'EA',
            idColeta
        ]

        connection.execute(sql, values)
    }

    buscarIdColetaPorRota(idRota){
        return new Promise((resolve, reject) => {

            const sql = 'SELECT ID_Coleta FROM Rotas WHERE ID_Rota = ?'
            
            connection.query(sql, [idRota], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                if (rows.length === 0) {
                return reject('Nenhum resultado encontrado.');
            }

                resolve(rows[0].ID_Coleta);
            });

        })
    }

    definirStatusCanceladaColeta(idColeta){
        
        const sql = 'UPDATE coletas set '
        + 'Status_Coleta = ? '
        + 'WHERE ID_Coleta = ?'

        const values = [,
            'CA',
            idColeta
        ]
        connection.execute(sql, values);

    }
}

module.exports = new ApiColeta();