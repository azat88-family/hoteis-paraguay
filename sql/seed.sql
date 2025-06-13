-- SQL INSERT Scripts for Sample Data
--
-- Instructions for User:
-- 1. Order of Execution:
--    - Execute INSERT statements for `guests` first.
--    - Then, execute INSERT statements for `rooms`.
--    - After `guests` and `rooms` are populated, execute INSERTs for `reservations`.
--    - Finally, execute INSERTs for `maintenance_requests`.
--    This order is important due to foreign key constraints.
--
-- 2. ID Conflicts:
--    - These scripts assume that the IDs for `guests` and `rooms` will be generated starting from 1
--      if the tables are empty.
--    - If you have existing data, the `(SELECT id FROM ...)` subqueries will help find the correct IDs
--      based on unique fields like email or room_number. However, ensure these unique fields in the
--      sample data below do not conflict with your existing data if you are not starting with empty tables.
--    - For a clean test environment, consider truncating tables (e.g., TRUNCATE TABLE guests CASCADE;),
--      but BE EXTREMELY CAREFUL if running this on a database with important data.
--
-- 3. Dates:
--    - The date placeholders below use standard SQL date functions/operators
--      (e.g., CURRENT_DATE, INTERVAL) which should work in PostgreSQL.
--      You can replace them with specific literal dates if preferred (e.g., '2023-10-26').

-- Inserir Hóspedes (guests)
INSERT INTO public.guests (name, email, phone) VALUES
('João Silva', 'joao.silva@email.com', '(11) 98765-4321'),
('Maria Oliveira', 'maria.oliveira@email.com', '(21) 91234-5678'),
('Carlos Pereira', 'carlos.pereira@email.com', '(31) 95555-1234'),
('Ana Costa', 'ana.costa@email.com', '(41) 94444-3210');

-- Inserir Quartos (rooms)
-- Note: Room statuses are set to reflect example reservations/maintenance.
-- In a real system, these would be updated dynamically.
INSERT INTO public.rooms (room_number, type, beds, capacity, price_per_night, status, features) VALUES
('101', 'Standard', 'Queen', 2, 120.00, 'occupied', '{"Wi-Fi", "TV", "AC"}'),
('102', 'Deluxe', 'King', 2, 180.50, 'available', '{"Wi-Fi", "TV", "AC", "Breakfast"}'),
('201', 'Suite', 'King', 3, 250.75, 'reserved', '{"Wi-Fi", "TV", "AC", "Minibar", "Breakfast"}'),
('202', 'Standard', 'Twin', 2, 130.00, 'cleaning', '{"Wi-Fi", "TV"}'),
('301', 'Deluxe', 'Queen', 2, 175.00, 'maintenance', '{"Wi-Fi", "TV", "AC"}');

-- Inserir Reservas (reservations)
-- Ensure guests and rooms tables are populated before running these.

-- Reserva para João Silva no Quarto 101
INSERT INTO public.reservations (guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method) VALUES
(
  (SELECT id FROM public.guests WHERE email = 'joao.silva@email.com'),
  (SELECT id FROM public.rooms WHERE room_number = '101'),
  CURRENT_DATE - INTERVAL '1 day', -- Yesterday
  CURRENT_DATE + INTERVAL '1 day', -- Tomorrow
  240.00,
  'paid',
  'credit_card'
);

-- Reserva para Maria Oliveira no Quarto 201
INSERT INTO public.reservations (guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method) VALUES
(
  (SELECT id FROM public.guests WHERE email = 'maria.oliveira@email.com'),
  (SELECT id FROM public.rooms WHERE room_number = '201'),
  CURRENT_DATE + INTERVAL '5 days', -- 5 days from now
  CURRENT_DATE + INTERVAL '7 days', -- 7 days from now
  501.50,
  'pending',
  'bank_transfer'
);

-- Inserir Pedidos de Manutenção (maintenance_requests)
-- Ensure rooms table is populated.

-- Pedido para Quarto 301
INSERT INTO public.maintenance_requests (room_id, description, status, priority, reported_at) VALUES
(
  (SELECT id FROM public.rooms WHERE room_number = '301'),
  'Ar condicionado não está gelando.',
  'in_progress',
  'high',
  CURRENT_DATE -- Today
);

-- Pedido para Quarto 102 (exemplo adicional)
INSERT INTO public.maintenance_requests (room_id, description, status, priority, reported_at) VALUES
(
  (SELECT id FROM public.rooms WHERE room_number = '102'),
  'Chuveiro com vazamento leve.',
  'pending',
  'low',
  CURRENT_DATE - INTERVAL '2 days' -- Two days ago
);

