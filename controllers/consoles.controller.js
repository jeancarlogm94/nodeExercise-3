//model
const { Consoles } = require('../models/consoles.model');
const { Games } = require('../models/games.model');
const { GameInConsole } = require('../models/gamesInConsoles.model');

//utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const createConsole = catchAsync(async (req, res, next) => {
  const { name, company } = req.body;

  const newConsole = await Consoles.create({
    name,
    company,
  });

  res.status(201).json({
    status: 'success',
    newConsole,
  });
});

const getAllConsoles = catchAsync(async (req, res, next) => {
  const data = await Consoles.findAll({
    attributes: ['id', 'name', 'company', 'status'],
    include: [{ model: Games, attributes: ['title', 'genre', 'status'] }],
    where: { status: 'active' },
  });

  res.status(200).json({
    status: 'succes',
    data,
  });
});

const updateNameConsoles = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { console } = req;

  await console.update({ name });

  res.status(204).json({});
});

const deleteConsoles = catchAsync(async (req, res, next) => {
  const { console } = req;

  await console.update({ status: 'delete' });

  res.status(204).json({});
});

const assignGameToConsole = catchAsync(async (req, res, next) => {
  const { gameId, consoleId } = req.body;
  const newAssign = await GameInConsole.create({
    gameId,
    consoleId,
  });

  res.status(200).json({
    status: 'success',
    newAssign,
  });
});

module.exports = {
  createConsole,
  getAllConsoles,
  updateNameConsoles,
  deleteConsoles,
  assignGameToConsole,
};
