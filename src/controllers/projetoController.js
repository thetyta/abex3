import { Projeto, Usuario } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const includes = [
      { model: Usuario, as: 'responsavel', attributes: ['id', 'nome', 'email'] },
      { 
        model: Usuario, 
        as: 'colaboradores', 
        attributes: ['id', 'nome', 'email'],
        through: { attributes: [] }
      }
    ];

    if (id) {
      const projeto = await Projeto.findByPk(id, { include: includes });
      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }
      return res.status(200).json(projeto);
    }
    
    const projetos = await Projeto.findAll({
      include: includes,
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(projetos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const projeto = await Projeto.create(body);
    return projeto;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await Projeto.update(body, { where: { id } });
    if (updatedRows === 0) {
      throw new Error('Projeto não encontrado');
    }
    const projeto = await Projeto.findByPk(id);
    return projeto;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Projeto.destroy({ where: { id } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    res.status(200).json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const projeto = await update(req.body, id);
      res.status(200).json(projeto);
    } else {
      // Criar projeto
      const projeto = await create(req.body);
      
      // Criar quadro automaticamente para o projeto
      const { Quadro } = await import('../models/index.js');
      await Quadro.create({
        nome: 'Quadro Principal',
        projeto_id: projeto.id
      });
      
      res.status(201).json(projeto);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Adicionar colaboradores a um projeto
const addColaboradores = async (req, res) => {
  try {
    const { id } = req.params; // projeto_id
    const { colaboradores } = req.body; // array de usuario_ids: [1, 2, 3]
    
    if (!Array.isArray(colaboradores)) {
      return res.status(400).json({ error: 'colaboradores deve ser um array de IDs' });
    }

    const projeto = await Projeto.findByPk(id);
    if (!projeto) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    // Importar ProjetoColaborador
    const { ProjetoColaborador } = await import('../models/index.js');
    
    // Adicionar cada colaborador (ignora duplicados com upsert ou trycatch)
    const results = [];
    for (const usuario_id of colaboradores) {
      try {
        const [, created] = await ProjetoColaborador.findOrCreate({
          where: { projeto_id: id, usuario_id },
          defaults: { projeto_id: id, usuario_id }
        });
        results.push({ usuario_id, added: created });
      } catch (err) {
        results.push({ usuario_id, added: false, error: err.message });
      }
    }

    // Retornar projeto atualizado com colaboradores
    const projetoAtualizado = await Projeto.findByPk(id, {
      include: [
        { model: Usuario, as: 'responsavel', attributes: ['id', 'nome', 'email'] },
        { 
          model: Usuario, 
          as: 'colaboradores', 
          attributes: ['id', 'nome', 'email'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(200).json({ projeto: projetoAtualizado, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist, addColaboradores };
