import { sequelize } from './config/postgres.js';
import './models/index.js';

// Script para criar as tabelas no banco
const createTables = async () => {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    console.log('🔄 Sincronizando tabelas...');
    await sequelize.sync({ force: true });
    console.log('✅ Tabelas criadas com sucesso!');
    
    console.log('📋 Tabelas criadas:');
    console.log('- usuario');
    console.log('- endereco');
    console.log('- pessoa_fisica');
    console.log('- pessoa_juridica');
    console.log('- projeto');
    console.log('- tarefa');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

createTables();
