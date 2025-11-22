// backend/src/models/Horario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Materia = require('./Materia');

const Horario = sequelize.define('Horario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dia_semana: {
    type: DataTypes.INTEGER, // 0=Dom, 1=Seg, ..., 6=Sab
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.STRING, // Formato 'HH:mm'
    allowNull: false,
  },
  hora_fim: {
    type: DataTypes.STRING, // Formato 'HH:mm'
    allowNull: false,
  },
  sala: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// Relacionamentos
Horario.belongsTo(Materia, { foreignKey: 'materiaId', as: 'materia', onDelete: 'CASCADE' });
Materia.hasMany(Horario, { foreignKey: 'materiaId', as: 'horarios' });

module.exports = Horario;