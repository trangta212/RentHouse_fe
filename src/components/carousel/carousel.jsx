import { Carousel } from 'antd';
import React from 'react';

const CarouselComponent = ({ images = [], width = "100%", height = "55vh", borderRadius = "0px" }) => {
  // Đảm bảo images là mảng, nếu không thì gán thành mảng rỗng
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <div style={{ width: width }}>
      <Carousel arrows infinite={false}>
        {safeImages.map((imgSrc, index) => (
          <div key={index}>
            <img
              src={imgSrc}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: height,
                objectFit: "cover",
                borderRadius: borderRadius,
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;

