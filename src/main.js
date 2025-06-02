const express = require('express')
const cors = require('cors');
const app = express();

const utils = require('./core/utils.js')

const apiCliente = require('./api/cliente.js');
const apiLogin = require('./api/login.js');
const apiSessao = require('./api/sessao.js');
const apiVeiculo = require('./api/veiculo.js');
const apiFuncionarios = require('./api/funcionarios.js');
const ApiMotoristas = require('./api/motoristas.js');
const ApiMovimen = require('./api/movimen.js')

app.use(cors());
app.use(express.json())

const port = 4200;

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
    const tipoCliente = req.body.Tipo_Cliente;

    try {
        console.log('teste aqui')
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
    const tipoCliente = req.body.Tipo_Cliente

    try {
        apiCliente.editarCliente(id, nome, cpf, cnpj, telefone, tipoCliente)
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

// Buscar todos os funcionarios
app.get('/api/funcionarios', async (req, res) => {
    try {
        const funcionarios = await apiFuncionarios.listarTodos()
        res.json(funcionarios);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Cadastrar novo funcionario
app.post('/api/funcionarios', async (req, res) => {

    const nome = req.body.Nome;
    const cpf = req.body.CPF;
    const rg = req.body.RG;
    const telefone = req.body.Telefone;
    const dataNascimento = req.body.Data_Nascimento;
    const dataContratacao = req.body.Data_Contratacao;
    const estadoCivil = req.body.Estado_Civil;
    const email = req.body.Email;

    try {

        apiFuncionarios.criarNovoFuncionario(nome, cpf, rg, telefone, dataNascimento, dataContratacao, estadoCivil, email)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo funcionario:', error);

        const message = error.message ?? 'Erro ao inserir novo funcionario'
        return res.status(500).json({ error: message });
    }
});

// Buscar funcionario por ID
app.get('/api/funcionarios/:id', async (req, res) => {

    try {
        const idFuncionario = req.params.id;
    
        const dadosFuncionario = await apiFuncionarios.getFuncionarioById(parseInt(idFuncionario))
        res.json(dadosFuncionario);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Editar Funcionario
app.put('/api/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    const nome = req.body.Nome;
    const cpf = req.body.CPF;
    const rg = req.body.RG;
    const telefone = req.body.Telefone;
    const dataNascimento = req.body.Data_Nascimento;
    const dataContratacao = req.body.Data_Contratacao;
    const estadoCivil = req.body.Estado_Civil;
    const email = req.body.Email;

    try {
        apiFuncionarios.editarFuncionario(parseInt(id), nome, cpf, rg, telefone, dataNascimento, dataContratacao, estadoCivil, email)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar funcionario:', error);

        const message = error.message ?? 'Erro ao editar funcionario'
        return res.status(500).json({ error: message });
    }
});

// Deletar usuario
app.delete('/api/funcionarios/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await apiFuncionarios.excluirFuncionario(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir funcionario:', error);

        const message = error.message ?? 'Erro ao excluir funcionario'
        return res.status(500).json({ error: message });
    }
});

// Motoristas -----------------------------------------------------------------------------------------------------------------------

// Cadastrar novo motorista
app.post('/api/motoristas', async (req, res) => {

    const idFuncionario = req.body.ID_Funci;
    const categoria = req.body.Categoria;
    const numeroRogistro = req.body.Numero_Registro;
    const validadeCarteira = req.body.Validade;

    try {

        ApiMotoristas.criarNovoMotorista(idFuncionario, categoria, numeroRogistro, validadeCarteira)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo motorista:', error);

        const message = error.message ?? 'Erro ao inserir novo motorista'
        return res.status(500).json({ error: message });
    }
});

// Buscar todos os motoristas
app.get('/api/motoristas', async (req, res) => {
    try {
        const motoristas = await ApiMotoristas.listarTodos();
        res.json(motoristas);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Deletar motorista
app.delete('/api/motoristas/:id', async (req, res) => {
    const id = req.params.id;

    try {
        ApiMotoristas.excluirMotorista(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir motorista:', error);

        const message = error.message ?? 'Erro ao excluir motorista'
        return res.status(500).json({ error: message });
    }
});

// Buscar motorista por ID
app.get('/api/motoristas/:id', async (req, res) => {

    try {
        const idMotorista = req.params.id;
    
        const dadosMotorista = await ApiMotoristas.getMotoristaById(parseInt(idMotorista))
        res.json(dadosMotorista);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Editar Motorista
app.put('/api/motoristas/:id', (req, res) => {
    const idMotorista = req.params.id;
    const idFuncionario = req.body.ID_Funci;
    const categoria = req.body.Categoria;
    const numeroRegistro = req.body.Numero_Registro;
    const validade = req.body.Validade;

    try {
        ApiMotoristas.editarMotorista(parseInt(idMotorista), parseInt(idFuncionario), categoria, numeroRegistro, validade)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar motorista:', error);

        const message = error.message ?? 'Erro ao editar motorista'
        return res.status(500).json({ error: message });
    }
});

// MOVIMENTAÇÕES ---------------------------------------------------------------------------------------------------------------------

// Criar nova movimentação
app.post('/api/movimen', async (req, res) => {
        const {ID_Coleta_Tipo_Residuo, Quantidade, Data_Entrada, AvisarEstoqueMax, AvisarEstoqueMin} = req.body;

        try {
        const nova = await ApiMovimen.criarNovaMovimen(
            ID_Coleta_Tipo_Residuo,
            Quantidade,
            Data_Entrada,
            AvisarEstoqueMax,
            AvisarEstoqueMin
        );

    res.status(201).json(nova);
  } catch (error) {
    console.error('Erro ao inserir nova movimentação:', error);
    const message = error.message ?? 'Erro ao inserir nova movimentação';
    return res.status(500).json({ error: message });
  }
});

// Listar movimentações detalhadas (com nome do tipo de resíduo)
app.get('/api/movimen', async (req, res) => {
  try {
    const dados = await ApiMovimen.listarDetalhado();
    res.json(dados);
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
  }
});

// Buscar movimentação por ID
app.get('/api/movimen/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const movimen = await ApiMovimen.getMovimenById(id);
    if (!movimen) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json(movimen);
  } catch (error) {
    console.error('Erro ao buscar movimentação:', error);
    return res.status(500).json({ error: 'Erro ao buscar movimentação' });
  }
});

// Buscar chave coletas por ID
app.get('/api/movimen', async (req, res) => {
  try {
    const chaves = await ApiMovimen.getChavesColeta();
    res.json(chaves);
  } catch (error) {
    console.error('Erro ao buscar chaves de coleta:', error);
    res.status(500).json({ error: 'Erro ao buscar chaves de coleta' });
  }
});


// Editar movimentação
app.put('/api/movimen/:id', async (req, res) => {
  const id = req.params.id;

    const {
        ID_Coleta_Tipo_Residuo,
        Quantidade,
        Data_Entrada,
        AvisarEstoqueMax,
        AvisarEstoqueMin
    } = req.body;

  try {
    const atualizada = await ApiMovimen.editarMovimen(
      id,
      ID_Coleta_Tipo_Residuo,
      Quantidade,
      Data_Entrada,
      AvisarEstoqueMax,
      AvisarEstoqueMin
    );

    res.json(atualizada);
  } catch (error) {
    console.error('Erro ao editar movimentação:', error);
    const message = error.message ?? 'Erro ao editar movimentação';
    return res.status(500).json({ error: message });
  }
});

// Excluir movimentação
app.delete('/api/movimen/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await ApiMovimen.excluirMovimen(id);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error);
    const message = error.message ?? 'Erro ao excluir movimentação';
    return res.status(500).json({ error: message });
  }
});
