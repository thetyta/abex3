// TarefaEtiquetaModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const TarefaEtiqueta = sequelize.define("tarefas_etiquetas", {
  tarefa_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tarefas',
      key: 'id'
    },
    primaryKey: true
  },
  etiqueta_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'etiquetas',
      key: 'id'
    },
    primaryKey: true
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default TarefaEtiqueta;