
-- FleetIQ AI Database Schema

-- Vehicles table
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plate_number text NOT NULL,
  make text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  year integer DEFAULT 2020,
  vehicle_type text NOT NULL DEFAULT 'truck',
  fuel_type text NOT NULL DEFAULT 'diesel',
  fuel_capacity numeric NOT NULL DEFAULT 200,
  current_fuel_level numeric NOT NULL DEFAULT 0,
  odometer numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  assigned_driver_id uuid,
  gps_device_id text DEFAULT '',
  last_lat numeric DEFAULT 0,
  last_lng numeric DEFAULT 0,
  last_location_update timestamptz,
  insurance_expiry date,
  service_due_date date,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

-- Fleet drivers table
CREATE TABLE public.fleet_drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  license_number text DEFAULT '',
  license_expiry date,
  pin text NOT NULL DEFAULT '0000',
  safety_score numeric NOT NULL DEFAULT 100,
  total_trips integer NOT NULL DEFAULT 0,
  total_distance numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  avatar_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fleet_drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on fleet_drivers" ON public.fleet_drivers FOR ALL USING (true) WITH CHECK (true);

-- Trips table
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES public.fleet_drivers(id) ON DELETE SET NULL,
  trip_code text NOT NULL,
  qr_code_data text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'assigned',
  origin_name text NOT NULL DEFAULT '',
  origin_lat numeric DEFAULT 0,
  origin_lng numeric DEFAULT 0,
  destination_name text NOT NULL DEFAULT '',
  destination_lat numeric DEFAULT 0,
  destination_lng numeric DEFAULT 0,
  planned_distance numeric DEFAULT 0,
  actual_distance numeric DEFAULT 0,
  planned_fuel numeric DEFAULT 0,
  actual_fuel numeric DEFAULT 0,
  cargo_type text DEFAULT '',
  cargo_weight numeric DEFAULT 0,
  start_time timestamptz,
  end_time timestamptz,
  estimated_arrival timestamptz,
  driver_pin_verified boolean NOT NULL DEFAULT false,
  qr_scanned boolean NOT NULL DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on trips" ON public.trips FOR ALL USING (true) WITH CHECK (true);

-- Trip waypoints / route tracking
CREATE TABLE public.trip_waypoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  speed numeric DEFAULT 0,
  heading numeric DEFAULT 0,
  fuel_level numeric DEFAULT 0,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trip_waypoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on trip_waypoints" ON public.trip_waypoints FOR ALL USING (true) WITH CHECK (true);

-- Fuel logs
CREATE TABLE public.fuel_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES public.fleet_drivers(id) ON DELETE SET NULL,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  fuel_amount numeric NOT NULL DEFAULT 0,
  fuel_cost numeric NOT NULL DEFAULT 0,
  odometer_reading numeric DEFAULT 0,
  fuel_type text DEFAULT 'diesel',
  station_name text DEFAULT '',
  receipt_url text DEFAULT '',
  log_type text NOT NULL DEFAULT 'refuel',
  notes text DEFAULT '',
  logged_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on fuel_logs" ON public.fuel_logs FOR ALL USING (true) WITH CHECK (true);

-- Fleet alerts
CREATE TABLE public.fleet_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES public.fleet_drivers(id) ON DELETE SET NULL,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  resolved_by text DEFAULT '',
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fleet_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on fleet_alerts" ON public.fleet_alerts FOR ALL USING (true) WITH CHECK (true);

-- Deliveries / proof of delivery
CREATE TABLE public.deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_phone text DEFAULT '',
  delivery_address text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  qr_verified boolean NOT NULL DEFAULT false,
  signature_url text DEFAULT '',
  photo_url text DEFAULT '',
  receiver_name text DEFAULT '',
  notes text DEFAULT '',
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on deliveries" ON public.deliveries FOR ALL USING (true) WITH CHECK (true);

-- Geofences
CREATE TABLE public.geofences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  center_lat numeric NOT NULL,
  center_lng numeric NOT NULL,
  radius_meters numeric NOT NULL DEFAULT 500,
  fence_type text NOT NULL DEFAULT 'allowed',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on geofences" ON public.geofences FOR ALL USING (true) WITH CHECK (true);

-- Driver behavior events
CREATE TABLE public.driver_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES public.fleet_drivers(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  lat numeric DEFAULT 0,
  lng numeric DEFAULT 0,
  speed numeric DEFAULT 0,
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.driver_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on driver_events" ON public.driver_events FOR ALL USING (true) WITH CHECK (true);

-- Maintenance records
CREATE TABLE public.maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL DEFAULT 'routine',
  description text NOT NULL DEFAULT '',
  cost numeric NOT NULL DEFAULT 0,
  odometer_at_service numeric DEFAULT 0,
  service_provider text DEFAULT '',
  next_service_date date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on maintenance_records" ON public.maintenance_records FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fleet_alerts;

-- Updated_at triggers
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fleet_drivers_updated_at BEFORE UPDATE ON public.fleet_drivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
