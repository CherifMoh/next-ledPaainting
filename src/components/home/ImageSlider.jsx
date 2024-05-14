'use client'
import Image from "next/image";
import { useState, useEffect } from "react";

import '../../styles/shared/slide.css'


const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageChangingLeft, setIsImageChangingLeft] = useState(false);
  const [isImageChangingRight, setIsImageChangingRight] = useState(false);

  const [isHeld, setIsHeld] = useState(false);
  const [start, setStart] = useState(0);

  const [intervalIdS, setIntervalIdS] = useState(false);

  // useEffect(() => {
  //   const intervalId = setInterval(intervalFun, 4000);
  //   setIntervalIdS(intervalId)

  //   return () => clearInterval(intervalId);
  // }, [images]);



  const prevIndex2 = (currentIndex - 2 + images.length) % images.length;
  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;
  const nextIndex2 = (currentIndex + 2) % images.length;

  function intervalFun() {
    setIsImageChangingRight(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsImageChangingRight(false);
    }, 1000); // Wait for 300ms before changing the image
  }

  function changeImage(imageIndex, l) {
    clearInterval(intervalIdS);
    l === 'l' ? setIsImageChangingLeft(true) : setIsImageChangingRight(true)
    setTimeout(() => {
      setCurrentIndex(imageIndex);
      l === 'l' ? setIsImageChangingLeft(false) : setIsImageChangingRight(false);
    }, 1000); // Wait for 300ms before changing the image
    const intervalId = setInterval(intervalFun, 4000)
    setIntervalIdS(intervalId)
  }

  const handleMouseDown = (e) => {
    setStart(e.pageX)
    setIsHeld(true);
  };

  const handleMouseUp = () => {
    setIsHeld(false);
  };

  const handleMouseMove = (e) => {
    if (!isHeld) return;
    if (isImageChangingLeft) return;
    if (isImageChangingRight) return;


    const mouseX = e.pageX - start;


    if (mouseX <= 200 && mouseX > 0) {
      changeImage(prevIndex, 'l');

    } else if (mouseX >= -200 && mouseX < 0) {

      changeImage(nextIndex, 'r');
    }
  };



  return (
    <div
      className={`flex justify-center items-center relative gap-8
        ${isImageChangingRight && ' md:-translate-x-[calc(25%+32px)] -translate-x-[calc(37.5%+32px)]  transition-all duration-1000'} 
        ${isImageChangingLeft && ' md:translate-x-[calc(25%+32px)] translate-x-[calc(37.5%+32px)]  transition-all duration-1000'} 
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <img
        // height={2000} width={1000}
        className={`w-1/2 md:w-1/3 h-auto rounded-2xl 
        ${isImageChangingRight && 'opacity-0'} 
         ${isImageChangingLeft ? ' scale-50 opacity-100 transition-all duration-200 blur-[2px]' : 'opacity-0'} 
        `}
        src={images[prevIndex2]}
        alt="Previous 2"
        draggable="false"
      />
      <img
        // height={2000} width={2000}
        className={`w-1/4 md:w-1/6 h-auto rounded-lg blur-[1px] 
          ${isImageChangingRight && 'scale-50 transition-all duration-500 opacity-0'}
          ${isImageChangingLeft && 'scale-[2]  transition-all duration-1000 blur-0'}
        `}
        src={images[prevIndex]}
        onClick={() => changeImage(prevIndex, 'l')}
        alt="Previous"
        draggable="false"
      />

      <img
        // height={2000} width={1000}
        className={`w-1/2 md:w-1/3 h-auto rounded-2xl  
         ${isImageChangingRight && ' scale-50  transition-all duration-1000 blur-[2px]'} 
         ${isImageChangingLeft && ' scale-50  transition-all duration-1000 blur-[2px'} 
        `}
        src={images[currentIndex]}
        alt="Main"
        draggable="false"
      />

      <img
        // height={2000} width={2000}
        className={`w-1/4 md:w-1/6 h-auto rounded-lg blur-[1px] 
          ${isImageChangingLeft && 'scale-50 transition-all duration-500 opacity-0'}
          ${isImageChangingRight && 'scale-[2]  transition-all duration-1000 blur-0'}
        `}
        src={images[nextIndex]}
        onClick={() => changeImage(nextIndex, 'r')}
        alt="Next"
        draggable="false"
      />

      <img
        // height={2000} width={2000}
        className={`w-1/2 md:w-1/3 h-auto rounded-lg  blur-[2px] 
          ${isImageChangingRight ? 'scale-50 transition-all duration-200 opacity-100' : ' opacity-0 '}
          ${isImageChangingLeft && ' opacity-0 '}
        `}
        src={images[nextIndex2]}
        alt="Next 2"
        draggable="false"
      />
    </div>
  );

};

export default ImageSlider;

