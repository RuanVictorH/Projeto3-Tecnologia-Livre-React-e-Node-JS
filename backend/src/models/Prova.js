// backend/src/models/Prova.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Materia = require('./Materia');

const Prova = sequelize.define('Prova', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_prova: {
    type: DataTypes.DATEONLY, // Apenas a data (YYYY-MM-DD) é suficiente para provas
    allowNull: false,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  link_anexos: { // Link para drive/material
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// Relacionamento: Prova pertence a uma Matéria
Prova.belongsTo(Materia, { foreignKey: 'materiaId', as: 'materia', onDelete: 'CASCADE' });
Materia.hasMany(Prova, { foreignKey: 'materiaId' });

module.exports = Prova;