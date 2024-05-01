'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


const OrdersLineChart = () => {

  const data = [
    { day: 'Monday', temperature: 70 },
    { day: 'Tuesday', temperature: 75 },
    { day: 'Wednesday', temperature: 80 },
    { day: 'Thursday', temperature: 78 },
    { day: 'Friday', temperature: 85 },
    { day: 'Saturday', temperature: 88 },
    { day: 'Sunday', temperature: 82 },
  ];

  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="temperature" stroke="#8884d8" dot={false} activeDot={{ r: 8 }} />
    </LineChart>
  );
}

export default OrdersLineChart;
