// import React, { useEffect, useRef } from "react";

// const GoogleMapComponent = ({ address }) => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     // const initMap = (location) => {
//     //   if (mapRef.current) {
//     //     const map = new window.google.maps.Map(mapRef.current, {
//     //       center: location,
//     //       zoom: 18,
//     //     });

//     //     new window.google.maps.Marker({
//     //       position: location,
//     //       map: map,
//     //       title: address || "Hà Nội",
//     //     });
//     //   }
//     // };
//     const initMap = (location) => {
//       console.log("Init map with location:", location);
    
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: location.lat || location.lat(), lng: location.lng || location.lng() },
//         zoom: 18,
//       });
    
//       new window.google.maps.Marker({
//         position: { lat: location.lat || location.lat(), lng: location.lng || location.lng() },
//         map,
//       });
//     };
    

//     const geocodeAddress = (address) => {
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address: address }, (results, status) => {
//         if (status === "OK" && results.length > 0) {
//           const location = results[0].geometry.location;
//           initMap(location);
//         } else {
//           console.error("Không tìm thấy địa chỉ hoặc lỗi geocoding:", status);
//           initMap({ lat: 21.028511, lng: 105.804817 });
//         }
//       });
//     };

//     const checkGoogleMaps = setInterval(() => {
//       if (window.google && window.google.maps) {
//         clearInterval(checkGoogleMaps);
//         if (address) {
//           geocodeAddress(address);
//         } else {
//           initMap({ lat: 21.028511, lng: 105.804817 });
//         }
//       }
//     }, 100);
//     return () => clearInterval(checkGoogleMaps);
//   }, [address]);

//   return (
//     <div
//       ref={mapRef}
//       style={{
//         width: "100%",
//         height: "400px",
//         border: "1px solid black",
//         borderRadius: "10px",
//       }}
//     />
//   );
// };

// export default GoogleMapComponent;

import React, { useEffect, useRef } from "react";

const GoogleMapComponent = ({ address,style = {}, className = ""  }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    console.time("[MapComponent] Load Time");

    console.log("[MapComponent] Address received:", address);

    const initMap = (location) => {
      console.log("[MapComponent] Initializing map with location:", location);

      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 18,
        });

        new window.google.maps.Marker({
          position: location,
          map,
          
          title: address || "Hà Nội",
        });

        console.log("[MapComponent] Map and marker created successfully.");
        console.timeEnd("[MapComponent] Load Time"); // Đo thời gian từ lúc bắt đầu tới khi map được tạo
      } else {
        console.warn("[MapComponent] mapRef.current is null");
      }
    };

    const geocodeAddress = (address) => {
      console.log("[MapComponent] Geocoding address:", address);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        console.log("[MapComponent] Geocode status:", status);
        console.log("[MapComponent] Geocode results:", results);

        if (status === "OK" && results.length > 0) {
          const location = results[0].geometry.location;
          initMap(location);
        } else {
          console.error("[MapComponent] Geocoding failed:", status);
          initMap({ lat: 21.028511, lng: 105.804817 }); // fallback to Hanoi
        }
      });
    };

    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        console.log("[MapComponent] Google Maps API loaded.");
        clearInterval(checkGoogleMaps);
        if (address) {
          geocodeAddress(address);
        } else {
          initMap({ lat: 21.028511, lng: 105.804817 }); // fallback to Hanoi
        }
      } else {
        console.log("[MapComponent] Waiting for Google Maps API...");
      }
    }, 100);

    return () => clearInterval(checkGoogleMaps);
  }, [address]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{
        width: "80%",
        height: "400px",
        border: "20px",
        borderRadius: "20px",
        ...style, // ghi đè nếu có props truyền vào
      }}
    />
  );
};

export default GoogleMapComponent;

