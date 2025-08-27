import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Tarefa = sequelize.define("tarefas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PENDENTE',
    validate: {
      isIn: [['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']]
    }
  },
  data_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  data_fim: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  data_prazo: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  prioridade: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'MEDIA',
    validate: {
      isIn: [['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']]
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsavel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  projeto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projetos',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Tarefa;
