import { useParams, useLocation } from 'react-router-dom';
import { fetchFilteredRooms } from '../../../api/filterApi';
import React, { useEffect, useState } from 'react';

const SearchResultPage = () => {
  const { location, propertyType, priceRange, area } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get('q');

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFilteredRooms({
        location,
        propertyType,
        priceRange,
        area,
        keyword,
      });
      setRooms(data);
      console.log('Filtered rooms:', data);
    };

    fetchData();
  }, [location, propertyType, priceRange, area, keyword]);

  return (
    <div>
      <h2>Kết quả tìm kiếm</h2>
      {Array.isArray(rooms) ? (
  rooms.map((room, index) => (
    <div key={index}>
      <h3>{room.room_name}</h3>
      <p>Giá: {room.price_per_month}</p>
      <p>Địa điểm: {room.address}</p>
    </div>
  ))
) : (
  <div>
    <h3>{rooms?.room_name}</h3>
    <p>Giá: {rooms?.price_per_month}</p>
    <p>Địa điểm: {rooms?.address}</p>
  </div>
)}
    </div>
  );
};
export default SearchResultPage;
