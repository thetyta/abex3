import { Comentario, Usuario, Tarefa } from "../models/index.js"

const get = async (req, res) => {
  try {
    const { id } = req.params
    const includes = [
      { model: Usuario, as: "usuario", attributes: ["id", "nome", "email"] },
      { model: Tarefa, as: "tarefa", attributes: ["id", "nome"] },
    ]

    if (id) {
      const comentario = await Comentario.findByPk(id, { include: includes })
      if (!comentario) {
        return res.status(404).json({ error: "Comentário não encontrado" })
      }
      return res.status(200).json(comentario)
    }

    const comentarios = await Comentario.findAll({
      include: [
        { model: Usuario, as: "usuario", attributes: ["id", "nome"] },
        { model: Tarefa, as: "tarefa", attributes: ["id", "nome"] },
      ],
      order: [["created_at", "DESC"]],
    })
    res.status(200).json(comentarios)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (body) => {
  try {
    const comentario = await Comentario.create(body)
    return comentario
  } catch (error) {
    throw new Error(error.message)
  }
}

const update = async (body, id) => {
  try {
    const [updatedRows] = await Comentario.update(body, { where: { id } })
    if (updatedRows === 0) {
      throw new Error("Comentário não encontrado")
    }
    const comentario = await Comentario.findByPk(id)
    return comentario
  } catch (error) {
    throw new Error(error.message)
  }
}

const destroy = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRows = await Comentario.destroy({ where: { id } })
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Comentário não encontrado" })
    }
    res.status(200).json({ message: "Comentário deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const persist = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const comentario = await update(req.body, id)
      res.status(200).json(comentario)
    } else {
      const comentario = await create(req.body)
      res.status(201).json(comentario)
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export { get, create, update, destroy, persist }
