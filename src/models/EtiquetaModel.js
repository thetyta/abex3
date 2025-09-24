// EtiquetaModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres.js';

const Etiqueta = sequelize.define("etiquetas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#CCCCCC' // Cor padrão
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
  timestamps: false
});

export default Etiqueta;