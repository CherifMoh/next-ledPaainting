
import Header from '../components/home/Header'
import Footer from '../components/shared/Footer'
import SliderSkeleton from '../components/loadings/SliderSkeleton'
import Image from 'next/image';
import mainBg from '../../public/assets/oldlogo.jpg'

import brownSide from '../../public/assets/brownSide.png'
import blueSide from '../../public/assets/blueSide.png'


function Loading() {

  const myArray = [1, 2]
  const SkeletonElement = myArray?.map(num => {
    return (
      <div key={num} className='md:mt-48 mt-28 gap-4 flex flex-col items-center justify-center'>
        <div className="h-12 bg-gray-300 rounded-full mb-4 animate-pulse w-48"></div>
        <SliderSkeleton />
        <button
          className='bg-[#4B3724] opacity-55 text-white text-lg md:text-3xl px-6 py-2 rounded-full'
        >
          المزيد
        </button>
      </div>
    )
  })

  return (
    <>
      <Header />
      <main className='relative w-full h-auto pt-5'>
        <Image
          src={mainBg} alt=''
          width={2000} height={2000}
          className='h-auto w-full opacity-40 absolute lg:-top-64 md:-top-32 -top-10 right-0 -z-20'
        />
        <h1
          className='text-3xl font-bold text-center mb-4'
        >
          Drawlys
          مرحبا بيك عندنا في

        </h1>
        <SliderSkeleton />
      </main>
      <section className='md:mt-8 mt-4 relative'>
        <h1
          className='md:text-5xl text-4xl font-bold text-center mb-4'
        >
          اكتشف كل منتجاتنا

        </h1>
        <Image
          src={blueSide} alt=''
          height={120} width={120}
          className='absolute -top-16 -left-20'
        />
        <Image
          src={brownSide} alt=''
          height={120} width={120}
          className='absolute -top-6 -right-16'
        />
        {SkeletonElement}
      </section>
      <Footer />
    </>
  )
}

export default Loading