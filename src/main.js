const express = require('express')
const cors = require('cors');
const app = express();

const utils = require('./core/utils.js')

const apiCliente = require('./api/cliente.js');
const apiLogin = require('./api/login.js');
const apiSessao = require('./api/sessao.js');
const apiVeiculo = require('./api/veiculo.js');
const apiFuncionarios = require('./api/funcionarios.js');

app.use(cors());
app.use(express.json())

const port = 8080;

// Porta do servidor
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}/api`)
})


// Login -----------------------------------------------------------------------------------------------------------------------

app.post('/api/login', async (req, res) => {
    const { email, password: senha } = req.body;

    try {
        const usuarioEncontrado = await apiLogin.buscarUsuario(email, senha);

        if (usuarioEncontrado) {
            const username = usuarioEncontrado.username;
            const idLogin = usuarioEncontrado.ID_Login;

            console.log(usuarioEncontrado)

            const tokenCriado = utils.gerarToken(email)
            const dataExpiracaoToken = utils.definirDataExpiracaoToken()

            await apiSessao.criarSessao(tokenCriado, username, dataExpiracaoToken, idLogin);

            return res.status(200).json({ success: true, token: tokenCriado });
        } else {
            return res.status(401).json({ success: false, message: 'Usuário ou senha inválida' });
        }

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


// Recuperar senha --------------------------------------
app.post('/api/recuperacao-senha', async (req, res) => {

    const email = req.body.email;

    try {
        const usuarioRecEncontrado = await apiLogin.getUsuarioPorEmail(email);

        if (usuarioRecEncontrado) {
            const senhaTemporaria = utils.gerarSenhaTemporaria()
           
            await apiLogin.atualizarSenha(email, senhaTemporaria);

            return res.status(200).json({ message: 'Senha temporária atualizada com sucesso. Verifique seu email.', success: true });
        } else {
            return res.status(401).json({ message: 'Usuário não encontrado na base de dados', success: false });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }

})



// Clientes -----------------------------------------------------------------------------------------------------------------------

// Buscar todos os clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await apiCliente.listarTodos()
        res.json(clientes);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Buscar cliente por ID
app.get('/api/clientes/:id', async (req, res) => {

    try {
        const idCliente = req.params.id;
    
        const dadosCliente = await apiCliente.getClienteById(idCliente)
        res.json(dadosCliente);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Criar novo cliente
app.post('/api/clientes', async (req, res) => {

    const nome = req.body.Nome;
    const cpf = req.body.CPF;
    const cnpj = req.body.CNPJ;
    const telefone = req.body.Telefone;
    const pontoColeta = req.body.Pontos_Coleta;
    const tipoCliente = req.body.Tipo_Cliente;

    try {

        apiCliente.criarNovoCliente(nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo cliente:', error);

        const message = error.message ?? 'Erro ao inserir novo cliente'
        return res.status(500).json({ error: message });
    }
});

// Editar cliente
app.put('/api/clientes/:id', async (req, res) => {
    const id = req.params.id
    const nome = req.body.Nome
    const cpf = req.body.CPF
    const cnpj = req.body.CNPJ
    const telefone = req.body.Telefone
    const pontoColeta = req.body.Pontos_Coleta
    const tipoCliente = req.body.Tipo_Cliente

    try {
        apiCliente.editarCliente(id, nome, cpf, cnpj, telefone, pontoColeta, tipoCliente)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar cliente:', error);

        const message = error.message ?? 'Erro ao editar cliente'
        return res.status(500).json({ error: message });
    }
});


// Excluir cliente
app.delete('/api/clientes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        apiCliente.excluirCliente(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir cliente:', error);

        const message = error.message ?? 'Erro ao excluir cliente'
        return res.status(500).json({ error: message });
    }
});

// Veiculo -----------------------------------------------------------------------------------------------------------------------

// Criar novo veiculo
app.post('/api/veiculos', async (req, res) => {

    const placa = req.body.Placa;
    const modelo = req.body.Modelo;
    const quilometragem = req.body.Quilometragem;
    const renavam = req.body.Renavam;
    const capacidade = req.body.Capacidade_em_Kg;
    // const idMotorista = req.body.ID_Motorista;

    try {

        apiVeiculo.criarNovoVeiculo(placa, modelo, quilometragem, renavam, capacidade)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo veiculo:', error);

        const message = error.message ?? 'Erro ao inserir novo veiculo'
        return res.status(500).json({ error: message });
    }
});

// Buscar todos os veiculos
app.get('/api/veiculos', async (req, res) => {
    try {
        const veiculos = await apiVeiculo.listarTodos()
        res.json(veiculos);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});


// Funcionarios -----------------------------------------------------------------------------------------------------------------------

app.get('/api/funcionarios', async (req, res) => {
    try {
        const funcionarios = await apiFuncionarios.listarTodos()
        res.json(funcionarios);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Motoristas -----------------------------------------------------------------------------------------------------------------------

// Buscar todos os motoristas

// Buscar funcionario por ID
app.get('/api/funcionario/:id', async (req, res) => {

    try {
        const idFuncionario = req.params.id;
    
        const dadosFuncionario = await ApiFuncionario.getFuncionarioById(idFuncionario)
        res.json(dadosFuncionario);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Criar novo funcionario
app.post('/api/funcionario', async (req, res) => {

    const nome = req.body.Nome;
    const dataNascimento = req.body.Data_Nascimento;
    const cpf = req.body.cpf;
    const rg = req.body.Telefone;
    const estadoCivil = req.body.estadoCivil;
    const Telefone = req.body.Telefone;

    try {

        idFuncionario.criarNovoFuncionario(nome, dataNascimento, cpf, rg, estadoCivil, Telefone)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo funcionario:', error);

        const message = error.message ?? 'Erro ao inserir novo funcionario'
        return res.status(500).json({ error: message });
    }
});

// Editar funcionario
app.put('/api/funcionario/:id', async (req, res) => {
    const id = req.params.id
    const nome = req.body.Nome;
    const dataNascimento = req.body.Data_Nascimento;
    const cpf = req.body.cpf;
    const rg = req.body.Telefone;
    const estadoCivil = req.body.estadoCivil;
    const Telefone = req.body.Telefone;

    try {
        idFuncionario.editarFuncionario(id, nome, dataNascimento, cpf, rg, estadoCivil, Telefone)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar funcionario:', error);

        const message = error.message ?? 'Erro ao editar funcionario'
        return res.status(500).json({ error: message });
    }
});

// Excluir funcionario
app.delete('/api/funcionario/:id', async (req, res) => {
    const id = req.params.id;

    try {
        apiCliente.excluirFuncionario(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir funcionario:', error);

        const message = error.message ?? 'Erro ao excluir funcionario'
        return res.status(500).json({ error: message });
    }
});

// Centros -----------------------------------------------------------------------------------------------------------------------

// Buscar todos os centros
app.get('/api/centro', async (req, res) => {
    try {
        const funcionario = await ApiCentros.listarTodos()
        res.json(funcionario);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Buscar centro por ID
app.get('/api/centro/:id', async (req, res) => {

    try {
        const idCentro = req.params.id;
    
        const dadosCentros = await ApiCentros.getCentroById(idCentro)
        res.json(dadosCentros);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Criar novo centro
app.post('/api/centro', async (req, res) => {

    const endereco = req.body.Endereço;
    const capaciArmaze = req.body.Capaci_Armaze;

    try {

        idCentro.criarNovoCentro(endereco, capaciArmaze)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo centro:', error);

        const message = error.message ?? 'Erro ao inserir novo centro'
        return res.status(500).json({ error: message });
    }
});

// Editar centro
app.put('/api/centro/:id', async (req, res) => {
    const id = req.params.id
    const endereco = req.body.Endereço;
    const capaciArmaze = req.body.Capaci_Armaze;

    try {
        idCentro.editarCentro(id, endereco, capaciArmaze)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar centro:', error);

        const message = error.message ?? 'Erro ao editar centro'
        return res.status(500).json({ error: message });
    }
});

// Excluir centro
app.delete('/api/centro/:id', async (req, res) => {
    const id = req.params.id;

    try {
        ApiCentros.excluirCentro(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir centro:', error);

        const message = error.message ?? 'Erro ao excluir centro'
        return res.status(500).json({ error: message });
    }
});