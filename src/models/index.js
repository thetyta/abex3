import Usuario from './UsuarioModel.js';
import Endereco from './EnderecoModel.js';
import PessoaFisica from './PessoaFisicaModel.js';
import PessoaJuridica from './PessoaJuridicaModel.js';
import Projeto from './ProjetoModel.js';
import Tarefa from './TarefaModel.js';

(async () => {
    await Usuario.sync({ force: true });
    await Endereco.sync({ force: true });
    await PessoaFisica.sync({ force: true });
    await PessoaJuridica.sync({ force: true });
    await Projeto.sync({ force: true });
    await Tarefa.sync({ force: true });
})();

export {
  Usuario,
  Endereco,
  PessoaFisica,
  PessoaJuridica,
  Projeto,
  Tarefa
};