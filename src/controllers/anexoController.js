import { Anexo, Tarefa } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const includeTarefa = { model: Tarefa, as: 'tarefa', attributes: ['id', 'nome'] };

    if (id) {
      const anexo = await Anexo.findByPk(id, { include: [includeTarefa] });
      if (!anexo) {
        return res.status(404).json({ error: 'Anexo não encontrado' });
      }
      return res.status(200).json(anexo);
    }
    const anexos = await Anexo.findAll({ include: [includeTarefa], order: [['uploaded_at', 'DESC']] });
    res.status(200).json(anexos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const anexo = await Anexo.create(body);
    return anexo;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await Anexo.update(body, { where: { id } });
    if (updatedRows === 0) {
      throw new Error('Anexo não encontrado');
    }
    const anexo = await Anexo.findByPk(id);
    return anexo;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Anexo.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Anexo não encontrado' });
    }
    res.status(200).json({ message: 'Anexo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const anexo = await update(req.body, id);
      res.status(200).json(anexo);
    } else {
      const anexo = await create(req.body);
      res.status(201).json(anexo);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
