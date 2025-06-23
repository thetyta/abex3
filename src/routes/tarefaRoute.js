import * as tarefaController from '../controllers/tarefaController.js';

const tarefaRoutes = (app) => {
  app.get('/tarefas', tarefaController.get);
  app.get('/tarefas/:id', tarefaController.get);
  app.post('/tarefas', tarefaController.persist);
  app.put('/tarefas/:id', tarefaController.persist);
  app.delete('/tarefas/:id', tarefaController.destroy);
};

export default tarefaRoutes;
