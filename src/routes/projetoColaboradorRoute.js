import * as projetoColaboradorController from "../controllers/projetoColaboradorController.js"

const projetoColaboradorRoutes = (app) => {
  app.get("/projetos-colaboradores", projetoColaboradorController.get)
  app.get("/projetos-colaboradores/:projeto_id/:usuario_id", projetoColaboradorController.get)
  app.post("/projetos-colaboradores", projetoColaboradorController.persist)
  app.delete("/projetos-colaboradores/:projeto_id/:usuario_id", projetoColaboradorController.destroy)
}

export default projetoColaboradorRoutes
