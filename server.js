const { app } = require('./app');

const { db } = require('./utils/dataBase');

const { Users } = require('./models/users.model');
const { Reviews } = require('./models/reviews.model');
const { Games } = require('./models/games.model');
const { Consoles } = require('./models/consoles.model');
const { GameInConsole } = require('./models/gamesInConsoles.model');

db.authenticate()
  .then(() => console.log('DB authenticated'))
  .catch((err) => console.log(err));

//DB Relations
//Users 1 --- m Reviews
Users.hasMany(Reviews, { foreignKey: 'userId' });
Reviews.belongsTo(Users);

//Games 1 --- m Reviews
Games.hasMany(Reviews, { foreignKey: 'gameId' });
Reviews.belongsTo(Games);

//Games m --- m Consoles
Games.belongsToMany(Consoles, { through: 'GameInConsole' });
Consoles.belongsToMany(Games, { through: 'GameInConsole' });

db.sync()
  .then(() => console.log('DB synced'))
  .catch((err) => console.log(err));

app.listen(4000, () => {
  console.log('server On!');
});
