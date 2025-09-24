import { ProjetoColaborador, Projeto, Usuario } from "../models/index.js"

const get = async (req, res) => {
  try {
    const { projeto_id, usuario_id } = req.params
    const includes = [
      { model: Projeto, as: "projeto", attributes: ["id", "nome"] },
      { model: Usuario, as: "usuario", attributes: ["id", "nome", "email"] },
    ]

    if (projeto_id && usuario_id) {
      const colaborador = await ProjetoColaborador.findOne({
        where: { projeto_id, usuario_id },
        include: includes,
      })
      if (!colaborador) {
        return res.status(404).json({ error: "Colaborador não encontrado no projeto" })
      }
      return res.status(200).json(colaborador)
    }

    const colaboradores = await ProjetoColaborador.findAll({
      include: includes,
      order: [["assigned_at", "DESC"]],
    })
    res.status(200).json(colaboradores)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const create = async (body) => {
  try {
    const colaborador = await ProjetoColaborador.create(body)
    return colaborador
  } catch (error) {
    throw new Error(error.message)
  }
}

const destroy = async (req, res) => {
  try {
    const { projeto_id, usuario_id } = req.params
    const deletedRows = await ProjetoColaborador.destroy({
      where: { projeto_id, usuario_id },
    })
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Colaborador não encontrado no projeto" })
    }
    res.status(200).json({ message: "Colaborador removido do projeto com sucesso" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const persist = async (req, res) => {
  try {
    const colaborador = await create(req.body)
    res.status(201).json(colaborador)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export { get, create, destroy, persist }
