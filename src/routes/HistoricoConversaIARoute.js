import * as historicoController from '../controllers/historicoConversaIAController.js';

const historicoConversaIARoutes = (app) => {
  app.get('/tarefas/:tarefa_id/historico', historicoController.getHistoricoPorTarefa);
  app.post('/tarefas/:tarefa_id/historico', historicoController.adicionarMensagem);
};

export default historicoConversaIARoutes;
