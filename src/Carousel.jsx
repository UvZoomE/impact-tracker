import React, { useState } from 'react';
import './css/Carousel.css';

const Carousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log(images);

  const totalSlides = images.length;

  const moveSlide = (direction) => {
    setCurrentSlide((prevSlide) => (prevSlide + direction + totalSlides) % totalSlides);
  };

  return (
    <div className="carousel-container" style={{ width: `${images[currentSlide].width}px` }}>
      <div className="carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img
              src={image.secure_url}
              alt={`Slide ${index + 1}`}
              width={image.width}
              height={image.height}
            />
          </div>
        ))}
      </div>
      <button className="prev-btn" onClick={() => moveSlide(-1)}>
        &#10094;
      </button>
      <button className="next-btn" onClick={() => moveSlide(1)}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;




