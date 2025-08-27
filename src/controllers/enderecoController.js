import { Endereco, Usuario, Localidade } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const includes = [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
      { model: Localidade, as: 'localidade' }
    ];
    
    if (id) {
      const endereco = await Endereco.findByPk(id, { include: includes });
      if (!endereco) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }
      return res.status(200).json(endereco);
    }
    
    const enderecos = await Endereco.findAll({
      include: includes,
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(enderecos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const endereco = await Endereco.create(body);
    return endereco;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await Endereco.update(body, { where: { id } });
    if (updatedRows === 0) {
      throw new Error('Endereço não encontrado');
    }
    const endereco = await Endereco.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Localidade, as: 'localidade' }
      ]
    });
    return endereco;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Endereco.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }
    res.status(200).json({ message: 'Endereço deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const endereco = await update(req.body, id);
      res.status(200).json(endereco);
    } else {
      const endereco = await create(req.body);
      res.status(201).json(endereco);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
