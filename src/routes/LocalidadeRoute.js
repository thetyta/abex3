import * as localidadeController from '../controllers/localidadeController.js';

const localidadeRoutes = (app) => {
  app.get('/localidades', localidadeController.get);
  app.get('/localidades/:cep', localidadeController.get);
  app.post('/localidades', localidadeController.persist);
  app.put('/localidades/:cep', localidadeController.persist);
  app.delete('/localidades/:cep', localidadeController.destroy);
};

export default localidadeRoutes;
