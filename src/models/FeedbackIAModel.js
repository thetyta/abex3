import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const FeedbackIA = sequelize.define("feedbacks_ia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  avaliacao: {
    type: DataTypes.ENUM('UTIL', 'INUTIL'),
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mensagem_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'historico_conversas_ia',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default FeedbackIA;
