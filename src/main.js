const express = require('express')
const cors = require('cors');
const app = express();

const utils = require('./core/utils.js')

const env = require('./env/environment.js');

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
const ApiRota = require('./api/rota.js');
const ApiEstoque = require('./api/estoque.js');
const ApiVeiculoMotorista = require('./api/veiculoMotorista.js');
const ApiReportsClientes = require('./api/reports/relatorioCliente.js');
const ApiReportsColetas = require('./api/reports/relatorioColeta.js');
const ApiReportsFuncionarios = require('./api/reports/relatorioFuncionarios.js');


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
            const Nome = usuarioEncontrado.Nome;
            const idFunci = usuarioEncontrado.ID_Funci;

            const tokenCriado = utils.gerarToken(email)
            const dataExpiracaoToken = utils.definirDataExpiracaoToken()

            await apiSessao.criarSessao(tokenCriado, dataExpiracaoToken, idFunci);

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
            
            await apiLogin.atualizarSenha(usuarioRecEncontrado.ID_Funci, senhaTemporaria);

            const emailServerUrl = `${env.emailServer.url}/usuario/redefinir-senha`;
            const emailServerPayload = {
                usuarioEmail: usuarioRecEncontrado.Email,
                usuarioNome: usuarioRecEncontrado.Nome,
                usuarioSenhaTemporaria: senhaTemporaria,
            };

            const emailServerRequestHeaders = new Headers();
            emailServerRequestHeaders.append('Content-Type', 'application/json');

            const emailServerResponse = await fetch(emailServerUrl, {
                method: 'POST',
                headers: emailServerRequestHeaders,
                body: JSON.stringify(emailServerPayload)
            })
            .then(res => res.json())
            .catch(err => {
                const message = err?.message ?? err?.error?.message ?? 'API - Erro ao enviar e-mail';
                return {
                    success: false,
                    message: message
                };
            });

            if (emailServerResponse.success) {
                return res.status(200).json({ message: 'Senha temporária atualizada com sucesso. Verifique seu email.', success: true });
            } else {
                return res.status(500).json({ message: emailServerResponse.message, success: false });
            }

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

