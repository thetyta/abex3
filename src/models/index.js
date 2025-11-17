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
import HistoricoConversaIA from './HistoricoConversaIAModel.js';
import FeedbackIA from './FeedbackIAModel.js';
import Quadro from './QuadroModel.js';
import Coluna from './ColunaModel.js';
import Etiqueta from './EtiquetaModel.js';
import TarefaEtiqueta from './TarefaEtiquetaModel.js';
import Comentario from './ComentarioModel.js';


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
Tarefa.hasMany(ChecklistItem, { foreignKey: 'tarefa_id', as: 'checklist_itens' });
ChecklistItem.belongsTo(Tarefa, { foreignKey: 'tarefa_id', as: 'tarefa' });
Tarefa.hasMany(Anexo, { foreignKey: 'tarefa_id', as: 'anexos' });
Anexo.belongsTo(Tarefa, { foreignKey: 'tarefa_id', as: 'tarefa' });
Projeto.hasMany(HistoricoConversaIA, { foreignKey: 'projeto_id', as: 'historico_ia' });
HistoricoConversaIA.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
HistoricoConversaIA.hasOne(FeedbackIA, { foreignKey: 'mensagem_id', as: 'feedback' });
FeedbackIA.belongsTo(HistoricoConversaIA, { foreignKey: 'mensagem_id', as: 'mensagem' });
Projeto.hasMany(Quadro, { foreignKey: 'projeto_id', as: 'quadros' });
Quadro.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
Quadro.hasMany(Coluna, { foreignKey: 'quadro_id', as: 'colunas' });
Coluna.belongsTo(Quadro, { foreignKey: 'quadro_id', as: 'quadro' });
Coluna.hasMany(Tarefa, { foreignKey: 'coluna_id', as: 'tarefas' });
Tarefa.belongsTo(Coluna, { foreignKey: 'coluna_id', as: 'coluna' });

Tarefa.belongsToMany(Etiqueta, {
  through: TarefaEtiqueta,
  foreignKey: 'tarefa_id',
  otherKey: 'etiqueta_id',
  as: 'etiquetas'
});
Etiqueta.belongsToMany(Tarefa, {
  through: TarefaEtiqueta,
  foreignKey: 'etiqueta_id',
  otherKey: 'tarefa_id',
  as: 'tarefas'
});

Projeto.hasMany(Etiqueta, { foreignKey: 'projeto_id', as: 'etiquetas' });
Etiqueta.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });

Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

Tarefa.hasMany(Comentario, { foreignKey: 'tarefa_id', as: 'comentarios' });
Comentario.belongsTo(Tarefa, { foreignKey: 'tarefa_id', as: 'tarefa' });


// --- SINCRONIZAÇÃO COM O BANCO DE DADOS ---
// (async () => {
//   try {
//     // AVISO: force: true APAGA TUDO e recria as tabelas a cada reinicialização.
//     // Use com cuidado em desenvolvimento. Nunca use em produção.
//     await sequelize.sync({ force: true }); // Mude para false para não apagar os dados
//     console.log("✅ Todas as tabelas foram sincronizadas com sucesso.");
//   } catch (error) {
//     console.error("❌ Erro ao sincronizar as tabelas:", error);
//   }
// })();

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
  FeedbackIA,
  Quadro,
  Coluna,
  Etiqueta,
  TarefaEtiqueta,
  Comentario
};