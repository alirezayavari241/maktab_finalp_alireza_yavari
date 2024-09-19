import React, { useState, useEffect } from 'react';
const ImageSlider = () => {
  const images = [
    'https://cdn.fidibo.com/phoenixpub/images/flex/general/5238e33d-2062-485e-9fc3-73356a55a447.jpg',
    'https://cdn.fidibo.com/phoenixpub/images/flex/general/5f6817cd-d279-4ee4-abc3-77bf475884c1.jpg',
    'https://cdn.fidibo.com/phoenixpub/images/flex/general/829f7094-a837-4481-bc26-570a7f30e81c.png',
  ];

 
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000); // تغییر هر 3 ثانیه

    return () => clearInterval(intervalId); // پاک کردن تایمر هنگام unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full  mx-auto overflow-hidden h-full">
      <div 
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div className="flex-shrink-0 w-full" key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
      >
        ❯
      </button>
      <div className="flex justify-center mt-2 w-full">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full mx-1 cursor-pointer ${
              currentIndex === index ? 'bg-textcolot' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;