const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protect to all reservation routes, authorize as needed per route
router.use(protect);

// GET /api/reservations - List all reservations
// Roles: admin, owner, attendant
router.get('/', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        check_in_date,
        check_out_date,
        total_amount,
        payment_status,
        payment_method,
        created_at,
        guests (id, name, email),
        rooms (id, room_number, type)
      `);

    if (error) {
      console.error('Error fetching reservations:', error.message);
      return res.status(500).json({ message: 'Failed to fetch reservations', details: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Unexpected error in GET /reservations:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// POST /api/reservations - Create a new reservation
// Roles: admin, owner, attendant
router.post('/', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method } = req.body;

    if (!guest_id || !room_id || !check_in_date || !check_out_date || total_amount === undefined) {
      return res.status(400).json({ message: 'Missing required reservation details' });
    }
    if (new Date(check_out_date) <= new Date(check_in_date)) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert([{ guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method }])
      .select();

    if (error) {
      console.error('Error creating reservation:', error.message);
      // Check for specific Supabase errors, e.g., foreign key violation (23503)
      if (error.code === '23503') {
        return res.status(400).json({ message: 'Invalid guest_id or room_id provided.', details: error.message });
      }
      return res.status(500).json({ message: 'Failed to create reservation', details: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error in POST /reservations:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// GET /api/reservations/:id - Get a specific reservation
// Roles: admin, owner, attendant
router.get('/:id', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reservations')
      .select(`
      id,
      check_in_date,
      check_out_date,
      total_amount,
      payment_status,
      payment_method,
      created_at,
      guests (id, name, email),
      rooms (id, room_number, type)
      id,
      check_in_date,
      check_out_date,
      total_amount,
      payment_status,
      payment_method,
      created_at,
      guests (id, name, email),
      rooms (id, room_number, type)
    `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching reservation:', error.message);
      return res.status(500).json({ message: 'Failed to fetch reservation', details: error.message });
    }
    if (!data) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(`Unexpected error in GET /reservations/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// PUT /api/reservations/:id - Update a reservation
// Roles: admin, owner, attendant
router.put('/:id', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { id } = req.params;
    const { guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method } = req.body;

    // Basic validation, ensure at least one field is being updated
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update. At least one field is required.' });
    }

    // Construct update object with provided fields
    const updateFields = { ...req.body };
    // Remove id from body if present, as it's in params
    delete updateFields.id;
    // Ensure no undefined fields are accidentally passed if not explicitly handled by DB policy or trigger
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);


    if (check_in_date && check_out_date && new Date(check_out_date) <= new Date(check_in_date)) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }


    const { data, error } = await supabase
      .from('reservations')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating reservation:', error.message);
      if (error.code === '23503') { // Foreign key violation
        return res.status(400).json({ message: 'Invalid guest_id or room_id provided for update.', details: error.message });
      }
      return res.status(500).json({ message: 'Failed to update reservation', details: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Reservation not found or no changes made' });
    }
    res.json(data);
  } catch (err) {
    console.error(`Unexpected error in PUT /reservations/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// DELETE /api/reservations/:id - Delete a reservation
// Roles: admin, owner (Attendants typically shouldn't delete reservations)
router.delete('/:id', authorize('admin', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if the reservation exists to provide a better 404 message
    const { data: existingReservation, error: fetchError } = await supabase
        .from('reservations')
        .select('id')
        .eq('id', id)
        .single();

    if (fetchError || !existingReservation) {
        // If error or no data, it implies not found or an issue accessing it.
        // Supabase .single() returns an error if no rows (or more than one) are found.
        // If fetchError.code is 'PGRST116' (PostgREST error for "Searched item was not found"), it's a 404.
        if (fetchError && fetchError.code === 'PGRST116') {
            return res.status(404).json({ message: 'Reservation not found to delete.' });
        }
        // For other errors during the fetch, treat as server error.
        if (fetchError) {
            console.error('Error checking reservation for delete:', fetchError.message);
            return res.status(500).json({ message: 'Error verifying reservation before delete.', details: fetchError.message });
        }
        if (!existingReservation) { // Should be covered by PGRST116, but as a fallback
             return res.status(404).json({ message: 'Reservation not found to delete.' });
        }
    }

    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);
      // .select(); // .select() after delete is not standard for returning deleted item count directly, error indicates failure

    if (deleteError) {
      console.error('Error deleting reservation:', deleteError.message);
      return res.status(500).json({ message: 'Failed to delete reservation', details: deleteError.message });
    }

    // If no error, the delete operation was successful on the DB for the given ID.
    res.status(204).send();
  } catch (err) {
    console.error(`Unexpected error in DELETE /reservations/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

module.exports = router;
      id,
      check_in_date,
      check_out_date,
      total_amount,
      payment_status,
      payment_method,
      created_at,
      guests (id, name, email),
      rooms (id, room_number, type)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching reservation:', error);
    return res.status(500).json({ error: 'Error fetching reservation', details: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  res.json(data);
});

// PUT /api/reservations/:id - Update a reservation
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method } = req.body;

  // Basic validation, ensure at least one field is being updated
  if (!guest_id && !room_id && !check_in_date && !check_out_date && total_amount === undefined && !payment_status && !payment_method) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  // Construct update object with provided fields
  const updateFields = {};
  if (guest_id) updateFields.guest_id = guest_id;
  if (room_id) updateFields.room_id = room_id;
  if (check_in_date) updateFields.check_in_date = check_in_date;
  if (check_out_date) updateFields.check_out_date = check_out_date;
  if (total_amount !== undefined) updateFields.total_amount = total_amount;
  if (payment_status) updateFields.payment_status = payment_status;
  if (payment_method) updateFields.payment_method = payment_method;

  const { data, error } = await supabase
    .from('reservations')
    .update(updateFields)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating reservation:', error);
    return res.status(500).json({ error: 'Error updating reservation', details: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Reservation not found or no changes made' });
  }
  res.json(data);
});

// DELETE /api/reservations/:id - Delete a reservation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)
    .select(); // Select to confirm what was deleted, or if it existed

  if (error) {
    console.error('Error deleting reservation:', error);
    return res.status(500).json({ error: 'Error deleting reservation', details: error.message });
  }
  // Supabase delete doesn't return the deleted record in `data` if it existed, but error will be null.
  // If `data` is null or empty and no error, it means the record was not found or already deleted.
  // We check the count of affected rows if available, or assume success if no error.
  // For more robust check, one might select before deleting.
  // However, the .select() after delete in Supabase v2 often returns the deleted items (if any).
  if (!data || data.length === 0) {
     // This condition might be true if the record didn't exist.
     // Supabase client might return an empty array and no error if the row doesn't exist.
     // Or it might return an error if RLS prevents deletion or row not found.
     // Let's assume for now if no error, it was "successful" in the sense that the state is as requested (item is gone).
     // A more specific check might involve checking `error.code` or `error.details` if Supabase provides them for "not found".
     // For now, we'll send 204 No Content, which is typical for DELETE operations.
  }

  res.status(204).send(); // Successfully processed, no content to return
});

module.exports = router;
