const express = require('express')
const cors = require('cors');
const app = express();

const utils = require('./core/utils.js')

const apiCliente = require('./api/cliente.js');
const apiLogin = require('./api/login.js');
const apiSessao = require('./api/sessao.js');
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

            const tokenCriado = utils.gerarToken(email)
            const dataExpiracaoToken = utils.definirDataExpiracaoToken()

            await apiSessao.criarSessao(tokenCriado, username, dataExpiracaoToken);

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

// Funcionarios -----------------------------------------------------------------------------------------------------------------------

// Buscar todos os funcionarios
app.get('/api/funcionario', async (req, res) => {
    try {
        const funcionario = await ApiFuncionario.listarTodos()
        res.json(funcionario);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

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

        const message = error.message ?? 'Erro ao editar categoria'
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

// CATEGORIA -----------------------------------------------------------------------------------------------------------------------

// Buscar todas as categorias
app.get('/api/categoria', async (req, res) => {
    try {
        const categoria = await ApiCategoria.listarTodos()
        res.json(categoria);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Buscar categoria por ID
app.get('/api/categoria/:id', async (req, res) => {

    try {
        const idCentro = req.params.id;
    
        const dadosCategoria = await ApiCategoria.getCategoriaById(idCategoria)
        res.json(dadosCategoria);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Criar nova categoria
app.post('/api/categoria', async (req, res) => {

    const categoria = req.body.Categoria;

    try {

        idCategoria.criarNovoCategoria(categoria)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir nova categoria:', error);

        const message = error.message ?? 'Erro ao inserir nova categoria'
        return res.status(500).json({ error: message });
    }
});

// Editar categoria
app.put('/api/categoria/:id', async (req, res) => {
    const id = req.params.id
    const categoria = req.body.Categoria;

    try {
        idCategoria.editarCategoria(id, categoria)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar categoria:', error);

        const message = error.message ?? 'Erro ao editar categoria'
        return res.status(500).json({ error: message });
    }
});

// Excluir categoria
app.delete('/api/categoria/:id', async (req, res) => {
    const id = req.params.id;

    try {
        ApiCategoria.excluirCategoria(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir categoria:', error);

        const message = error.message ?? 'Erro ao excluir categoria'
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
