import * as usuarioController from '../controllers/usuarioController.js';

const usuarioRoutes = (app) => {
  app.get('/usuarios', usuarioController.get);
  app.get('/usuarios/:id', usuarioController.get);
  app.post('/usuarios', usuarioController.persist);
  app.put('/usuarios/:id', usuarioController.persist);
  app.delete('/usuarios/:id', usuarioController.destroy);
  app.post('/usuarios/login', usuarioController.login);
};

export default usuarioRoutes;
