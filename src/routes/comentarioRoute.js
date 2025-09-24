import * as comentarioController from "../controllers/comentarioController.js"

const comentarioRoutes = (app) => {
  app.get("/comentarios", comentarioController.get)
  app.get("/comentarios/:id", comentarioController.get)
  app.post("/comentarios", comentarioController.persist)
  app.put("/comentarios/:id", comentarioController.persist)
  app.delete("/comentarios/:id", comentarioController.destroy)
}

export default comentarioRoutes
