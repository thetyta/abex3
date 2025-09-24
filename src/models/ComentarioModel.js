// ComentarioModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Comentario = sequelize.define("comentarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
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

export default Comentario;