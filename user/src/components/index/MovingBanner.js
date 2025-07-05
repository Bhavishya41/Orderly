import React from "react";

export default function MovingBanner({ images = [] }) {
  return (
    <div
      className="w-full overflow-hidden pointer-events-none select-none flex items-center mb-24"
      style={{
        position: "relative",
        zIndex: 50,
      }}
    >
      <div className="marquee-track flex gap-12">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Product"
            className="h-56 w-56 object-cover rounded-2xl shadow-lg border border-gray-100"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
} 