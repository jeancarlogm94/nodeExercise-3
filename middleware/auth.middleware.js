const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//models
const { Users } = require('../models/users.model');
//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return next(new AppError('Invalid session', 403));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await Users.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(new AppError('This user are not active', 403));
  }

  req.sessionUser = user;
  next();
});

const verifyUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
};

module.exports = { protectSession, verifyUserAccount };
