#!/bin/bash

echo "🚀 Iniciando a criação completa da funcionalidade de IA (Histórico e Feedback)..."

# --- Garante que os diretórios existem ---
mkdir -p src/models
mkdir -p src/controllers
mkdir -p src/routes
echo "Diretórios verificados."

# ==============================================================================
# --- MODELS ---
# ==============================================================================
echo "--- Gerando Models ---"

# Model: HistoricoConversaIAModel.js
cat << 'EOF' > src/models/HistoricoConversaIAModel.js
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
EOF
echo "✅ Model HistoricoConversaIAModel.js criado."

# Model: FeedbackIAModel.js
cat << 'EOF' > src/models/FeedbackIAModel.js
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
EOF
echo "✅ Model FeedbackIAModel.js criado."

# ==============================================================================
# --- ATUALIZAÇÃO DO models/index.js ---
# ==============================================================================
echo "--- Atualizando src/models/index.js com os novos models e relações ---"
# Remove a exportação final para poder adicionar os novos models
sed -i '/^export {/,/};/d' src/models/index.js

# Adiciona os imports e as novas relações
cat << 'EOF' >> src/models/index.js

import HistoricoConversaIA from './HistoricoConversaIAModel.js';
import FeedbackIA from './FeedbackIAModel.js';

// --- NOVOS RELACIONAMENTOS (IA) ---
Tarefa.hasMany(HistoricoConversaIA, { foreignKey: 'tarefa_id', as: 'historico_ia' });
HistoricoConversaIA.belongsTo(Tarefa, { foreignKey: 'tarefa_id', as: 'tarefa' });

HistoricoConversaIA.hasOne(FeedbackIA, { foreignKey: 'mensagem_id', as: 'feedback' });
FeedbackIA.belongsTo(HistoricoConversaIA, { foreignKey: 'mensagem_id', as: 'mensagem' });

// --- EXPORTAÇÃO DE TODOS OS MODELOS ---
export {
  Usuario,
  Endereco,
  Localidade,
  PessoaFisica,
  PessoaJuridica,
  Projeto,
  ProjetoColaborador,
  Tarefa,
  ChecklistItem,
  Anexo,
  HistoricoConversaIA,
  FeedbackIA
};
EOF
echo "✅ src/models/index.js atualizado."

# ==============================================================================
# --- CONTROLLERS ---
# ==============================================================================
echo "--- Gerando Controllers ---"

# Controller: HistoricoConversaIAController.js
cat << 'EOF' > src/controllers/HistoricoConversaIAController.js
import { HistoricoConversaIA, Tarefa, FeedbackIA } from '../models/index.js';

const getHistoricoPorTarefa = async (req, res) => {
  try {
    const { tarefa_id } = req.params;

    const tarefa = await Tarefa.findByPk(tarefa_id);
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const historico = await HistoricoConversaIA.findAll({
      where: { tarefa_id },
      include: [{
        model: FeedbackIA,
        as: 'feedback',
        required: false
      }],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json(historico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const adicionarMensagem = async (req, res) => {
  try {
    const { tarefa_id } = req.params;
    const { conteudo, remetente } = req.body;

    if (!conteudo || !remetente) {
      return res.status(400).json({ error: 'Os campos "conteudo" e "remetente" são obrigatórios.' });
    }
    if (!['USUARIO', 'IA'].includes(remetente)) {
      return res.status(400).json({ error: 'O campo "remetente" deve ser "USUARIO" ou "IA".' });
    }

    const tarefa = await Tarefa.findByPk(tarefa_id);
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const novaMensagem = await HistoricoConversaIA.create({
      conteudo,
      remetente,
      tarefa_id
    });

    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getHistoricoPorTarefa, adicionarMensagem };
EOF
echo "✅ Controller HistoricoConversaIAController.js criado."

# Controller: FeedbackIAController.js
cat << 'EOF' > src/controllers/FeedbackIAController.js
import { FeedbackIA, HistoricoConversaIA } from '../models/index.js';

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackIA.findAll({
      include: [{
        model: HistoricoConversaIA,
        as: 'mensagem',
        attributes: ['id', 'conteudo']
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { mensagem_id } = req.params;
    const { avaliacao, comentario } = req.body;

    const mensagem = await HistoricoConversaIA.findByPk(mensagem_id);
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem da IA não encontrada.' });
    }
    if (mensagem.remetente !== 'IA') {
      return res.status(400).json({ error: 'O feedback só pode ser dado para mensagens da IA.' });
    }

    const feedback = await FeedbackIA.create({
      avaliacao,
      comentario,
      mensagem_id
    });

    res.status(201).json(feedback);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Esta mensagem já possui um feedback.' });
    }
    res.status(400).json({ error: error.message });
  }
};

export { createFeedback, getFeedbacks };
EOF
echo "✅ Controller FeedbackIAController.js criado."

# ==============================================================================
# --- ROUTES ---
# ==============================================================================
echo "--- Gerando Rotas ---"

# Rota: HistoricoConversaIARoute.js
cat << 'EOF' > src/routes/HistoricoConversaIARoute.js
import * as historicoController from '../controllers/HistoricoConversaIAController.js';

const historicoConversaIARoutes = (app) => {
  app.get('/tarefas/:tarefa_id/historico', historicoController.getHistoricoPorTarefa);
  app.post('/tarefas/:tarefa_id/historico', historicoController.adicionarMensagem);
};

export default historicoConversaIARoutes;
EOF
echo "✅ Rota HistoricoConversaIARoute.js criada."

# Rota: FeedbackIARoute.js
cat << 'EOF' > src/routes/FeedbackIARoute.js
import * as feedbackController from '../controllers/FeedbackIAController.js';

const feedbackIARoutes = (app) => {
  app.post('/historico-ia/:mensagem_id/feedback', feedbackController.createFeedback);
  app.get('/feedbacks', feedbackController.getFeedbacks);
};

export default feedbackIARoutes;
EOF
echo "✅ Rota FeedbackIARoute.js criada."

# ==============================================================================
# --- ATUALIZAÇÃO DO routes/index.js ---
# ==============================================================================
echo "--- Atualizando src/routes/index.js ---"
# Remove a última linha (export) para poder adicionar as novas rotas
sed -i '$d' src/routes/index.js

# Adiciona os imports e os registros das novas rotas
cat << 'EOF' >> src/routes/index.js
import historicoConversaIARoutes from './HistoricoConversaIARoute.js';
import feedbackIARoutes from './FeedbackIARoute.js';

  // Novas rotas da IA
  historicoConversaIARoutes(app);
  feedbackIARoutes(app);
}

export default Routes;
EOF
echo "✅ src/routes/index.js atualizado."

echo "🎉 Funcionalidade completa de IA (Histórico e Feedback) implementada com sucesso!"