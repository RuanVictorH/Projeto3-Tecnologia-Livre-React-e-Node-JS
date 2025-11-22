// src/config/database.js
const Sequelize = require('sequelize');

// Cria a conexão. O arquivo 'database.sqlite' será criado na pasta backend.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false, // Define como true se quiser ver os SQLs no terminal
});

module.exports = sequelize;