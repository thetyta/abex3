import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Localidade = sequelize.define("localidades", {
  cep: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default Localidade;
