import { HistoricoConversaIA, Tarefa, FeedbackIA } from '../models/index.js';

const getHistoricoPorTarefa = async (req, res) => {
  try {
    const { tarefa_id } = req.params;

    const tarefa = await Tarefa.findByPk(tarefa_id);
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const historico = await HistoricoConversaIA.findAll({
      where: { tarefa_id },
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
    const { tarefa_id } = req.params;
    const { conteudo, remetente } = req.body;

    if (!conteudo || !remetente) {
      return res.status(400).json({ error: 'Os campos "conteudo" e "remetente" são obrigatórios.' });
    }
    if (!['USUARIO', 'IA'].includes(remetente)) {
      return res.status(400).json({ error: 'O campo "remetente" deve ser "USUARIO" ou "IA".' });
    }

    const tarefa = await Tarefa.findByPk(tarefa_id);
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const novaMensagem = await HistoricoConversaIA.create({
      conteudo,
      remetente,
      tarefa_id
    });

    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getHistoricoPorTarefa, adicionarMensagem };
