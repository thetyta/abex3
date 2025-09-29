import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Usuario = sequelize.define("usuarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senhaHash: {
    field: 'senha_hash',
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(255)
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  codigoResetSenha: {
    field: 'codigo_reset_senha',
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  codigoExpires: {
    field: 'codigo_expires',
    type: DataTypes.DATE,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Usuario;
