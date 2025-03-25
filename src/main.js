const mysql = require('mysql2');
const express = require('express')
const app = express();

// Banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ecorecicla-local',
    database: 'ecorecicla-db'
})

connection.connect((err) => {
    console.log('Realizada a conexão com sucesso')
})

const getValorBD = () => {

    return new Promise((resolve, reject) => {

        connection.query('SELECT email, senha FROM login', (err, rows) => {

            if (err) {
                reject('Erro na consulta: ' + err);
            } else {
                resolve(rows);
            }

        });
    });
};


app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const valorBD = await getValorBD();  // Aguarda a consulta ser concluída
        return res.json(valorBD);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao obter dados' });
    }
})

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 3000: http://localhost:8080/')
})