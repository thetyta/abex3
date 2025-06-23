import * as pessoaFisicaController from '../controllers/pessoaFisicaController.js';

const pessoaFisicaRoutes = (app) => {
  app.get('/pessoas-fisicas', pessoaFisicaController.get);
  app.get('/pessoas-fisicas/:id', pessoaFisicaController.get);
  app.post('/pessoas-fisicas', pessoaFisicaController.persist);
  app.put('/pessoas-fisicas/:id', pessoaFisicaController.persist);
  app.delete('/pessoas-fisicas/:id', pessoaFisicaController.destroy);
};

export default pessoaFisicaRoutes;
