// routes/geminiRoutes.js
import * as geminiController from '../controllers/geminiController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const geminiRoutes = (app) => {
  // Define a rota que o frontend vai chamar
  app.post('/gemini/generate', authMiddleware, geminiController.generate);
  
  // Você pode adicionar mais rotas aqui se precisar (ex: chat)
};

export default geminiRoutes;