-- Pedido para Quarto 202 (exemplo adicional)
INSERT INTO public.maintenance_requests (room_id, description, status, priority, reported_at, completed_at) VALUES
(
  (SELECT id FROM public.rooms WHERE room_number = '202'),
  'Lâmpada do banheiro queimada.',
  'completed',
  'medium',
  CURRENT_DATE - INTERVAL '5 days', -- Five days ago
  CURRENT_DATE - INTERVAL '4 days'  -- Completed four days ago
);

-- Update room statuses based on reservations and maintenance to ensure consistency if this script is run standalone
-- This is more for ensuring data integrity for the seed data itself.
UPDATE public.rooms SET status = 'occupied' WHERE room_number = '101' AND
  EXISTS (SELECT 1 FROM public.reservations WHERE room_id = public.rooms.id AND check_in_date <= CURRENT_DATE AND check_out_date > CURRENT_DATE);
UPDATE public.rooms SET status = 'reserved' WHERE room_number = '201' AND
  EXISTS (SELECT 1 FROM public.reservations WHERE room_id = public.rooms.id AND check_in_date > CURRENT_DATE);
UPDATE public.rooms SET status = 'maintenance' WHERE room_number = '301' AND
  EXISTS (SELECT 1 FROM public.maintenance_requests WHERE room_id = public.rooms.id AND status != 'completed');

-- Note: The status 'cleaning' for room '202' is set manually above and is not driven by other data in this seed script.
-- In a real system, room status updates (especially to 'occupied', 'available', 'reserved') would be
-- primarily handled by the application logic when reservations are created, guests check-in/out, etc.
-- The status 'maintenance' would be set when a high-priority maintenance request is active.
-- The status 'cleaning' would be set after a guest checks out or before a new guest checks in.
-- This seed script provides a snapshot; actual dynamic updates are part of the application's functionality.
-- The UPDATE statements above are a simple attempt to make the initial seeded data more consistent.

SELECT setval(pg_get_serial_sequence('guests', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM guests;
SELECT setval(pg_get_serial_sequence('rooms', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM rooms;
SELECT setval(pg_get_serial_sequence('reservations', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM reservations;
SELECT setval(pg_get_serial_sequence('maintenance_requests', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM maintenance_requests;

COMMIT;

BEGIN;
-- Test Data for Guests
INSERT INTO guests (name, email, phone) VALUES
('Alice Wonderland', 'alice.wonder@example.com', '555-0101'),
('Bob The Builder', 'bob.builder@example.com', '555-0102'),
('Charlie Brown', 'charlie.brown@example.com', '555-0103'),
('Diana Prince', 'diana.prince@example.com', '555-0104'),
('Edward Scissorhands', 'edward.scissor@example.com', '555-0105');

-- Test Data for Rooms
INSERT INTO rooms (room_number, type, beds, capacity, price_per_night, status, features) VALUES
('T101', 'Test Standard', 'Single', 1, 75.00, 'available', '{"TV"}'),
('T102', 'Test Deluxe', 'Double', 2, 110.00, 'available', '{"TV", "Wi-Fi"}'),
('T201', 'Test Suite', 'King', 2, 190.00, 'available', '{"TV", "Wi-Fi", "Minibar"}');

-- Test Data for Reservations (using some of the new guests and rooms)
-- Assuming guest IDs for Alice, Bob are the next available after initial seed.
-- Assuming room IDs for T101, T102 are the next available.
INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_amount, payment_status, payment_method) VALUES
(
  (SELECT id FROM guests WHERE email = 'alice.wonder@example.com'),
  (SELECT id FROM rooms WHERE room_number = 'T101'),
  CURRENT_DATE + INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '4 days',
  150.00,
  'pending',
  'credit_card'
),
(
  (SELECT id FROM guests WHERE email = 'bob.builder@example.com'),
  (SELECT id FROM rooms WHERE room_number = 'T102'),
  CURRENT_DATE + INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '6 days',
  330.00,
  'paid',
  'cash'
);

-- Test Data for Maintenance Requests
INSERT INTO maintenance_requests (room_id, description, status, priority, reported_at) VALUES
(
  (SELECT id FROM rooms WHERE room_number = 'T201'),
  'Torneira pingando no banheiro.',
  'pending',
  'medium',
  CURRENT_DATE
);

-- Update sequences again after test data
SELECT setval(pg_get_serial_sequence('guests', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM guests;
SELECT setval(pg_get_serial_sequence('rooms', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM rooms;
SELECT setval(pg_get_serial_sequence('reservations', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM reservations;
SELECT setval(pg_get_serial_sequence('maintenance_requests', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM maintenance_requests;

COMMIT;
