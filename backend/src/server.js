require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const app = require('./app'); // Importa o aplicativo Express configurado no app.js

// Define a porta do servidor
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});