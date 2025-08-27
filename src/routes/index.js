import usuarioRoutes from './usuarioRoute.js';
import enderecoRoutes from './enderecoRoute.js';
import pessoaFisicaRoutes from './pessoaFisicaRoute.js';
import pessoaJuridicaRoutes from './pessoaJuridicaRoute.js';
import projetoRoutes from './projetoRoute.js';
import tarefaRoutes from './tarefaRoute.js';
import historicoConversaIARoutes from './HistoricoConversaIARoute.js';
import feedbackIARoutes from './FeedbackIARoute.js';
import localidadeRoutes from './LocalidadeRoute.js';
import checklistItemRoutes from './ChecklistItemRoute.js';
import anexoRoutes from './AnexoRoute.js';

function Routes(app) {
  usuarioRoutes(app);
  enderecoRoutes(app);
  pessoaFisicaRoutes(app);
  pessoaJuridicaRoutes(app);
  projetoRoutes(app);
  tarefaRoutes(app);
  localidadeRoutes(app);
  checklistItemRoutes(app);
  anexoRoutes(app);
  historicoConversaIARoutes(app);
  feedbackIARoutes(app);
}

export default Routes;
