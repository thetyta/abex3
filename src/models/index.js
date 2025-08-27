import { sequelize } from '../config/postgres.js';

import Usuario from './UsuarioModel.js';
import Endereco from './EnderecoModel.js';
import Localidade from './LocalidadeModel.js';
import PessoaFisica from './PessoaFisicaModel.js';
import PessoaJuridica from './PessoaJuridicaModel.js';
import Projeto from './ProjetoModel.js';
import ProjetoColaborador from './ProjetoColaboradorModel.js';
import Tarefa from './TarefaModel.js';
import ChecklistItem from './ChecklistItemModel.js';
import Anexo from './AnexoModel.js';

// --- RELACIONAMENTOS ---
Usuario.hasOne(PessoaFisica, { foreignKey: 'usuario_id', as: 'pessoa_fisica' });
PessoaFisica.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasOne(PessoaJuridica, { foreignKey: 'usuario_id', as: 'pessoa_juridica' });
PessoaJuridica.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Endereco, { foreignKey: 'usuario_id', as: 'enderecos' });
Endereco.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Localidade.hasMany(Endereco, { foreignKey: 'cep', as: 'enderecos' });
Endereco.belongsTo(Localidade, { foreignKey: 'cep', as: 'localidade' });

Usuario.hasMany(Projeto, { foreignKey: 'responsavel_id', as: 'projetos_responsaveis' });
Projeto.belongsTo(Usuario, { foreignKey: 'responsavel_id', as: 'responsavel' });

Usuario.belongsToMany(Projeto, {
  through: ProjetoColaborador,
  foreignKey: 'usuario_id',
  otherKey: 'projeto_id',
  as: 'projetos_colaborador'
});
Projeto.belongsToMany(Usuario, {
  through: ProjetoColaborador,
  foreignKey: 'projeto_id',
  otherKey: 'usuario_id',
  as: 'colaboradores'
});

Projeto.hasMany(Tarefa, { foreignKey: 'projeto_id', as: 'tarefas' });
Tarefa.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });

Usuario.hasMany(Tarefa, { foreignKey: 'responsavel_id', as: 'tarefas_responsaveis' });
Tarefa.belongsTo(Usuario, { foreignKey: 'responsavel_id', as: 'responsavel' });

Tarefa.hasMany(ChecklistItem, { foreignKey: 'tarefa_id', as: 'checklist' });
ChecklistItem.belongsTo(Tarefa, { foreignKey: 'tarefa_id', as: 'tarefa' });

Tarefa.hasMany(Anexo, { foreignKey: 'tarefa_id', as: 'anexos' });
Anexo.belongsTo(Tarefa, { foreignKey: 'tarefa_id', as: 'tarefa' });


// --- SINCRONIZAÇÃO COM O BANCO DE DADOS ---
(async () => {
  try {
    // AVISO: force: true APAGA TUDO e recria as tabelas a cada reinicialização.
    await sequelize.sync({ force: true });
    console.log("✅ Todas as tabelas foram sincronizadas com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao sincronizar as tabelas:", error);
  }
})();


// --- EXPORTAÇÃO DOS MODELOS ---

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
