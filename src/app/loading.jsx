import Header from '../components/home/Header'
import Footer from '../components/shared/Footer'
import SliderSkeleton from '../components/loadings/SliderSkeleton'
import Image from 'next/image';
import mainBg from '../../public/assets/oldlogo.jpg'


function Loading() {

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
        <SliderSkeleton />
      </main>
      <Footer />
    </>
  )
}

export default Loading