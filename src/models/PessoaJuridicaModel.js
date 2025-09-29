import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const PessoaJuridica = sequelize.define("pessoas_juridicas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [14, 18]
    }
  },
  nome_fantasia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

export default PessoaJuridica;
