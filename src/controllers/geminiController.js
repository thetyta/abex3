// controllers/geminiController.js
import { GoogleGenerativeAI } from '@google/generative-ai';
// 1. Importe seu model de histórico
import HistoricoConversaIA from '../models/HistoricoConversaIAModel.js'; 

// ... (configuração do genAI e model) ...
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash-lite-preview' });

/**
 * Processa um prompt e retorna a resposta do Gemini,
 * mantendo o histórico da conversa.
 */
export const generate = async (req, res) => {
    // 2. Agora você precisa receber o prompt E o ID da tarefa/conversa
    const { prompt, projeto_id } = req.body;

    if (!prompt || !projeto_id) {
        return res.status(400).json({ error: 'Prompt e projeto_id são obrigatórios' });
    }

    try {
        // 3. Carregar o histórico ANTERIOR do banco de dados
        const dbHistory = await HistoricoConversaIA.findAll({
            where: { projeto_id },
            order: [['created_at', 'ASC']] // Garante a ordem correta
        });

        // 4. Formatar o histórico para o formato do Gemini
        // O Gemini espera { role: 'user' | 'model', parts: [{ text: '...' }] }
        const formattedHistory = dbHistory.map(msg => ({
            role: msg.remetente === 'USUARIO' ? 'user' : 'model',
            parts: [{ text: msg.conteudo }]
        }));

        // 5. Iniciar o chat com o histórico carregado
        const chat = model.startChat({
            history: formattedHistory,
            // (Opcional) Você pode adicionar regras de segurança aqui
        });

        // 6. Enviar a nova mensagem do usuário
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const iaText = response.text();

        // 7. SALVAR as novas mensagens no banco! (MUITO IMPORTANTE)
        
        // Salva a mensagem do usuário
        await HistoricoConversaIA.create({
            conteudo: prompt,
            remetente: 'USUARIO',
            projeto_id
        });
        
        // Salva a resposta da IA
        await HistoricoConversaIA.create({
            conteudo: iaText,
            remetente: 'IA',
            projeto_id
        });

        // 8. Enviar a resposta da IA para o frontend
        res.json({ text: iaText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar o chat' });
    }
};