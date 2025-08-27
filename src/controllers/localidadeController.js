import { Localidade } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { cep } = req.params;
    if (cep) {
      const localidade = await Localidade.findByPk(cep);
      if (!localidade) {
        return res.status(404).json({ error: 'Localidade não encontrada' });
      }
      return res.status(200).json(localidade);
    }
    const localidades = await Localidade.findAll({ order: [['cep', 'ASC']] });
    res.status(200).json(localidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const localidade = await Localidade.create(body);
    return localidade;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, cep) => {
  try {
    const [updatedRows] = await Localidade.update(body, { where: { cep } });
    if (updatedRows === 0) {
      throw new Error('Localidade não encontrada');
    }
    const localidade = await Localidade.findByPk(cep);
    return localidade;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { cep } = req.params;
    const deletedRows = await Localidade.destroy({ where: { cep } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Localidade não encontrada' });
    }
    res.status(200).json({ message: 'Localidade deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { cep } = req.params;
    if (cep) {
      const localidade = await update(req.body, cep);
      res.status(200).json(localidade);
    } else {
      const localidade = await create(req.body);
      res.status(201).json(localidade);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
