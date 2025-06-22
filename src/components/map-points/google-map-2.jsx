import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ob2FuZzEyMyIsImEiOiJjbWF3MG0xbDYwYXA2MnFwbGx5YnNuZGZjIn0.3ovuGpDGiTbLZM6oBW3bDA';

const DEFAULT_LOCATION = [105.804817, 21.028511]; // Hà Nội

const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN") + " đ";
};

const MapboxComponent2 = ({ locations = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const bounds = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: DEFAULT_LOCATION,
          zoom: 5,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        mapRef.current.on("load", () => {
          if (locations.length > 0) {
            addMarkers();
          }
        });
      }
    };

    const geocodeAddress = async (address) => {
      if (!address) return null;
      
      try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
          )}.json?access_token=${mapboxgl.accessToken}&country=VN`
      );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
      const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          return data.features[0].center;
        }
        
        console.warn(`No results found for address: ${address}`);
        return null;
      } catch (error) {
        console.error(`Error geocoding address: ${address}`, error);
        return null;
      }
    };

    const addMarkers = async () => {
      if (!mapRef.current || !isMounted) return;

      bounds.current = new mapboxgl.LngLatBounds();
      let validLocations = 0;

      const markerPromises = locations.map(async ({ address, price }) => {
        if (!address) return;

        const location = await geocodeAddress(address);
        if (location && mapRef.current) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>${address}</strong><br/>
            Giá: <span style="color:green">${formatPrice(price)}</span>
          `);

          new mapboxgl.Marker()
            .setLngLat(location)
            .setPopup(popup)
            .addTo(mapRef.current);

          bounds.current.extend(location);
          validLocations++;
        }
      });

      await Promise.all(markerPromises);

      if (validLocations > 0 && !bounds.current.isEmpty() && mapRef.current) {
        mapRef.current.fitBounds(bounds.current, { 
          padding: 40,
          maxZoom: 15 // Giới hạn zoom tối đa để tránh zoom quá gần
        });
      } else if (mapRef.current) {
        // Nếu không có địa chỉ nào hợp lệ, zoom về vị trí mặc định
        mapRef.current.flyTo({
          center: DEFAULT_LOCATION,
          zoom: 5
        });
      }
    };

    initMap();

    return () => {
      isMounted = false;
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
