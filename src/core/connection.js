const mysql = require('mysql2');
const env = require('../env/environment.js');

const connection = mysql.createConnection({
    host: env.database.host,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database
});

connection.connect((err) => {
    console.log('Realizada a conexão com sucesso');
})

module.exports = connection;