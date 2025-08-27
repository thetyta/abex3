import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const ChecklistItem = sequelize.define("checklist_itens", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  concluido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  timestamps: false
});

export default ChecklistItem;
