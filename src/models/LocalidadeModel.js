import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Localidade = sequelize.define("localidades", {
  cep: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default Localidade;
