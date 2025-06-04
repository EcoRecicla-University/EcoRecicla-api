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
const ApiMovimen = require('./api/movimen.js');
const ApiEndereco = require('./api/endereco.js');
const ApiColeta = require('./api/coleta.js');
const ApiTriagem = require('./api/triagem.js');
const ApiRota = require('./api/rota.js')
const ApiVeiculoMotorista = require('./api/veiculoMotorista.js')
const ApiReportsClientes = require('./api/reports/relatorioCliente.js')

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

        const endereco = await ApiEndereco.buscarEnderecoDoCliente(idCliente)

        dadosCliente.Endereco = endereco
        
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
    const endereco = req.body.Endereco;

    try {

        const clienteId = await apiCliente.criarNovoCliente(nome, cpf, cnpj, telefone, tipoCliente)

        ApiEndereco.criarEnderecoCliente(clienteId, endereco)
        res.status(200).json({ success: true, clienteId })

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
    const endereco = req.body.Endereco;

    try {
        
        apiCliente.editarCliente(id, nome, cpf, cnpj, telefone, tipoCliente)

        ApiEndereco.editarEnderecoDoCliente(id, endereco)
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
        await apiCliente.excluirCliente(id)
        ApiEndereco.excluirEnderecoDoCliente(id)
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
    const somenteDisponiveis = req.query.somenteDisponiveis

    try {
        if(somenteDisponiveis == 'true') {
            const veiculos = await apiVeiculo.listarTodosDiponiveis()
            res.json(veiculos);
        } else {
            const veiculos = await apiVeiculo.listarTodos()
            res.json(veiculos);
        }

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
    const somenteDisponiveis = req.query.somenteDisponiveis

    try {
        if(somenteDisponiveis == 'true') {
            const motoristas = await ApiMotoristas.listarTodosDiponiveis()
            res.json(motoristas);
        } else {
            const motoristas = await ApiMotoristas.listarTodos();
            res.json(motoristas);
        }

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

// MOVIMENTO DE ESTOQUE

// Criar novo movimento de estoque
app.post('/api/movimen', async (req, res) => {

    const quantidade = req.body.quantidade;
    const dataEntrada = req.body.dataEntrada;
    try {

        ApiMovimen.criarNovaMovimen(quantidade, dataEntrada)
        
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir nova movimentação:', error);

        const message = error.message ?? 'Erro ao inserir novo centro'
        return res.status(500).json({ error: message });
    }
    
});

app.get('/api/movimen', async (req, res) => {
    const idsColeta = await ApiMovimen.buscarColetas(idsColeta)
    try {
        res.json(idsColeta)
    } catch(error) {
        console.error('Erro ao buscar chave de coleta', error);
        
        return res.status(500).json({ error: message });
    }
})

// Coleta -----------------------------------------------------------------------------------------------------------

// criar nova coleta
app.post('/api/coleta', async (req, res) => {

    const idCliente = req.body.Cliente_ID;
    const dataColeta = req.body.Data_Coleta;
    const quantidade = req.body.Quantidade;
    const statusColeta = req.body.Status_Coleta;

    try {

        ApiColeta.criarNovaColeta(idCliente, dataColeta, quantidade, statusColeta)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir novo cliente:', error);

        const message = error.message ?? 'Erro ao inserir novo cliente'
        return res.status(500).json({ error: message });
    }
});

// Listar coletas
app.get('/api/coleta', async (req, res) => {
    const coletas = await ApiColeta.listarTodos()
    try {
        res.json(coletas)
    } catch(error) {
        console.error('Erro ao buscar coletas', error);
        
        return res.status(500).json({ error: message });
    }
})

// Listar coletas habilitadas
app.get('/api/coleta/habilitadas', async (req, res) => {
    const coletasHabilitadas = await ApiColeta.listarTodosHabilitadas()
    try {
        res.json(coletasHabilitadas)
    } catch(error) {
        console.error('Erro ao buscar coletas', error);
        
        return res.status(500).json({ error: message });
    }
})

// Buscar coleta por ID
app.get('/api/coleta/:id', async (req, res) => {

    try {
        const idColeta = req.params.id;
    
        const dadosColeta = await ApiColeta.getColetaById(parseInt(idColeta))
        res.json(dadosColeta);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Editar Coleta
app.put('/api/coleta/:id', (req, res) => {
    const idColeta = req.params.id;
    const dataColeta = req.body.Data_Coleta;
    const idCliente = req.body.ID_Cliente;
    const quantidade = req.body.Quantidade;
    const statusColeta = req.body.Status_Coleta;

    try {
        ApiColeta.editarColeta(idColeta, idCliente, dataColeta, quantidade, statusColeta)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar coleta:', error);

        const message = error.message ?? 'Erro ao editar coleta'
        return res.status(500).json({ error: message });
    }
});

// Centro de triagem -----------------------------------------------------------------------------------------------------

// Criar novo centro de triagem
app.post('/api/triagem', async (req, res) => {

    const nomeCentro = req.body.Nome_Centro;
    const capacidade = req.body.Capacidade_Armaze;
    const endereco = req.body.Endereco;

    try {

        const idTriagem = await ApiTriagem.criarNovoCentroTriagem(nomeCentro, capacidade)

        ApiEndereco.criarEnderecoCentroTriagem(idTriagem, endereco)
        res.status(200).json({ success: true, idTriagem })

    } catch(error) {
        console.error('Erro ao inserir novo cliente:', error);

        const message = error.message ?? 'Erro ao inserir novo cliente'
        return res.status(500).json({ error: message });
    }
});

// Buscar todos os centros
app.get('/api/triagem', async (req, res) => {
    try {
        const centrosTriagem = await ApiTriagem.listarTodos();
        res.json(centrosTriagem);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});


// Rotas --------------------------------------------------------------------------------------------------------------

// Criar rota
app.post('/api/rota', async (req, res) => {

    const idColeta = req.body.ID_Coleta;
    const idMotorista = req.body.ID_Motorista;
    const idVeiculo = req.body.ID_Veiculo;
    const idFuncionario = req.body.ID_Funci;
    const idCentroInicio = req.body.ID_Centro_Inicio;
    const idCentroFim = req.body.ID_Centro_Fim;

    try {
        const motoristaVeiculo = await ApiVeiculoMotorista.verificarExistenciaMotoristaVeiculo(idMotorista, idVeiculo)
                    
        if(motoristaVeiculo.length > 0){
            throw new Error('Esse motorista e esse veículo já estão sendo usados em outra rota.')
        }
        
        const motoristaVeiculoId = await ApiVeiculoMotorista.criarVinculoVeiculoMotorista(idMotorista, idVeiculo)

        ApiRota.criarNovaRota(idColeta, motoristaVeiculoId , idFuncionario, idCentroInicio, idCentroFim)
        res.status(200).json({ success: true , motoristaVeiculoId})

    } catch(error) {
        console.error('Erro ao inserir nova rota:', error);

        const message = error.message ?? 'Erro ao inserir nova rota'
        return res.status(500).json({ error: message });
    }
});

// Buscar todas as rotas
app.get('/api/rota', async (req, res) => {
    try {
        const rotas = await ApiRota.listarTodos();
        res.json(rotas);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Buscar rota por ID
app.get('/api/rota/:id', async (req, res) => {

    try {
        const idRota = req.params.id;
    
        const dadosRota = await ApiRota.getRotaById(parseInt(idRota))
        res.json(dadosRota);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});


// Relatorios --------------------------------------------------------------------------------------------------------------

// Criar relatorio de clientes em excel
app.get('/api/clientes-relatorios', (req, res) => {
    ApiReportsClientes.gerarRelatorioClientesExcel(req, res);
});
