import React, { useEffect, useRef } from "react";

const DEFAULT_LOCATION = { lat: 21.028511, lng: 105.804817 }; // Hà Nội

const formatPrice = (price) => {
  return price?.toLocaleString("vi-VN") + " đ";
};

const GoogleMapComponent2 = ({ locations = [] }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let checkGoogleMaps;
    let markers = [];
    let bounds = null;

    const initMap = () => {
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: DEFAULT_LOCATION,
          zoom: 5,
        });
        console.log("✅ Google Map đã khởi tạo");
        mapInstance.current = map;
      }
    };

    const clearMarkers = () => {
      markers.forEach((marker) => marker.setMap(null));
      markers = [];
    };

    const geocodeLocations = async (locationList) => {
      const geocoder = new window.google.maps.Geocoder();
      bounds = new window.google.maps.LatLngBounds();

      console.log("📌 Danh sách địa chỉ cần geocode:", locationList);

      for (const { address, price } of locationList) {
        if (!address) {
          console.warn("⚠️ Địa chỉ bị thiếu hoặc null:", { address, price });
          continue;
        }

        console.log("🔍 Đang geocode:", address, "với giá:", price);

        await new Promise((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            console.log("📬 Kết quả geocode:", results, "Trạng thái:", status);

            if (status === "OK" && results.length > 0) {
              const location = results[0].geometry.location;

              const marker = new window.google.maps.Marker({
                position: location,
                map: mapInstance.current,
                title: address,
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div><strong>${address}</strong><br/>Giá: <span style="color:green">${formatPrice(price)}</span></div>`,
              });

              marker.addListener("click", () => {
                infoWindow.open(mapInstance.current, marker);
              });

              markers.push(marker);
              bounds.extend(location);
            } else {
              console.warn(`❌ Không tìm thấy vị trí cho: "${address}". Trạng thái: ${status}`);
            }
            resolve();
          });
        });
      }

      if (!bounds.isEmpty()) {
        mapInstance.current.fitBounds(bounds);
        console.log("📌 Tự động zoom để hiển thị tất cả vị trí");
      } else {
        console.warn("⚠️ Không có vị trí hợp lệ nào để vẽ trên bản đồ.");
      }
    };

    const loadMap = async () => {
      initMap();
      if (locations.length > 0) {
        await geocodeLocations(locations);
      } else {
        console.warn("⚠️ Không có địa chỉ nào được truyền vào.");
      }
    };

    checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkGoogleMaps);
        loadMap();
      }
    }, 100);

    return () => {
      clearInterval(checkGoogleMaps);
      clearMarkers();
    };
  }, [locations]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
      }}
    />
  );
};

export default GoogleMapComponent2;
