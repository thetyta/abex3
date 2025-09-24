import * as colunaController from "../controllers/colunaController.js"

const colunaRoutes = (app) => {
  app.get("/colunas", colunaController.get)
  app.get("/colunas/:id", colunaController.get)
  app.post("/colunas", colunaController.persist)
  app.put("/colunas/:id", colunaController.persist)
  app.delete("/colunas/:id", colunaController.destroy)
}

export default colunaRoutes
