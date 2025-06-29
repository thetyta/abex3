import { Tarefa, Usuario, Projeto } from '../models/index.js';

const get = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      const tarefa = await Tarefa.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'responsavel',
            attributes: ['id', 'nome', 'email', 'login']
          },
          {
            model: Projeto,
            as: 'projeto',
            attributes: ['id', 'nome', 'tipo']
          }
        ]
      });
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      return res.status(200).json(tarefa);
    }
    
    const tarefas = await Tarefa.findAll({
      include: [
        {
          model: Usuario,
          as: 'responsavel',
          attributes: ['id', 'nome', 'email', 'login']
        },
        {
          model: Projeto,
          as: 'projeto',
          attributes: ['id', 'nome', 'tipo']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    const tarefa = await Tarefa.create(body);
    return tarefa;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const [updatedRows] = await Tarefa.update(body, {
      where: { id }
    });
    
    if (updatedRows === 0) {
      throw new Error('Tarefa não encontrada');
    }
    
    const tarefa = await Tarefa.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'responsavel',
          attributes: ['id', 'nome', 'email', 'login']
        },
        {
          model: Projeto,
          as: 'projeto',
          attributes: ['id', 'nome', 'tipo']
        }
      ]
    });
    return tarefa;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Tarefa.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.status(200).json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Update
      const tarefa = await update(req.body, id);
      res.status(200).json(tarefa);
    } else {
      // Create
      const tarefa = await create(req.body);
      res.status(201).json(tarefa);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist };
