-- Enable RLS for all tables by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public ENABLE ROW LEVEL SECURITY;

-- Table: guests
CREATE TABLE public.guests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: rooms
CREATE TABLE public.rooms (
    id SERIAL PRIMARY KEY,
    room_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- ex: 'Standard', 'Deluxe', 'Suite'
    beds TEXT NOT NULL, -- ex: 'Queen', 'Twin', 'King'
    capacity INTEGER NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'available' NOT NULL, -- ex: 'available', 'occupied', 'reserved', 'cleaning', 'maintenance'
    features TEXT[], -- ex: {'Wi-Fi', 'TV', 'AC', 'Breakfast'}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: reservations
CREATE TABLE public.reservations (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' NOT NULL, -- ex: 'pending', 'paid', 'partially_paid'
    payment_method TEXT, -- ex: 'credit_card', 'cash'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_out_after_check_in CHECK (check_out_date > check_in_date)
);

-- Table: maintenance_requests
CREATE TABLE public.maintenance_requests (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- ex: 'pending', 'in_progress', 'completed'
    priority TEXT DEFAULT 'medium' NOT NULL, -- ex: 'low', 'medium', 'high'
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Enable RLS for each table
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Assumed roles: 'admin', 'attendant'.
-- Replace 'authenticated' with specific role names if needed, or manage roles through Supabase Auth.

-- Policies for guests table
CREATE POLICY "Admin full access to guests"
ON public.guests
FOR ALL
TO authenticated -- Replace with your admin role if defined, e.g., 'admin_user_role'
USING (true)
WITH CHECK (true);

CREATE POLICY "Attendants can view and create guests"
ON public.guests
FOR SELECT
TO authenticated -- Replace with your attendant role, e.g., 'attendant_user_role'
USING (true);

CREATE POLICY "Attendants can insert guests"
ON public.guests
FOR INSERT
TO authenticated -- Replace with your attendant role
WITH CHECK (true);

-- Policies for rooms table
CREATE POLICY "Admin full access to rooms"
ON public.rooms
FOR ALL
TO authenticated -- Replace with your admin role
USING (true)
WITH CHECK (true);

CREATE POLICY "Attendants can view rooms"
ON public.rooms
FOR SELECT
TO authenticated -- Replace with your attendant role
USING (true);

CREATE POLICY "Attendants can update room status"
ON public.rooms
FOR UPDATE
TO authenticated -- Replace with your attendant role
USING (true) -- Consider restricting which statuses they can set
WITH CHECK (true); -- Consider restricting which statuses they can set

-- Policies for reservations table
CREATE POLICY "Admin full access to reservations"
ON public.reservations
FOR ALL
TO authenticated -- Replace with your admin role
USING (true)
WITH CHECK (true);

CREATE POLICY "Attendants can view reservations"
ON public.reservations
FOR SELECT
TO authenticated -- Replace with your attendant role
USING (true);

CREATE POLICY "Attendants can create reservations"
ON public.reservations
FOR INSERT
TO authenticated -- Replace with your attendant role
WITH CHECK (true);

-- Example: Guests can view their own reservations (conceptual, requires linking guests to auth.users)
-- This assumes you have a way to link `auth.uid()` to a `guest_id`.
-- For example, if your `guests` table had a `user_id UUID REFERENCES auth.users(id)` column:
-- CREATE POLICY "Guests can view their own reservations"
-- ON public.reservations
-- FOR SELECT
-- TO authenticated
-- USING (guest_id = (SELECT id FROM public.guests WHERE user_id = auth.uid()));

-- Policies for maintenance_requests table
CREATE POLICY "Admin full access to maintenance_requests"
ON public.maintenance_requests
FOR ALL
TO authenticated -- Replace with your admin role
USING (true)
WITH CHECK (true);

CREATE POLICY "Attendants can view maintenance_requests"
ON public.maintenance_requests
FOR SELECT
TO authenticated -- Replace with your attendant role
USING (true);

CREATE POLICY "Attendants can create maintenance_requests"
ON public.maintenance_requests
FOR INSERT
TO authenticated -- Replace with your attendant role
WITH CHECK (true);

CREATE POLICY "Attendants can update maintenance_request status to completed"
ON public.maintenance_requests
FOR UPDATE
TO authenticated -- Replace with your attendant role
USING (status = 'completed')
WITH CHECK (status = 'completed');

-- Grant basic usage for the schema and sequences to authenticated users.
-- This is often necessary for RLS to function correctly with SERIAL PKs.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- For admins, grant all on sequences if they need to manually set IDs (generally not recommended)
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin_user_role;
