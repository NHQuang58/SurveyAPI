const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const sequelizeDB = require('./config/configDB');

let server;

// const sequelize = new Sequelize(config.sql.url);
const sequelize = sequelizeDB;
sequelize
  .authenticate()
  .then(() => {
    logger.info('Connect DB success!!!');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch(() => logger.error('Connect DB fail'));

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
