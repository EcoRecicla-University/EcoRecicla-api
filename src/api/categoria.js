const connection = require('../core/connection.js');
const CategoriaValidator = require('../validator/categoria.js')

class ApiCategoria {

    listarTodos() {

        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM categorias', (err, rows) => {

                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                return resolve(rows);
            });
        });
    }
    
    getCentroById(idCategoria) {
    
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM categoria WHERE ID_Categoria = ?', [idCategoria], (err, row) => {
            
                if (err) {
                    return reject('Erro na consulta: ' + err);
                }
                
                const categoria = row[0];
                
                if (categoria) {
                    return resolve(categoria);
                }
                
                return resolve(null);
            });
        });
    }

    criarNovoCategoria(categoria){

        CategoriaValidator.validarCriacao(categoria)

        const sql = 'INSERT INTO categoria '
        + '(Categoria)'
        + ' VALUES (?)';
        const values = [
            categoria,
            
        ];

        connection.execute(sql, values);
    }

    editarCategoria(categoria) {

        CategoriaValidator.validarCriacao(categoria)

        const sql = 'UPDATE Categorias set '
        + 'categorias = ?'
        + 'WHERE ID_Categoria = ?'

        const values = [
            categoria,
            id
        ]
        connection.execute(sql, values);
    }

    excluirCategoria(id) {

        const sql = 'DELETE from categorias '
        + 'WHERE ID_Categoria = ?'
        const values = [id]

        connection.execute(sql, values)
    }
}

module.exports = new ApiCategoria();