import { Coluna, Quadro, Tarefa } from "../models/index.js"

const get = async (req, res) => {
  try {
    const { id } = req.params
    const { quadro_id } = req.query
    const includes = [
      { model: Quadro, as: "quadro", attributes: ["id", "nome"] },
      { model: Tarefa, as: "tarefas", attributes: ["id", "nome", "status", "posicao"] },
    ]

    if (id) {
      const coluna = await Coluna.findByPk(id, { include: includes })
      if (!coluna) {
        return res.status(404).json({ error: "Coluna não encontrada" })
      }
      return res.status(200).json(coluna)
    }

    // allow filtering by quadro_id to avoid returning all columns if not necessary
    const where = {}
    if (quadro_id) where.quadro_id = quadro_id

    const colunas = await Coluna.findAll({
      where,
      include: [{ model: Quadro, as: "quadro", attributes: ["id", "nome"] }],
      order: [["ordem", "ASC"]],
    })
    res.status(200).json(colunas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (body) => {
  try {
    const coluna = await Coluna.create(body)
    return coluna
  } catch (error) {
    throw new Error(error.message)
  }
}

const update = async (body, id) => {
  try {
    const [updatedRows] = await Coluna.update(body, { where: { id } })
    if (updatedRows === 0) {
      throw new Error("Coluna não encontrada")
    }
    const coluna = await Coluna.findByPk(id)
    return coluna
  } catch (error) {
    throw new Error(error.message)
  }
}

const destroy = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRows = await Coluna.destroy({ where: { id } })
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Coluna não encontrada" })
    }
    res.status(200).json({ message: "Coluna deletada com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const persist = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const coluna = await update(req.body, id)
      res.status(200).json(coluna)
    } else {
      const coluna = await create(req.body)
      res.status(201).json(coluna)
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export { get, create, update, destroy, persist }
