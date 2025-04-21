const connection = require('../core/connection.js');

class ApiCliente {

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM clientes', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getClienteById(idCliente) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM clientes WHERE ID_Cliente = ?', [idCliente], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const cliente = row[0];
                
                if (cliente) {
                    return resolve(cliente);
                }
                
                return resolve(null);
            });
        });
    }

}


module.exports = new ApiCliente();