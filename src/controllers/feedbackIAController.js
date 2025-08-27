import { FeedbackIA, HistoricoConversaIA } from '../models/index.js';

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackIA.findAll({
      include: [{
        model: HistoricoConversaIA,
        as: 'mensagem',
        attributes: ['id', 'conteudo']
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { mensagem_id } = req.params;
    const { avaliacao, comentario } = req.body;

    const mensagem = await HistoricoConversaIA.findByPk(mensagem_id);
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem da IA não encontrada.' });
    }
    if (mensagem.remetente !== 'IA') {
      return res.status(400).json({ error: 'O feedback só pode ser dado para mensagens da IA.' });
    }

    const feedback = await FeedbackIA.create({
      avaliacao,
      comentario,
      mensagem_id
    });

    res.status(201).json(feedback);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Esta mensagem já possui um feedback.' });
    }
    res.status(400).json({ error: error.message });
  }
};

export { createFeedback, getFeedbacks };
