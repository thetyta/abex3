import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Endereco = sequelize.define("enderecos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'localidades',
      key: 'cep'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Endereco;
