import { PessoaJuridica, Usuario } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      const pessoaJuridica = await PessoaJuridica.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email', 'login']
        }]
      });
      if (!pessoaJuridica) {
        return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
      }
      return res.status(200).json(pessoaJuridica);
    }
    
    const pessoasJuridicas = await PessoaJuridica.findAll({
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome', 'email', 'login']
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(pessoasJuridicas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const pessoaJuridica = await PessoaJuridica.create(body);
    return pessoaJuridica;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await PessoaJuridica.update(body, {
      where: { id }
    });
    
    if (updatedRows === 0) {
      throw new Error('Pessoa Jurídica não encontrada');
    }
    
    const pessoaJuridica = await PessoaJuridica.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome', 'email', 'login']
      }]
    });
    return pessoaJuridica;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await PessoaJuridica.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Pessoa Jurídica não encontrada' });
    }
    
    res.status(200).json({ message: 'Pessoa Jurídica deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Update
      const pessoaJuridica = await update(req.body, id);
      res.status(200).json(pessoaJuridica);
    } else {
      // Create
      const pessoaJuridica = await create(req.body);
      res.status(201).json(pessoaJuridica);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