// Buscar veiculo por ID
app.get('/api/veiculos/:id', async (req, res) => {

    try {
        const idVeiculo = req.params.id;
    
        const dadosVeiculo = await apiVeiculo.getVeiculoById(parseInt(idVeiculo))
        res.json(dadosVeiculo);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Editar Veiculo
app.put('/api/veiculos/:id', (req, res) => {
    const id = req.params.id;
    const placa = req.body.Placa;
    const modelo = req.body.Modelo;
    const quilometragem = req.body.Quilometragem;
    const renavam = req.body.Renavam;
    const capacidade = req.body.Capacidade_em_Kg;

    try {
        apiVeiculo.editarVeiculo(parseInt(id), placa, modelo, quilometragem, renavam, capacidade)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar veiculo:', error);

        const message = error.message ?? 'Erro ao editar veiculo'
        return res.status(500).json({ error: message });
    }
});

// Deletar veiculo
app.delete('/api/veiculos/:id', async (req, res) => {
    const id = req.params.id;

    try {

        const veiculoEmVeiculoMotorista = await ApiVeiculoMotorista.verificarExistenciaMotoristaVeiculo(null, id)

        if(veiculoEmVeiculoMotorista.length > 0){
            throw new Error('Esse veículo está sendo usado em uma rota.')
        }

        apiVeiculo.excluirVeiculo(id)

        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir veiculo:', error);

        const message = error.message ?? 'Erro ao excluir veiculo'
        return res.status(500).json({ error: message });
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
        const motoristaEmVeiculoMotorista = await ApiVeiculoMotorista.verificarExistenciaMotoristaVeiculo(id, null)

        if(motoristaEmVeiculoMotorista.length > 0){
            throw new Error('Esse motorista está sendo usado em uma rota.')
        }

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

// Movimentacao -----------------------------------------------------------------------------------------------------------------------

// Criar nova movimentacao
app.post('/api/movimen', async (req, res) => {

    const quantidade = req.body.Quantidade;
    const dataEntrada = req.body.Data_Entrada;
    const idRota = req.body.ID_Rota;
    const categoria = req.body.Categoria;
    const avisarEstoqueMax = req.body.AvisarEstoqueMax;
    const avisarEstoqueMin = req.body.AvisarEstoqueMin;

    try {
        ApiMovimen.criarNovaMovimen(quantidade, dataEntrada, parseInt(idRota), categoria, avisarEstoqueMax, avisarEstoqueMin)
        
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao inserir nova movimentacao:', error);

        const message = error.message ?? 'Erro ao inserir nova movimentacao'
        return res.status(500).json({ error: message });
    }
    
});

// Buscar todas as movimentacoes
app.get('/api/movimen', async (req, res) => {
    
    const movimentacoes = await ApiMovimen.listarTodos()

    try {
        res.json(movimentacoes)
    } catch(error) {
        console.error('Erro ao buscar movimentacoes', error);
        
        return res.status(500).json({ error: message });
    }

})

// Buscar movimentacao por ID
app.get('/api/movimen/:id', async (req, res) => {

    try {
        const idMovimentacao = req.params.id;
    
        const dadosMovimentacao = await ApiMovimen.getMovimenById(parseInt(idMovimentacao))
        res.json(dadosMovimentacao);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Editar movimentacao
app.put('/api/movimen/:id', (req, res) => {
    const idMovimentacao = req.params.id;
    const quantidade = req.body.Quantidade;
    const dataEntrada = req.body.Data_Entrada;
    const idRota = req.body.ID_Rota;
    const categoria = req.body.Categoria;
    const avisarEstoqueMax = req.body.AvisarEstoqueMax;
    const avisarEstoqueMin = req.body.AvisarEstoqueMin;

    try {
        ApiMovimen.editarMovimen(parseInt(idMovimentacao), parseInt(idRota), quantidade, dataEntrada, categoria, avisarEstoqueMax, avisarEstoqueMin)
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar movimentacao:', error);

        const message = error.message ?? 'Erro ao editar movimentacao'
        return res.status(500).json({ error: message });
    }
});

// Deletar movimentacao
app.delete('/api/movimen/:id', async (req, res) => {
    const id = req.params.id;

    try {
        ApiMovimen.excluirMovimen(id)
        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir movimentacao:', error);

        const message = error.message ?? 'Erro ao excluir movimentacao'
        return res.status(500).json({ error: message });
    }
});

// Estoque -----------------------------------------------------------------------------------------------------------

// Buscar dados estoque por ID
app.get('/api/estoque/:id', async (req, res) => {

    try {
        const idEstoque = req.params.id;
    
        const dadosEstoque = await ApiEstoque.getEstoqueById(parseInt(idEstoque))
        res.json(dadosEstoque);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Coleta -----------------------------------------------------------------------------------------------------------

// criar nova coleta
app.post('/api/coleta', async (req, res) => {

    const idCliente = req.body.Cliente_ID;
    const dataColeta = req.body.Data_Coleta;
    const quantidade = req.body.Quantidade;

    try {

        ApiColeta.criarNovaColeta(idCliente, dataColeta, quantidade)
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

// Buscar centro por ID
app.get('/api/triagem/:id', async (req, res) => {

    try {
        const id = req.params.id;
    
        const dadosTriagem = await ApiTriagem.getTriagemById(parseInt(id))
        const enderecoTriagem = await ApiEndereco.buscarEnderecoDaTriagem(id)

        dadosTriagem.Endereco = enderecoTriagem

        res.json(dadosTriagem);

    } catch(error) {
        console.error('Erro na consulta:', error);
        return res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
    }
});

// Editar centro
app.put('/api/triagem/:id', async (req, res) => {
    const id = req.params.id
    const nomeCentro = req.body.Nome_Centro;
    const capacidade = req.body.Capaci_Armaze;
    const endereco = req.body.Endereco;

    try {
        ApiEndereco.editarEnderecoDaTriagem(id, endereco)
        
        ApiTriagem.editarTriagem(id, nomeCentro, capacidade)
        res.status(200).json({ success: true })

    } catch(error) {
        console.error('Erro ao editar centro de triagem:', error);

        const message = error.message ?? 'Erro ao editar centro de triagem'
        return res.status(500).json({ error: message });
    }
});

// Excluir centro
app.delete('/api/triagem/:id', async (req, res) => {
    const id = req.params.id;

    try {

        const triagemEmRota = await ApiRota.buscarTriagemEmRota(id)

        if(triagemEmRota.length > 0){
            throw new Error('Não pode excluir esse Centro de Triagem porque ele esta incluso em uma rota.')
        }

        ApiEndereco.excluirEnderecoDaTriagem(id)
        ApiTriagem.excluirTriagem(id)

        res.status(200).json({ success: true })

    } catch(error){
        console.error('Erro ao excluir centro de triagem:', error);

        const message = error.message ?? 'Erro ao excluir centro de triagem'
        return res.status(500).json({ error: message });
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
        ApiColeta.definirStatusEmAndamentoColeta(idColeta)
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

// Editar Rota
app.put('/api/rota/:id', async (req, res) => {
    const idRota = req.params.id
    const idColeta = req.body.ID_Coleta;
    const idMotorista = req.body.ID_Motorista;
    const idVeiculo = req.body.ID_Veiculo;
    const idFuncionario = req.body.ID_Funci;
    const idCentroInicio = req.body.ID_Centro_Inicio;
    const idCentroFim = req.body.ID_Centro_Fim;

    try {
        const motoristaVeiculo = await ApiVeiculoMotorista.verificarExistenciaMotoristaVeiculo(idMotorista,idVeiculo)
        const motoristaVeiculoId = motoristaVeiculo[0]?.ID_Veiculo_Motorista;
        
        await ApiVeiculoMotorista.editarMotoristaVeiculo(motoristaVeiculoId, idMotorista, idVeiculo)
        ApiRota.editarRota(parseInt(idRota), parseInt(idFuncionario), parseInt(idCentroInicio), parseInt(idCentroFim), parseInt(idColeta))
        res.status(200).json({ success: true })
    } catch(error) {
        console.error('Erro ao editar motorista e veiculo:', error);

        const message = error.message ?? 'Erro ao editar motorista e veiculo'
        return res.status(500).json({ error: message });
    }
});

// Deletar rota
app.delete('/api/rota/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const idColeta = await ApiColeta.buscarIdColetaPorRota(id)
        const rota = await ApiRota.getRotaById(id);


        ApiColeta.definirStatusCanceladaColeta(idColeta)    

        await ApiRota.excluirRota(id)
        await ApiVeiculoMotorista.excluirVeiculoMotorista(rota.ID_Veiculo_Motorista)
        

        res.status(200).json({ success: true })
    } catch(error){
        console.error('Erro ao excluir rota:', error);

        const message = error.message ?? 'Erro ao excluir rota'
        return res.status(500).json({ error: message });
    }
});

// Relatorios --------------------------------------------------------------------------------------------------------------

// Criar relatorio de clientes em excel
app.get('/api/relatorio/clientes', (req, res) => {
    ApiReportsClientes.gerarRelatorioClientesExcel(req, res);
});

// Criar relatorio de funcionario em excel
app.get('/api/relatorio/funcionarios', (req, res) => {
    ApiReportsFuncionarios.gerarRelatorioFuncionariosExcel(req, res);
});

app.post('/api/relatorio/coleta', async (req, res) => {
  const { dataInicio, dataFim } = req.body;

  try {
    const workbook = await ApiReportsColetas.gerarRelatorioColetasPorData(dataInicio, dataFim);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_coletas.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Erro ao gerar relatório de coletas:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de coletas' });
  }
});

// Dashboard --------------------------------------------------------------------------------------------------------------

app.post('/api/dashboard/coleta', async (req, res) => {
  const { dataInicio, dataFim } = req.body;

  try {

    const coletas = await ApiReportsColetas.obterColetasPorIntervalo(dataInicio, dataFim);
    res.json(coletas);

  } catch (error) {
    console.error('Erro ao gerar dashboard de coletas:', error);
    res.status(500).json({ error: 'Erro ao gerar dashboard de coletas' });
  }
});