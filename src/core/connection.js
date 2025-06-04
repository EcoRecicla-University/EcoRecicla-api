const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ecorecicla_db',
    database: 'EcoRecicla'
});

connection.connect((err) => {
    console.log('Realizada a conexão com sucesso');
})

module.exports = connection;