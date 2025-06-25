import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';
import Usuario from './UsuarioModel.js';

const Projeto = sequelize.define("projetos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  colaboradores: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  responsavel_id: {
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
Projeto.belongsTo(Usuario, {
  foreignKey: 'responsavel_id',
  as: 'responsavel'
});

export default Projeto;
