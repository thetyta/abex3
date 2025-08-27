import * as anexoController from '../controllers/anexoController.js';

const anexoRoutes = (app) => {
  app.get('/anexos', anexoController.get);
  app.get('/anexos/:id', anexoController.get);
  app.post('/anexos', anexoController.persist);
  app.put('/anexos/:id', anexoController.persist);
  app.delete('/anexos/:id', anexoController.destroy);
};

export default anexoRoutes;
