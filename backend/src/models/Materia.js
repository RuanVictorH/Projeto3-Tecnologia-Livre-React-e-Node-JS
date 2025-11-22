// backend/src/models/Materia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Materia = sequelize.define('Materia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomenclatura: { // Sigla (Ex: MAT001)
    type: DataTypes.STRING,
    allowNull: true,
  },
  notas_materia: { // Anotações gerais
    type: DataTypes.TEXT,
    allowNull: true,
  },
  link_plano_ensino: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Relacionamento: Uma Matéria pertence a um Usuário
Materia.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Materia, { foreignKey: 'userId' });

module.exports = Materia;