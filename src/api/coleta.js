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
            const sql = 'SELECT c.Nome AS Nome, t.* from coletas t  INNER JOIN clientes c ON t.ID_Cliente = c.ID_Cliente Where Status_Coleta != ?';
            
            connection.query(sql,['CA'], (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }

    criarNovaColeta(idCliente, dataColeta, quantidade, statusColeta){

        ColetaValidator.validarCriacao(idCliente, dataColeta, quantidade, statusColeta)

        const sql = 'INSERT INTO coletas '
        + '(Data_Coleta, Quantidade, Status_Coleta, ID_Cliente)'
        + ' VALUES (?, ?, ?, ?)';
        const values = [
            dataColeta,
            quantidade,
            statusColeta,
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
        + 'ID_Cliente = ?, Quantidade = ?, Data_Coleta = ?, Status_Coleta = ? '
        + 'WHERE ID_Coleta = ?'

        const values = [
            idCliente,
            quantidade,
            new Date(dataColeta),
            statusColeta,
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
}

module.exports = new ApiColeta();