import { GoogleGenerativeAI } from '@google/generative-ai';
import HistoricoConversaIA from '../models/HistoricoConversaIAModel.js';
import { Projeto, Tarefa, Usuario, Quadro, Coluna } from '../models/index.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tools = [
  {
    functionDeclarations: [
      {
        name: "criar_tarefa",
        description: "Cria uma nova tarefa no projeto.",
        parameters: {
          type: "OBJECT",
          properties: {
            nome: { type: "STRING", description: "Nome da tarefa" },
            descricao: { type: "STRING", description: "Descrição detalhada da tarefa" },
            prioridade: { type: "STRING", enum: ["BAIXA", "MEDIA", "ALTA", "CRITICA"], description: "Prioridade da tarefa" },
            coluna_id: { type: "INTEGER", description: "ID da coluna onde a tarefa será criada" },
            responsavel_id: { type: "INTEGER", description: "ID do usuário responsável pela tarefa" }
          },
          required: ["nome", "coluna_id"]
        }
      },
      {
        name: "criar_coluna",
        description: "Cria uma nova coluna no quadro do projeto.",
        parameters: {
          type: "OBJECT",
          properties: {
            nome: { type: "STRING", description: "Nome da coluna" }
          },
          required: ["nome"]
        }
      }
    ]
  }
];

const model = genAI.getGenerativeModel({ 
    model: 'models/gemini-2.0-flash-lite-preview',
    tools: tools
});

/**
 * Processa um prompt e retorna a resposta do Gemini,
 * mantendo o histórico da conversa e considerando o contexto.
 */
