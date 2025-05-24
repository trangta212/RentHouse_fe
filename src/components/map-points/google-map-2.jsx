import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ob2FuZzEyMyIsImEiOiJjbWF3MG0xbDYwYXA2MnFwbGx5YnNuZGZjIn0.3ovuGpDGiTbLZM6oBW3bDA';


const DEFAULT_LOCATION = [105.804817, 21.028511]; // Hà Nội [lng, lat]

const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN") + " đ";
};

const MapboxComponent2 = ({ locations = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const bounds = useRef(new mapboxgl.LngLatBounds());

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: DEFAULT_LOCATION,
        zoom: 5,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    const geocodeAddress = async (address) => {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      return data.features?.[0]?.center || null;
    };

    const addMarkers = async () => {
      bounds.current = new mapboxgl.LngLatBounds();

      for (const { address, price } of locations) {
        if (!address) continue;

        const location = await geocodeAddress(address);
        if (location) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>${address}</strong><br/>
            Giá: <span style="color:green">${formatPrice(price)}</span>
          `);

          new mapboxgl.Marker()
            .setLngLat(location)
            .setPopup(popup)
            .addTo(mapRef.current);

          bounds.current.extend(location);
        } else {
          console.warn("❌ Không tìm thấy tọa độ cho:", address);
        }
      }

      if (!bounds.current.isEmpty()) {
        mapRef.current.fitBounds(bounds.current, { padding: 40 });
      }
    };

    if (mapRef.current && locations.length > 0) {
      addMarkers();
    }

    return () => {
      // Cleanup map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
      }}
    />
  );
};

export default MapboxComponent2;
