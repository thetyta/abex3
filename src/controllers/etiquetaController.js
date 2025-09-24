import { Etiqueta, Projeto } from "../models/index.js"

const get = async (req, res) => {
  try {
    const { id } = req.params
    const includes = [{ model: Projeto, as: "projeto", attributes: ["id", "nome"] }]

    if (id) {
      const etiqueta = await Etiqueta.findByPk(id, { include: includes })
      if (!etiqueta) {
        return res.status(404).json({ error: "Etiqueta não encontrada" })
      }
      return res.status(200).json(etiqueta)
    }

    const etiquetas = await Etiqueta.findAll({
      include: [{ model: Projeto, as: "projeto", attributes: ["id", "nome"] }],
      order: [["nome", "ASC"]],
    })
    res.status(200).json(etiquetas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (body) => {
  try {
    const etiqueta = await Etiqueta.create(body)
    return etiqueta
  } catch (error) {
    throw new Error(error.message)
  }
}

const update = async (body, id) => {
  try {
    const [updatedRows] = await Etiqueta.update(body, { where: { id } })
    if (updatedRows === 0) {
      throw new Error("Etiqueta não encontrada")
    }
    const etiqueta = await Etiqueta.findByPk(id)
    return etiqueta
  } catch (error) {
    throw new Error(error.message)
  }
}

const destroy = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRows = await Etiqueta.destroy({ where: { id } })
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Etiqueta não encontrada" })
    }
    res.status(200).json({ message: "Etiqueta deletada com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const persist = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const etiqueta = await update(req.body, id)
      res.status(200).json(etiqueta)
    } else {
      const etiqueta = await create(req.body)
      res.status(201).json(etiqueta)
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export { get, create, update, destroy, persist }
