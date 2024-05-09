import Header from '../components/main/Header'
import Footer from '../components/shared/Footer'
import ImageSlider from '../components/main/ImageSlider'
import Image from 'next/image';
import mainBg from '../../public/assets/oldlogo.jpg'

function Loading() {
   const images = [
      "https://via.placeholder.com/400x200?text=Image1",
      "https://via.placeholder.com/400x200?text=Image2",
      "https://via.placeholder.com/400x200?text=Image3",
      // Add more image URLs as needed
    ];
  return (
    <>
    <Header />
      <main className='relative w-full h-auto pt-5'>
        <Image 
          src={mainBg} alt=''
          width={2000} height={2000}
          className='h-auto w-full opacity-40 absolute top-0 right-0 -z-10'
        />
        <h1
          className='text-3xl font-bold text-center mb-4'
        >
          Drawlys
          مرحبا بيك عندنا في
          
        </h1>
        <ImageSlider images={images} />
      </main>
    <Footer /> 
    </>
  )
}

export default Loading