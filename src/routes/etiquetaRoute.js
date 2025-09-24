import * as etiquetaController from "../controllers/etiquetaController.js"

const etiquetaRoutes = (app) => {
  app.get("/etiquetas", etiquetaController.get)
  app.get("/etiquetas/:id", etiquetaController.get)
  app.post("/etiquetas", etiquetaController.persist)
  app.put("/etiquetas/:id", etiquetaController.persist)
  app.delete("/etiquetas/:id", etiquetaController.destroy)
}

export default etiquetaRoutes
