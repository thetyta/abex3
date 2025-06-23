import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';
import Usuario from './UsuarioModel.js';

const PessoaJuridica = sequelize.define("pessoa_juridica", {
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
      len: [14, 18] // CNPJ com ou sem formatação
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
PessoaJuridica.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

export default PessoaJuridica;
