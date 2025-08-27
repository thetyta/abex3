import * as checklistItemController from '../controllers/checklistItemController.js';

const checklistItemRoutes = (app) => {
  app.get('/checklist-itens', checklistItemController.get);
  app.get('/checklist-itens/:id', checklistItemController.get);
  app.post('/checklist-itens', checklistItemController.persist);
  app.put('/checklist-itens/:id', checklistItemController.persist);
  app.delete('/checklist-itens/:id', checklistItemController.destroy);
};

export default checklistItemRoutes;
