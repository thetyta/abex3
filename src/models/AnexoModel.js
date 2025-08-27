import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Anexo = sequelize.define("anexos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_arquivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url_arquivo: {
    type: DataTypes.STRING,
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
  createdAt: 'uploaded_at',
  updatedAt: false
});

export default Anexo;
