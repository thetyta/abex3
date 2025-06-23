import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';
import Usuario from './UsuarioModel.js';

const Endereco = sequelize.define("endereco", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relacionamento
Endereco.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

export default Endereco;
