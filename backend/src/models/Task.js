// backend/src/models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Materia = require('./Materia');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // data_inicio REMOVIDA
  data_fim: {
    type: DataTypes.DATE, // Guarda Data e Hora do Prazo
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('A', 'E', 'C'),
    defaultValue: 'A',
  },
  prioridade: {
    type: DataTypes.ENUM('B', 'M', 'A'),
    defaultValue: 'M',
  },
  link_anexo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// Relacionamento com Alias 'materia' (Minúsculo)
Task.belongsTo(Materia, { foreignKey: 'materiaId', as: 'materia', onDelete: 'CASCADE' });
Materia.hasMany(Task, { foreignKey: 'materiaId' });

module.exports = Task;