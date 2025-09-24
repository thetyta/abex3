import { TarefaEtiqueta, Tarefa, Etiqueta } from "../models/index.js"

const get = async (req, res) => {
  try {
    const { tarefa_id, etiqueta_id } = req.params
    const includes = [
      { model: Tarefa, as: "tarefa", attributes: ["id", "nome"] },
      { model: Etiqueta, as: "etiqueta", attributes: ["id", "nome", "cor"] },
    ]

    if (tarefa_id && etiqueta_id) {
      const tarefaEtiqueta = await TarefaEtiqueta.findOne({
        where: { tarefa_id, etiqueta_id },
        include: includes,
      })
      if (!tarefaEtiqueta) {
        return res.status(404).json({ error: "Etiqueta não encontrada na tarefa" })
      }
      return res.status(200).json(tarefaEtiqueta)
    }

    const tarefasEtiquetas = await TarefaEtiqueta.findAll({
      include: includes,
    })
    res.status(200).json(tarefasEtiquetas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (body) => {
  try {
    const tarefaEtiqueta = await TarefaEtiqueta.create(body)
    return tarefaEtiqueta
  } catch (error) {
    throw new Error(error.message)
  }
}

const destroy = async (req, res) => {
  try {
    const { tarefa_id, etiqueta_id } = req.params
    const deletedRows = await TarefaEtiqueta.destroy({
      where: { tarefa_id, etiqueta_id },
    })
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Etiqueta não encontrada na tarefa" })
    }
    res.status(200).json({ message: "Etiqueta removida da tarefa com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const persist = async (req, res) => {
  try {
    const tarefaEtiqueta = await create(req.body)
    res.status(201).json(tarefaEtiqueta)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export { get, create, destroy, persist }
