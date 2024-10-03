import React from 'react';

const ImageCarousel = () => {
  const images = [
'https://adineh.market/wp-content/uploads/2024/06/gaj-1.png',
'https://adineh.market/wp-content/uploads/2024/06/farzanegan-1.png',
'https://adineh.market/wp-content/uploads/2024/06/kahe-1.png',
'https://adineh.market/wp-content/uploads/2024/06/karnameh-ketab-1.png',
'https://adineh.market/wp-content/uploads/2024/06/andishe-kharazmi-1.png'
  ];

  return (
    <div className="carousel-container">
      <div className="carousel-slider space-x-28 ">
        {images.map((image, index) => (
          <button key={index} className="carousel-item">
            <img src={image} alt={`carousel-${index}`} className='h-18 w-28'/>
          </button>
        ))}

        {images.map((image, index) => (
          <button key={`duplicate-${index}`} className="carousel-item">
            <img src={image} alt={`carousel-${index}`} className='h-18 w-28'/>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
