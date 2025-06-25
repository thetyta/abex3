import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';
import Usuario from './UsuarioModel.js';
import Projeto from './ProjetoModel.js';

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
  checklist: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
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
  arquivos: {
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

// Relacionamentos
Tarefa.belongsTo(Usuario, {
  foreignKey: 'responsavel_id',
  as: 'responsavel'
});

Tarefa.belongsTo(Projeto, {
  foreignKey: 'projeto_id',
  as: 'projeto'
});

export default Tarefa;
