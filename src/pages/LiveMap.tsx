import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FleetLayout from "@/components/FleetLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Truck } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

const LiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("vehicles").select("*").eq("user_id", DEMO_USER_ID).then(({ data }) => setVehicles(data || []));
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (!token) { setMapError("Map token not configured"); return; }

    try {
      mapboxgl.accessToken = token;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [36.82, -1.29],
        zoom: 10,
      });
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      vehicles.forEach((v) => {
        if (v.last_lat && v.last_lng) {
          new mapboxgl.Marker({ color: "#0070f3" })
            .setLngLat([Number(v.last_lng), Number(v.last_lat)])
            .setPopup(new mapboxgl.Popup().setHTML(`<b>${v.plate_number}</b><br/>${v.status}`))
            .addTo(map.current!);
        }
      });
    } catch { setMapError("Failed to load map"); }

    return () => { map.current?.remove(); };
  }, [vehicles]);

  if (mapError) {
    return (
      <FleetLayout>
        <Card><CardContent className="p-8 text-center"><MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground">{mapError}</p></CardContent></Card>
      </FleetLayout>
    );
  }

  return (
    <FleetLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Live Fleet Map</h1>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles tracked</p>
        </div>
        <div className="relative w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden border">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </div>
    </FleetLayout>
  );
};

export default LiveMap;
