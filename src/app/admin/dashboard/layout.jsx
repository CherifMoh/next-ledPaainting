'use  client'
export default function Layout({ children ,sales, customers, activeP }) {
  return (
      <main className='bg-white'>
        <section className='p-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sales}
            {customers}
            {activeP}
          </div>
        </section>

        {children} 
      </main>
      
  )
}