export const generate = async (req, res) => {
    const { prompt, projeto_id, tarefa_id } = req.body;
    const userToken = req.user; // Do middleware de auth

    if (!prompt || !projeto_id) {
        return res.status(400).json({ error: 'Prompt e projeto_id são obrigatórios' });
    }

    try {
        // Buscar usuário completo para ter o nome
        const user = await Usuario.findByPk(userToken.id);
        if (!user) {
             return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // 1. Buscar Contexto do Projeto
        const projeto = await Projeto.findByPk(projeto_id, {
            include: [
                { model: Usuario, as: 'responsavel', attributes: ['nome', 'email'] }
            ]
        });

        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        // Buscar Quadro e Colunas
        const quadro = await Quadro.findOne({ where: { projeto_id } });
        let colunas = [];
        if (quadro) {
            colunas = await Coluna.findAll({ where: { quadro_id: quadro.id } });
        }

        let contexto = `Você é um assistente virtual do projeto "${projeto.nome}".
        Descrição do projeto: ${projeto.descricao || 'Sem descrição'}.
        Responsável: ${projeto.responsavel?.nome || 'Desconhecido'}.
        Usuário atual: ${user.nome} (${user.email}).
        ID do usuário atual: ${user.id}.
        `;

        if (colunas.length > 0) {
            contexto += `\nColunas disponíveis no quadro (ID - Nome):\n`;
            colunas.forEach(c => contexto += `- ${c.id}: ${c.nome}\n`);
        } else {
            contexto += `\nNão há colunas cadastradas neste quadro.\n`;
        }

        contexto += `
        INSTRUÇÕES OBRIGATÓRIAS PARA CRIAÇÃO DE TAREFAS:
        1. VERIFIQUE a lista de 'Colunas disponíveis no quadro' acima.
        2. SE JÁ EXISTIREM COLUNAS:
           - JAMAIS crie uma nova coluna automaticamente para colocar a tarefa. Use uma das existentes.
           - Se o usuário NÃO especificou a coluna:
             - Se houver apenas uma coluna na lista, use o ID dela automaticamente.
             - Se houver múltiplas colunas, VOCÊ DEVE PERGUNTAR ao usuário em qual delas deseja criar a tarefa (liste as opções). NÃO chame a função 'criar_tarefa' ainda. Aguarde a resposta.
           - Se o usuário especificou a coluna (pelo nome), procure o ID correspondente na lista e use-o.
        3. SE NÃO EXISTIREM COLUNAS (lista vazia):
           - Crie uma coluna padrão (ex: "A Fazer") usando a função 'criar_coluna'.
           - Em seguida, use o ID da nova coluna criada para chamar 'criar_tarefa'.
        `;

        // 2. Buscar todas as tarefas do projeto para dar contexto
        const tarefas = await Tarefa.findAll({
            where: { projeto_id },
            include: [
                { model: Usuario, as: 'responsavel', attributes: ['nome'] }
            ],
            order: [['status', 'ASC'], ['prioridade', 'DESC']]
        });

        if (tarefas && tarefas.length > 0) {
            contexto += `\n\nTarefas cadastradas no projeto:`;
            tarefas.forEach((tarefa, index) => {
                contexto += `
                ${index + 1}. ${tarefa.nome}
                   - Status: ${tarefa.status}
                   - Prioridade: ${tarefa.prioridade}
                   - Responsável: ${tarefa.responsavel?.nome || 'Ninguém'}
                   - Descrição: ${tarefa.descricao || 'Sem descrição'}
                   Tente também usar essas informações para responder perguntas relacionadas às tarefas.
                   `;
            });
        } else {
            contexto += `\n\nNenhuma tarefa cadastrada neste projeto.`;
        }

        // 3. Buscar Contexto da Tarefa específica (se fornecido)
        if (tarefa_id) {
            const tarefa = await Tarefa.findByPk(tarefa_id, {
                include: [
                    { model: Usuario, as: 'responsavel', attributes: ['nome'] }
                ]
            });
            
            if (tarefa) {
                contexto += `\n\nVocê está respondendo especificamente sobre a tarefa: "${tarefa.nome}".
                Descrição da tarefa: ${tarefa.descricao || 'Sem descrição'}.
                Status: ${tarefa.status}.
                Prioridade: ${tarefa.prioridade}.
                Responsável da tarefa: ${tarefa.responsavel?.nome || 'Ninguém'}.`;
            }
        }

        // 4. Carregar o histórico ANTERIOR
        const dbHistory = await HistoricoConversaIA.findAll({
            where: { 
                projeto_id,
                usuario_id: user.id
            },
            order: [['created_at', 'ASC']]
        });

        // 5. Formatar o histórico
        const formattedHistory = dbHistory.map(msg => ({
            role: msg.remetente === 'USUARIO' ? 'user' : 'model',
            parts: [{ text: msg.conteudo }]
        }));

        const promptComContexto = `[Contexto do Sistema: ${contexto}]\n\nUsuário diz: ${prompt}`;

        const chat = model.startChat({
            history: formattedHistory,
        });

        // 7. Enviar a nova mensagem
        let result = await chat.sendMessage(promptComContexto);
        let response = result.response;
        let functionCalls = response.functionCalls();

        // Loop para lidar com chamadas de função (pode haver múltiplas em sequência)
        while (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            const { name, args } = call;
            let functionResponse;

            console.log(`Chamando função: ${name}`, args);

            try {
                if (name === 'criar_coluna') {
                    if (!quadro) throw new Error("Quadro não encontrado para criar coluna.");
                    const novaColuna = await Coluna.create({ 
                        nome: args.nome, 
                        quadro_id: quadro.id
                    });
                    functionResponse = { id: novaColuna.id, status: 'Coluna criada com sucesso', nome: novaColuna.nome };
                } else if (name === 'criar_tarefa') {
                    const novaTarefa = await Tarefa.create({
                        nome: args.nome,
                        descricao: args.descricao,
                        prioridade: args.prioridade || 'MEDIA',
                        coluna_id: args.coluna_id,
                        projeto_id: projeto_id,
                        responsavel_id: args.responsavel_id || user.id
                    });
                    functionResponse = { id: novaTarefa.id, status: 'Tarefa criada com sucesso', nome: novaTarefa.nome };
                } else {
                    functionResponse = { error: "Função desconhecida" };
                }
            } catch (err) {
                console.error("Erro na execução da função:", err);
                functionResponse = { error: err.message };
            }

            // Enviar o resultado da função de volta para o modelo
            result = await chat.sendMessage([{
                functionResponse: {
                    name: name,
                    response: functionResponse
                }
            }]);
            response = result.response;
            functionCalls = response.functionCalls();
        }

        const iaText = response.text();

        // 8. SALVAR as novas mensagens no banco
        await HistoricoConversaIA.create({
            conteudo: prompt,
            remetente: 'USUARIO',
            projeto_id,
            usuario_id: user.id
        });
        
        await HistoricoConversaIA.create({
            conteudo: iaText,
            remetente: 'IA',
            projeto_id,
            usuario_id: user.id
        });

        // 8. Enviar a resposta
        res.json({ text: iaText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar o chat' });
    }
};