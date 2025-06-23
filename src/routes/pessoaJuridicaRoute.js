import * as pessoaJuridicaController from '../controllers/pessoaJuridicaController.js';

const pessoaJuridicaRoutes = (app) => {
  app.get('/pessoas-juridicas', pessoaJuridicaController.get);
  app.get('/pessoas-juridicas/:id', pessoaJuridicaController.get);
  app.post('/pessoas-juridicas', pessoaJuridicaController.persist);
  app.put('/pessoas-juridicas/:id', pessoaJuridicaController.persist);
  app.delete('/pessoas-juridicas/:id', pessoaJuridicaController.destroy);
};

export default pessoaJuridicaRoutes;
