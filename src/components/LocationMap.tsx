import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const LocationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    
    if (!MAPBOX_TOKEN) {
      setMapError('Map configuration in progress. Please refresh the page.');
      return;
    }

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      // Roysambu coordinates (next to Shell Petrol Station)
      const coordinates: [number, number] = [36.8915, -1.2369];
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 15,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker for the shop location
      const marker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              '<h3 style="font-weight: bold; margin-bottom: 4px;">Rhodium Ventures PhoneRepair</h3>' +
              '<p style="margin: 0;">Roysambu - Next to Shell Petrol Station</p>' +
              '<p style="margin: 4px 0 0 0; font-size: 12px;">📞 0721993234</p>'
            )
        )
        .addTo(map.current);

      // Open popup by default
      marker.togglePopup();

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Unable to load map. Please try again later.');
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  if (mapError) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{mapError}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Location: Roysambu, Nairobi - Next to Shell Petrol Station
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default LocationMap;
