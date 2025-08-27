import * as feedbackController from '../controllers/feedbackIAController.js';

const feedbackIARoutes = (app) => {
  app.post('/historico-ia/:mensagem_id/feedback', feedbackController.createFeedback);
  app.get('/feedbacks', feedbackController.getFeedbacks);
};

export default feedbackIARoutes;
