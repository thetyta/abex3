import { ChecklistItem, Tarefa } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const includeTarefa = { model: Tarefa, as: 'tarefa', attributes: ['id', 'nome'] };

    if (id) {
      const item = await ChecklistItem.findByPk(id, { include: [includeTarefa] });
      if (!item) {
        return res.status(404).json({ error: 'Item de checklist não encontrado' });
      }
      return res.status(200).json(item);
    }
    const itens = await ChecklistItem.findAll({ include: [includeTarefa], order: [['id', 'ASC']] });
    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const item = await ChecklistItem.create(body);
    return item;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await ChecklistItem.update(body, { where: { id } });
    if (updatedRows === 0) {
      throw new Error('Item de checklist não encontrado');
    }
    const item = await ChecklistItem.findByPk(id);
    return item;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await ChecklistItem.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Item de checklist não encontrado' });
    }
    res.status(200).json({ message: 'Item de checklist deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const item = await update(req.body, id);
      res.status(200).json(item);
    } else {
      const item = await create(req.body);
      res.status(201).json(item);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
