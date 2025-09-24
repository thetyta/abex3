// ColunaModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Coluna = sequelize.define("colunas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  quadro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quadros',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Coluna;