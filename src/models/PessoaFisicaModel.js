import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';
import Usuario from './UsuarioModel.js';

const PessoaFisica = sequelize.define("pessoas_fisicas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 14] // CPF com ou sem formatação
    }
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

// Relacionamento
PessoaFisica.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

export default PessoaFisica;
