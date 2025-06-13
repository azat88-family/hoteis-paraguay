const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');

// Rota para listar hóspedes
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*');

  if (error) {
    console.error('Error fetching guests:', error);
    return res.status(500).json({ error: 'Error fetching guests', details: error.message });
  }
  res.json(data);
});

// Rota para criar um novo hóspede
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const { data, error } = await supabase
    .from('guests')
    .insert([{ name, email, phone }])
    .select();

  if (error) {
    console.error('Error creating guest:', error);
    return res.status(500).json({ message: 'Error creating guest', details: error.message });
  }
  res.status(201).json(data);
});

module.exports = router;