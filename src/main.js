// incluir dependencia MySQL
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multpart = require('connect-multiparty');
const multipart = require('connect-multiparty');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const corsOptiopns = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptiopns))


// Colocar const banco de dados
const multipartMiddleware = multipart({ uploadDir: './uploads' })
app.post('/upload', multipartMiddleware, (request, response) => {
    const files = request.files;
    console.log(files);
    response.json({ message: files })
})

app.use((err, request, response, next) => response.json({error: err.message}))

app.listen(8000, () => {
    console.log('Servidor porta 8000')
})



// const mysql = require('mysql2')

// // criar conexão com banco de dados
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'ecorecicla-local',
//     database: 'ecorecicla-db'
// });


// connection.connect((err) => {
//     console.log('Conexão aprovada')
// })

// connection.query('SELECT email, username, senha from login', (err, rows, fields) => {
//     if(!err){
//         console.log('Resultado: ', rows);
//     } else{
//         console.log('Consulta nao realizada')
//     }
// })