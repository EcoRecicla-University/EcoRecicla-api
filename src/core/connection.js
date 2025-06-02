const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gabriel286',
    database: 'ecorecicla'
});

connection.connect((err) => {
    console.log('Realizada a conexão com sucesso');
})

module.exports = connection;