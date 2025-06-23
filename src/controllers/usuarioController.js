import { Usuario } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.status(200).json(usuario);
    }
    
    const usuarios = await Usuario.findAll({
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const usuario = await Usuario.create(body);
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await Usuario.update(body, {
      where: { id }
    });
    
    if (updatedRows === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    const usuario = await Usuario.findByPk(id);
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Usuario.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Update
      const usuario = await update(req.body, id);
      res.status(200).json(usuario);
    } else {
      // Create
      const usuario = await create(req.body);
      res.status(201).json(usuario);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
