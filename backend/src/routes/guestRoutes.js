const express = require('express');
const router = express.Router();

// Rota para listar hóspedes
router.get('/', (req, res) => {
  res.json({ message: 'Lista de hóspedes' });
});

// Rota para criar um novo hóspede
router.post('/', (req, res) => {
  const { name, email } = req.body;
  res.json({ message: `Hóspede ${name} criado com sucesso!` });
});

module.exports = router;