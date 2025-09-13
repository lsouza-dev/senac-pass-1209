import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const BarChartComponent = ({title,data,keys}:{title:string,data:any,keys:[string,string]}) => {
  return (<>
  <h2 className='text-2xl font-semibold'>{title}</h2>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
        }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={keys[0]} stackId="a" fill="var(--color-rosa)" />
        <Bar dataKey={keys[1]} stackId="a" fill="var(--color-azul)" />
      </BarChart>
    </ResponsiveContainer>
          </>
  );
};

export default BarChartComponent;
