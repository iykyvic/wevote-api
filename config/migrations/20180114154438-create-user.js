import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()')
        },
        firstname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        surname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          isEmail: true,
          unique: true
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }))
      .catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('Users')
      .catch(error => logger.error(error));
  }
};