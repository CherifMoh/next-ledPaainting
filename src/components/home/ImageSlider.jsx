'use client'
import Image from "next/image";
import { useState, useEffect } from "react";

import '../../styles/shared/slide.css'


const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageChanging, setIsImageChanging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsImageChanging(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsImageChanging(false);
      }, 1000); // Wait for 300ms before changing the image
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);


  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;
  const nextIndex2 = (currentIndex + 2) % images.length;

  return (
    <div className={`flex justify-center items-center relative gap-8 ${isImageChanging ? 'md:-translate-x-[calc(7%+32px)] -translate-x-[calc(7.4%+32px)]  transition-all duration-1000' : 'md:translate-x-[18%] translate-x-[30%]'} `}>
      <img
        // height={2000} width={2000}
        className={`w-1/4 md:w-1/6 h-auto rounded-lg blur-[1px] ${isImageChanging ? 'transition-all duration-400 opacity-0' : ' '}`}
        src={images[prevIndex]}
        onClick={() => setCurrentIndex(prevIndex)}
        alt="Previous"
      />

      <img
        // height={2000} width={1000}
        className={`w-1/2 md:w-1/3 h-auto rounded-2xl  ${isImageChanging ? ' scale-50  transition-all duration-1000 blur-[2px]' : ' opacity-100'} `}
        src={images[currentIndex]}
        alt="Main"
      />

      <img
        // height={2000} width={2000}
        className={`w-1/4 md:w-1/6 h-auto rounded-lg  ${isImageChanging ? ' scale-[2]  transition-all duration-1000' : ' blur-[1px]'}`}
        src={images[nextIndex]}
        onClick={() => setCurrentIndex(nextIndex)}
        alt="Next"
      />
      <img
        // height={2000} width={2000}
        className={`w-1/2 md:w-1/3 h-auto rounded-lg  blur-[2px] ${isImageChanging ? 'scale-50  transition-all duration-200 opacity-100' : 'opacity-0'}`}
        src={images[nextIndex2]}
        onClick={() => setCurrentIndex(nextIndex2)}
        alt="Next"
      />
    </div>
  );

};

export default ImageSlider;

