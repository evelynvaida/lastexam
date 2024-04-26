

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

const QuerySchema = z.object({
  min: z.number(),
  max: z.number(),
});

const App = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const validationResult = QuerySchema.safeParse({ min: +minPrice, max: +maxPrice });
      if (!validationResult.success) {
        setError('Please provide valid min and max prices.');
        return;
      }

      const { min, max } = validationResult.data;

      const response = await fetch(`/api/hotels?min=${min}&max=${max}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      setHotels(data);
    } catch (error) {
      setError('Error fetching hotels data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!minPrice || !maxPrice) {
      setError('Please provide both min and max prices.');
      return;
    }

    setError('');
    await fetchData();
  };

  return (
    <div className= "min-h-screen flex flex-col items-center justify-center bg-gray-100" >
    <div className="card bg-white p-8 rounded-lg shadow-lg" >
      <div className="grid grid-cols-2 gap-4 mb-4" >
        <input
            placeholder="Min Price"
  value = { minPrice }
  onChange = {(e) => setMinPrice(e.target.value)}
type = "number"
className = "input input-bordered"
  />
  <input
            placeholder="Max Price"
value = { maxPrice }
onChange = {(e) => setMaxPrice(e.target.value)}
type = "number"
className = "input input-bordered"
  />
  </div>
  < button onClick = { handleSearch } className = "btn btn-primary w-full" >
    Search
    < /button>
{
  error && <div className="text-red-500 mt-4" > { error } < /div>}
    < div className = "mt-4" >
      <h2 className="text-xl font-bold mb-2" > Hotels: </h2>
        <ul>
  {
    hotels.map((hotel, index) => (
      <li key= { index } className = "mb-2" >
      { hotel.name } - ${ hotel.pricePerNightInUSD }
    < /li>
    ))
  }
  </ul>
    < /div>
    < /div>
    < /div>
  );
};

export default App;