import * as enderecoController from '../controllers/enderecoController.js';

const enderecoRoutes = (app) => {
  app.get('/enderecos', enderecoController.get);
  app.get('/enderecos/:id', enderecoController.get);
  app.post('/enderecos', enderecoController.persist);
  app.put('/enderecos/:id', enderecoController.persist);
  app.delete('/enderecos/:id', enderecoController.destroy);
};

export default enderecoRoutes;
