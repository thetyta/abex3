import * as tarefaEtiquetaController from "../controllers/tarefaEtiquetaController.js"

const tarefaEtiquetaRoutes = (app) => {
  app.get("/tarefas-etiquetas", tarefaEtiquetaController.get)
  app.get("/tarefas-etiquetas/:tarefa_id/:etiqueta_id", tarefaEtiquetaController.get)
  app.post("/tarefas-etiquetas", tarefaEtiquetaController.persist)
  app.delete("/tarefas-etiquetas/:tarefa_id/:etiqueta_id", tarefaEtiquetaController.destroy)
}

export default tarefaEtiquetaRoutes
