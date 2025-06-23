import usuarioRoutes from './usuarioRoute.js';
import enderecoRoutes from './enderecoRoute.js';
import pessoaFisicaRoutes from './pessoaFisicaRoute.js';
import pessoaJuridicaRoutes from './pessoaJuridicaRoute.js';
import projetoRoutes from './projetoRoute.js';
import tarefaRoutes from './tarefaRoute.js';

function Routes(app){
    usuarioRoutes(app);
    enderecoRoutes(app);
    pessoaFisicaRoutes(app);
    pessoaJuridicaRoutes(app);
    projetoRoutes(app);
    tarefaRoutes(app);
}

export default Routes;