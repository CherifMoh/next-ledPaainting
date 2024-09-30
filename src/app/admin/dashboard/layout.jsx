
export default function Layout({ children, sales, customers, activeP, ordersChart, ordersPieChart, ordersTimeChart }) {
  return (
    <main className='bg-white p-4'>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sales}
          {customers}
          {activeP}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ordersTimeChart}
        {ordersPieChart}
      </section>

      {children}
    </main>

  )
}