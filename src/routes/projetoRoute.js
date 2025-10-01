import * as projetoController from '../controllers/projetoController.js';

const projetoRoutes = (app) => {
  app.get('/projetos', projetoController.get);
  app.get('/projetos/:id', projetoController.get);
  app.post('/projetos', projetoController.persist);
  app.put('/projetos/:id', projetoController.persist);
  app.delete('/projetos/:id', projetoController.destroy);
  app.post('/projetos/:id/colaboradores', projetoController.addColaboradores);
};

export default projetoRoutes;
