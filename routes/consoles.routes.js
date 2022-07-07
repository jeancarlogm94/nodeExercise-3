const express = require('express');

//controllers
const {
  createConsole,
  getAllConsoles,
  updateNameConsoles,
  deleteConsoles,
  assignGameToConsole,
} = require('../controllers/consoles.controller');

//middlewares
const { consoleExist } = require('../middleware/consoleExist.middleware');
const { protectSession } = require('../middleware/auth.middleware');

const consolesRouter = express.Router();

consolesRouter.get('/', getAllConsoles);

consolesRouter.use(protectSession);

consolesRouter.post('/', createConsole);

consolesRouter.post('/assign-console', assignGameToConsole);

consolesRouter
  .use('/:id', consoleExist)
  .route('/:id')
  .patch(updateNameConsoles)
  .delete(deleteConsoles);

consolesRouter
  .use('/:id', consoleExist)
  .route('/:id')
  .patch(updateNameConsoles)
  .delete(deleteConsoles);

module.exports = { consolesRouter };
