require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const routes = require('./src/routes'); // Importa as rotas

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Usa as rotas com o prefixo '/api'
// Ex: http://localhost:3000/api/login
app.use('/api', routes);

// Sincroniza o banco de dados (Cria a tabela Users se não existir)
sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado! Tabela de usuários pronta. 💾');
}).catch((error) => {
    console.error('Erro ao sincronizar banco:', error);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});