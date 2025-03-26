const mysql = require('mysql2');
const express = require('express')
const cors = require('cors');
const bodyParser = require('express')
const app = express();

app.use(cors());

// Banco de dados ---------------------------------------------------------------------------

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ecorecicla-local',
    database: 'ecorecicla-db'
})

connection.connect((err) => {
    console.log('Realizada a conexão com sucesso')
})


function getValorBD (email, senha)  {

    return new Promise((resolve, reject) => {

        connection.query('SELECT email, senha FROM login WHERE email = ? and senha = ?', [email, senha], (err, rows) => {

            if (err) {
                reject('Erro na consulta: ' + err);
            } else {
                resolve(rows[0]);
            }

        });
    });
};


// Express --------------------------------------------------------------------------

app.use(express.json())

// app.get('/api/login', async (req, res) => {
//     try {
//         const valorBD = await getValorBD();  // Aguarda a consulta ser concluída
//         return res.json(valorBD);
//     } catch (error) {   // caso não concluir a consulta, mostar erro
//         console.log(error);
//         return res.status(500).json({ error: 'Erro ao obter dados' });
//     }
// })

app.post('/api/login', async (req, res) => {

    // const { email, senha } = req.body;

    const email = req.body.email;
    const senha = req.body.password;

    try {
        const usuarioEncontrado = await getValorBD(email, senha); // Obtém todos os usuários do banco

        if (usuarioEncontrado) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'Usuário ou senha inválida' });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }

})


app.listen(8080, () => {
    console.log('Servidor iniciado na porta 3000: http://localhost:8080/api/login')
})