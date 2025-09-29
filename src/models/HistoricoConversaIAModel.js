import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const HistoricoConversaIA = sequelize.define("historico_conversas_ia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  remetente: {
    type: DataTypes.ENUM('USUARIO', 'IA'),
    allowNull: false
  },
  tarefa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tarefas',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default HistoricoConversaIA;
