import * as quadroController from "../controllers/quadroController.js"

const quadroRoutes = (app) => {
  app.get("/quadros", quadroController.get)
  app.get("/quadros/:id", quadroController.get)
  app.post("/quadros", quadroController.persist)
  app.put("/quadros/:id", quadroController.persist)
  app.delete("/quadros/:id", quadroController.destroy)
}

export default quadroRoutes
