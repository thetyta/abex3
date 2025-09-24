import { Quadro, Projeto, Coluna } from "../models/index.js"

const get = async (req, res) => {
  try {
    const { id } = req.params
    const includes = [
      { model: Projeto, as: "projeto", attributes: ["id", "nome"] },
      { model: Coluna, as: "colunas", attributes: ["id", "nome", "ordem"] },
    ]

    if (id) {
      const quadro = await Quadro.findByPk(id, { include: includes })
      if (!quadro) {
        return res.status(404).json({ error: "Quadro não encontrado" })
      }
      return res.status(200).json(quadro)
    }

    const quadros = await Quadro.findAll({
      include: [{ model: Projeto, as: "projeto", attributes: ["id", "nome"] }],
      order: [["created_at", "DESC"]],
    })
    res.status(200).json(quadros)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (body) => {
  try {
    const quadro = await Quadro.create(body)
    return quadro
  } catch (error) {
    throw new Error(error.message)
  }
}

const update = async (body, id) => {
  try {
    const [updatedRows] = await Quadro.update(body, { where: { id } })
    if (updatedRows === 0) {
      throw new Error("Quadro não encontrado")
    }
    const quadro = await Quadro.findByPk(id)
    return quadro
  } catch (error) {
    throw new Error(error.message)
  }
}

const destroy = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRows = await Quadro.destroy({ where: { id } })
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Quadro não encontrado" })
    }
    res.status(200).json({ message: "Quadro deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const persist = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const quadro = await update(req.body, id)
      res.status(200).json(quadro)
    } else {
      const quadro = await create(req.body)
      res.status(201).json(quadro)
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export { get, create, update, destroy, persist }
