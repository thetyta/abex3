import { HistoricoConversaIA, Projeto, FeedbackIA } from '../models/index.js';

const getHistoricoPorProjeto = async (req, res) => {
  try {
    const { projeto_id } = req.params;

    const projeto = await Projeto.findByPk(projeto_id);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    const historico = await HistoricoConversaIA.findAll({
      where: { projeto_id },
      include: [{
        model: FeedbackIA,
        as: 'feedback',
        required: false
      }],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json(historico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const adicionarMensagem = async (req, res) => {
  try {
    const { projeto_id } = req.params;
    const { conteudo, remetente } = req.body;

    if (!conteudo || !remetente) {
      return res.status(400).json({ error: 'Os campos "conteudo" e "remetente" são obrigatórios.' });
    }
    if (!['USUARIO', 'IA'].includes(remetente)) {
      return res.status(400).json({ error: 'O campo "remetente" deve ser "USUARIO" ou "IA".' });
    }

    const projeto = await Projeto.findByPk(projeto_id);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    const novaMensagem = await HistoricoConversaIA.create({
      conteudo,
      remetente,
      projeto_id
    });

    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getHistoricoPorProjeto, adicionarMensagem };
