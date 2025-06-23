import { PessoaFisica, Usuario } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      const pessoaFisica = await PessoaFisica.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email', 'login']
        }]
      });
      if (!pessoaFisica) {
        return res.status(404).json({ error: 'Pessoa Física não encontrada' });
      }
      return res.status(200).json(pessoaFisica);
    }
    
    const pessoasFisicas = await PessoaFisica.findAll({
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome', 'email', 'login']
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(pessoasFisicas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const pessoaFisica = await PessoaFisica.create(body);
    return pessoaFisica;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await PessoaFisica.update(body, {
      where: { id }
    });
    
    if (updatedRows === 0) {
      throw new Error('Pessoa Física não encontrada');
    }
    
    const pessoaFisica = await PessoaFisica.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome', 'email', 'login']
      }]
    });
    return pessoaFisica;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await PessoaFisica.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Pessoa Física não encontrada' });
    }
    
    res.status(200).json({ message: 'Pessoa Física deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Update
      const pessoaFisica = await update(req.body, id);
      res.status(200).json(pessoaFisica);
    } else {
      // Create
      const pessoaFisica = await create(req.body);
      res.status(201).json(pessoaFisica);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
