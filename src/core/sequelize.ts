import { Sequelize } from 'sequelize-typescript';

function init(): Sequelize {
  return new Sequelize({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    models: [__dirname + '/models'],
    logging: false
  });
}

let sequelizeInstance: Sequelize;

export const sequelize = {
  instance() {
    if (!sequelizeInstance) {
      sequelizeInstance = init();
      sequelizeInstance.sync();
      sequelizeInstance.authenticate();
    }
    return sequelizeInstance;
  }
};

