'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

async function fetchTrackingOrders() {
  const res = await axios.get('/api/orders/tracking');
  return res.data;
}


function PieChartC() {

  const { data: Orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders Tracking'],
    queryFn: fetchTrackingOrders
  });

  if (isLoading) return <div>Loading Chart ...</div>;
  if (isError) return <div>Error fetching Orders: {error.message}</div>;


  const Delevred = Orders.filter(order => order.tracking === 'delivered');
  const Retour = Orders.filter(order => order.tracking === 'returned');

  const delevredPercent = Math.floor((Delevred.length / (Delevred.length + Retour.length)) * 100);
  const retourPercent = Math.floor((Retour.length / (Delevred.length + Retour.length)) * 100);

  const data = [
    { name: 'Delevred %', value: delevredPercent, color: '#66FF66' },
    { name: 'Retour %', value: retourPercent, color: '#FF6666' },
  ];


  return (
    <div className='flex justify-center items-center'>
      <PieChart width={500} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        // label={(entry) => entry.name}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
        />
      </PieChart>
    </div>
  )
}

export default PieChartC;