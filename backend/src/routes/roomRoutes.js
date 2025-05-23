const express = require('express');
const router = express.Router();

// Dados mockados de exemplo (substitua por dados reais do banco de dados no futuro)
const rooms = [
  {
    id: 101,
    type: 'Standard',
    beds: 'Queen',
    capacity: 2,
    price: 120,
    status: 'occupied',
    guest: 'John Smith',
    checkIn: '2023-06-12',
    checkOut: '2023-06-15',
    features: ['Wi-Fi', 'TV', 'AC', 'Breakfast'],
  },
  {
    id: 102,
    type: 'Standard',
    beds: 'Twin',
    capacity: 2,
    price: 120,
    status: 'available',
    guest: null,
    checkIn: null,
    checkOut: null,
    features: ['Wi-Fi', 'TV', 'AC'],
  },
  // Adicione mais quartos conforme necessário
];

// Rota para listar os quartos
router.get('/', (req, res) => {
  res.json(rooms);
});

module.exports = router;