const express = require('express');

const { db, DataTypes } = require('../utils/dataBase');
const { Consoles } = require('./consoles.model');
const { Games } = require('./games.model');

const GameInConsole = db.define('GameInConsole', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Games,
      key: 'id'
    }
  },
  consoleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Consoles,
      key: 'id'
    }
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
});

module.exports = { GameInConsole };
