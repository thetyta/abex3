import * as historicoController from '../controllers/historicoConversaIAController.js';

const historicoConversaIARoutes = (app) => {
  app.get('/projetos/:projeto_id/historico', historicoController.getHistoricoPorProjeto);
  app.post('/projetos/:projeto_id/historico', historicoController.adicionarMensagem);
};

export default historicoConversaIARoutes;
