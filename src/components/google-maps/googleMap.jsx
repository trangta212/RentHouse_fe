
// import React, { useEffect, useRef } from "react";

// const GoogleMapComponent = ({ address,style = {}, className = ""  }) => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     console.time("[MapComponent] Load Time");

//     console.log("[MapComponent] Address received:", address);

//     const initMap = (location) => {
//       console.log("[MapComponent] Initializing map with location:", location);

//       if (mapRef.current) {
//         const map = new window.google.maps.Map(mapRef.current, {
//           center: location,
//           zoom: 18,
//         });

//         new window.google.maps.Marker({
//           position: location,
//           map,
          
//           title: address || "Hà Nội",
//         });

//         console.log("[MapComponent] Map and marker created successfully.");
//         console.timeEnd("[MapComponent] Load Time"); // Đo thời gian từ lúc bắt đầu tới khi map được tạo
//       } else {
//         console.warn("[MapComponent] mapRef.current is null");
//       }
//     };

//     const geocodeAddress = (address) => {
//       console.log("[MapComponent] Geocoding address:", address);

//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address: address }, (results, status) => {
//         console.log("[MapComponent] Geocode status:", status);
//         console.log("[MapComponent] Geocode results:", results);

//         if (status === "OK" && results.length > 0) {
//           const location = results[0].geometry.location;
//           initMap(location);
//         } else {
//           console.error("[MapComponent] Geocoding failed:", status);
//           initMap({ lat: 21.028511, lng: 105.804817 }); // fallback to Hanoi
//         }
//       });
//     };

//     const checkGoogleMaps = setInterval(() => {
//       if (window.google && window.google.maps) {
//         console.log("[MapComponent] Google Maps API loaded.");
//         clearInterval(checkGoogleMaps);
//         if (address) {
//           geocodeAddress(address);
//         } else {
//           initMap({ lat: 21.028511, lng: 105.804817 }); // fallback to Hanoi
//         }
//       } else {
//         console.log("[MapComponent] Waiting for Google Maps API...");
//       }
//     }, 100);

//     return () => clearInterval(checkGoogleMaps);
//   }, [address]);

//   return (
//     <div
//       ref={mapRef}
//       className={className}
//       style={{
//         width: "80%",
//         height: "400px",
//         border: "20px",
//         borderRadius: "20px",
//         ...style, // ghi đè nếu có props truyền vào
//       }}
//     />
//   );
// };

// export default GoogleMapComponent;

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ob2FuZzEyMyIsImEiOiJjbWF3MG0xbDYwYXA2MnFwbGx5YnNuZGZjIn0.3ovuGpDGiTbLZM6oBW3bDA'; // Thay bằng token thật
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapboxMapComponent = ({ address, style = {}, className = "" }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    console.time("[MapboxComponent] Load Time");
    console.log("[MapboxComponent] Address received:", address);

    let map;

    const initMap = (lngLat) => {
      if (mapRef.current) {
        map = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: lngLat,
          zoom: 16,
        });

        new mapboxgl.Marker().setLngLat(lngLat).addTo(map);

        console.log("[MapboxComponent] Map and marker created successfully.");
        console.timeEnd("[MapboxComponent] Load Time");
      } else {
        console.warn("[MapboxComponent] mapRef.current is null");
      }
    };

    const geocodeAddress = async (address) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        console.log("[MapboxComponent] Geocode response:", data);

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].geometry.coordinates;
          initMap([lng, lat]);
        } else {
          console.warn("[MapboxComponent] No results found, fallback to Hanoi.");
          initMap([105.804817, 21.028511]); // fallback to Hanoi
        }
      } catch (error) {
        console.error("[MapboxComponent] Geocoding error:", error);
        initMap([105.804817, 21.028511]); // fallback to Hanoi
      }
    };

    if (address) {
      geocodeAddress(address);
    } else {
      initMap([105.804817, 21.028511]); // fallback to Hanoi
    }

    return () => {
      if (map) map.remove();
    };
  }, [address]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{
        width: "80%",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        ...style,
      }}
    />
  );
};

export default MapboxMapComponent;
