import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const ProjetoColaborador = sequelize.define("projetos_colaboradores", {
  projeto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'projetos',
      key: 'id'
    },
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    primaryKey: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'assigned_at',
  updatedAt: false
});

export default ProjetoColaborador;
