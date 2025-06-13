const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protect to all maintenance routes, authorize as needed
router.use(protect);

// GET /api/maintenance - List all maintenance requests
// Roles: admin, owner, attendant
router.get('/', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    // Optional: Filter by room_id if provided in query params
    const { room_id } = req.query;
    let query = supabase.from('maintenance_requests').select(`
      id,
      description,
      status,
      priority,
      reported_at,
      completed_at,
      rooms (id, room_number)
    `);

    if (room_id) {
      query = query.eq('room_id', room_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching maintenance requests:', error.message);
      return res.status(500).json({ message: 'Failed to fetch maintenance requests', details: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Unexpected error in GET /maintenance:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// POST /api/maintenance - Create a new maintenance request
// Roles: admin, owner, attendant
router.post('/', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { room_id, description, priority } = req.body;

    if (!room_id || !description) {
      return res.status(400).json({ message: 'Room ID and description are required' });
    }

    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([{ room_id, description, priority: priority || 'medium', status: 'pending' }])
      .select();

    if (error) {
      console.error('Error creating maintenance request:', error.message);
      if (error.code === '23503') { // Foreign key violation for room_id
        return res.status(400).json({ message: 'Invalid room_id provided.', details: error.message });
      }
      return res.status(500).json({ message: 'Failed to create maintenance request', details: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error in POST /maintenance:', err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// GET /api/maintenance/:id - Get a specific maintenance request
// Roles: admin, owner, attendant
router.get('/:id', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
      id,
      description,
      status,
      priority,
      reported_at,
      completed_at,
      rooms (id, room_number)
      id,
      description,
      status,
      priority,
      reported_at,
      completed_at,
      rooms (id, room_number)
    `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching maintenance request:', error.message);
      if (error.code === 'PGRST116') { // Not found by .single()
        return res.status(404).json({ message: 'Maintenance request not found' });
      }
      return res.status(500).json({ message: 'Failed to fetch maintenance request', details: error.message });
    }
    // .single() ensures data is not null if no error, but as a safeguard:
    if (!data) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(`Unexpected error in GET /maintenance/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// PUT /api/maintenance/:id - Update a maintenance request
// Roles: admin, owner, attendant
router.put('/:id', authorize('admin', 'owner', 'attendant'), async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, priority, room_id, completed_at } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update. At least one field is required.' });
    }

    const updateFields = { ...req.body };
    delete updateFields.id; // Cannot update PK
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);


    // If status is 'completed', set completed_at unless provided
    if (status === 'completed' && !completed_at) {
      updateFields.completed_at = new Date().toISOString();
    } else if (status && status !== 'completed' && updateFields.completed_at !== null) {
      // If status is changed from completed to something else, nullify completed_at if not explicitly set to null
      if (completed_at === undefined) updateFields.completed_at = null;
    }


    const { data, error } = await supabase
      .from('maintenance_requests')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating maintenance request:', error.message);
      if (error.code === '23503' && error.message.includes('room_id')) { // Foreign key violation for room_id
        return res.status(400).json({ message: 'Invalid room_id provided for update.', details: error.message });
      }
      return res.status(500).json({ message: 'Failed to update maintenance request', details: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Maintenance request not found or no changes made' });
    }
    res.json(data);
  } catch (err) {
    console.error(`Unexpected error in PUT /maintenance/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'An unexpected error occurred', details: err.message });
  }
});

// Consider adding DELETE route for maintenance requests, likely admin only
// router.delete('/:id', authorize('admin'), async (req, res) => { ... });

module.exports = router;
      id,
      description,
      status,
      priority,
      reported_at,
      completed_at,
      rooms (id, room_number)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching maintenance request:', error);
    return res.status(500).json({ error: 'Error fetching maintenance request', details: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Maintenance request not found' });
  }
  res.json(data);
});

// PUT /api/maintenance/:id - Update a maintenance request
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, status, priority, room_id, completed_at } = req.body;

  // Basic validation
  if (!description && !status && !priority && !room_id && !completed_at) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  const updateFields = {};
  if (description) updateFields.description = description;
  if (status) updateFields.status = status;
  if (priority) updateFields.priority = priority;
  if (room_id) updateFields.room_id = room_id;
  if (completed_at) updateFields.completed_at = completed_at;
  // If status is 'completed', set completed_at unless provided
  if (status === 'completed' && !completed_at) {
    updateFields.completed_at = new Date().toISOString();
  }


  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updateFields)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating maintenance request:', error);
    return res.status(500).json({ error: 'Error updating maintenance request', details: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Maintenance request not found or no changes made' });
  }
  res.json(data);
});

module.exports = router;
