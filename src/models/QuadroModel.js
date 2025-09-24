// QuadroModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Quadro = sequelize.define("quadros", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Quadro Principal'
  },
  projeto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projetos',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Quadro;