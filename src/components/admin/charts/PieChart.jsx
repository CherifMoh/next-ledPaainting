'use client'
import { PieChart, Pie, Tooltip, Legend  } from 'recharts';

function PieChartC() {

  const data =[
    { name: 'Category 1', value: 35, color:'#FF0000' },
    { name: 'Category 2', value: 25, color:'#00FF00' },
    { name: 'Category 3', value: 40, color:'#0000FF'},
  ];


  return (
    <div className='flex justify-center items-center'>
       <PieChart width={300} height={300}>
        <Pie 
         data={data} 
         dataKey="value" 
         nameKey="name" 
         cx="50%" 
         cy="50%" 
         outerRadius={50} fill="#000000"
         label={(entry) => entry.name} 
        />
        <Tooltip />
      </PieChart>
    </div>
  )
}

export default PieChartC;