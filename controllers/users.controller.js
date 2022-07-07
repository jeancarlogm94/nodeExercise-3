const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//models
const { Users } = require('../models/users.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Reviews } = require('../models/reviews.model');

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await Users.create({
    name: username,
    email,
    password: hashPassword,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email, status: 'active' } });

  if (!user) {
    return next(new AppError('Credentials are not valid', 400));
  }

  const isAValidPassword = await bcrypt.compare(password, user.password);

  if (!isAValidPassword) {
    return next(new AppError('Credentials are not valid', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  await user.update({ name: username, email });

  res.status(201).json({
    status: 'success',
  });
});

const deleteUser = async (req, res, next) => {
  const { user } = req;
  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
    message: 'the user was deleted',
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await Users.findAll({
    attributes: ['id', 'name', 'email', 'status'],
    where: { status: 'active' },
    include: [{model: Reviews, attributes: ['id', 'comment']}]
  });

  res.status(200).json({
    status: 'success',
    users,
  });
};

module.exports = { getAllUsers, createUser, login, updateUser, deleteUser };
