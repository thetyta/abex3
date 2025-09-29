// TarefaModel.js
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
    type: DataTypes.ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'),
    allowNull: false,
    defaultValue: 'PENDENTE'
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
    type: DataTypes.ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA'),
    allowNull: false,
    defaultValue: 'MEDIA'
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  posicao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
  },
  coluna_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'colunas',
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