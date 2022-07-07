const express = require('express');

//controllers
const {
  createGame,
  getAllGames,
  updateGame,
  deleteGame,
  reviewGame,
} = require('../controllers/games.controller');

//middleware
const { protectSession } = require('../middleware/auth.middleware');
const { gameExist } = require('../middleware/gameExist.middleware');

const gamesRouter = express.Router();

gamesRouter.get('/', getAllGames);

gamesRouter.use(protectSession);

gamesRouter.post('/', createGame);

gamesRouter.post('/reviews/:gameId', gameExist, reviewGame);

gamesRouter
  .use('/:id', gameExist)
  .route('/:id')
  .patch(updateGame)
  .delete(deleteGame);

module.exports = { gamesRouter };
