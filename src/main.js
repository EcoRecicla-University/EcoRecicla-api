const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, response) => {
    response.send('app get')
})

app.post('/', (req, response) => {
    response.send('app Post')
})

app.delete('/', (req, response) => {
    response.send('app Delete')
})

app.listen(PORT, () => {
    console.log(`Esse projeto esta rodando na porta ${PORT}`)

})