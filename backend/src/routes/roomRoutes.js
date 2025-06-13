const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware'); // Assuming all room routes require auth

// Rota para listar os quartos
router.get('/', protect, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');

    if (error) {
      console.error('Error fetching rooms:', error.message);
      // Consider the nature of the error. Is it a client mistake or server?
      // Supabase errors often include a code that can help differentiate.
      // For a generic fetch, 500 is okay if the error isn't a direct result of user input.
      return res.status(500).json({ message: 'Failed to fetch rooms', details: error.message });
    }
    res.json(data);
  } catch (err) {
    // Catch any other unexpected errors during the process
    console.error('Unexpected error in GET /rooms:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// TODO: Add routes for creating, updating, and deleting rooms if needed.
// Apply 'protect' and 'authorize' middleware as appropriate for those routes.
// Exemplo para POST (criar quarto):
/*
router.post('/', async (req, res) => {
  const { room_number, type, beds, capacity, price_per_night, features } = req.body;

  if (!room_number || !type || !beds || !capacity || price_per_night === undefined) {
    return res.status(400).json({ message: 'Missing required room details' }); // Standardized to 'message'
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert([{ room_number, type, beds, capacity, price_per_night, features, status: 'available' }])
    .select();

  if (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ message: 'Error creating room', details: error.message }); // Standardized to 'message'
  }
  res.status(201).json(data);
});
*/

module.exports = router;