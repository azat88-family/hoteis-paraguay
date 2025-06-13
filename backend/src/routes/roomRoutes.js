const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware'); // Assuming all room routes require auth

// Rota para listar os quartos
router.get('/', protect, async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *,
        reservations (
          check_in_date,
          check_out_date,
          guests (
            id,
            name,
            email
          )
        )
      `);

    if (error) {
      console.error('Error fetching rooms with reservations:', error.message);
      return res.status(500).json({ message: 'Failed to fetch rooms and reservation data', details: error.message });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to compare only dates

    const roomsWithGuestInfo = rooms.map(room => {
      let activeReservationGuest = null;
      // Ensure room.reservations is an array and not null before trying to iterate
      if (Array.isArray(room.reservations) && room.reservations.length > 0) {
        for (const res of room.reservations) {
          // Ensure dates are valid before creating Date objects
          if (!res.check_in_date || !res.check_out_date) {
            console.warn(`Room ${room.id} has a reservation ${res.id || '(unknown ID)'} with missing dates.`);
            continue;
          }
          const checkIn = new Date(res.check_in_date);
          const checkOut = new Date(res.check_out_date);

          // Basic date validity check
          if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            console.warn(`Room ${room.id} has a reservation ${res.id || '(unknown ID)'} with invalid dates.`);
            continue;
          }

          // checkOut is the day of departure. Room is occupied up to, but not including, checkOut date.
          if (checkIn <= today && today < checkOut) {
            if (res.guests) {
              activeReservationGuest = {
                id: res.guests.id,
                name: res.guests.name,
                email: res.guests.email
              };
              break;
            }
          }
        }
      }

      const { reservations, ...roomData } = room;
      return {
        ...roomData,
        active_guest: activeReservationGuest
      };
    });

    res.json(roomsWithGuestInfo);
  } catch (err) {
    // Catch any other unexpected errors during the process
    console.error('Unexpected error in GET /rooms:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred while processing rooms', details: err.message });
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