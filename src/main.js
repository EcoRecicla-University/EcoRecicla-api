// incluir dependencia MySQL
const mysql = require('mysql2')

// criar conexão com banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ecorecicla-local',
    database: 'ecorecicla-db'
});


connection.connect((err) => {
    console.log('Conexão aprovada')
})

connection.query('SELECT email, username, senha from login', (err, rows, fields) => {
    if(!err){
        console.log('Resultado: ', rows);
    } else{
        console.log('Consulta nao realizada')
    }
})