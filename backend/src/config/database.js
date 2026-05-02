'use strict';

const { Sequelize } = require('sequelize');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno. La aplicación no puede iniciar.');
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || '',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
    define: {
      underscored:     true,
      freezeTableName: false,
      charset:         'utf8mb4',
      collate:         'utf8mb4_unicode_ci',
    },
    dialectOptions: {
      charset: 'utf8mb4',
    },
  }
);

module.exports = sequelize;