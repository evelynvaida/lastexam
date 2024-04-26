import { useState } from 'react';
import { z } from 'zod';
import { Header } from './components/Header';

const HotelSchema = z.object({
      id: z.number(),
      name: z.string(),
      pricePerNightInUSD: z.number(),
  })

const QuerySchema = z.object({
  min: z.number(),
  max: z.number(),
});

const App = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hotels, setHotels] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    try {
      const validationResult = QuerySchema.safeParse({
        min: +minPrice,
        max: +maxPrice,
      });
      if (!validationResult.success) {
        setErrorMessage('Min or max value not provided.');
        return;
      }

      const { min, max } = validationResult.data;

      const response = await fetch(`/api/hotels?min=${min}&max=${max}`);
      if (!response) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      const result = HotelSchema.array().safeParse(data)
      const ValidatedData = result.data

      console.log(ValidatedData)

      setHotels(ValidatedData);

    } catch (error) {
      setErrorMessage('Error fetching hotels');
    }
  };

  const handleSearch = async () => {
    if (!minPrice || !maxPrice) {
      setErrorMessage('Please provide both min and max prices.');
      return;
    }

    setErrorMessage('');
    await fetchData();
  };

  const handleResetButton = () => {
    setMaxPrice('');
    setMinPrice('');
  };

  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex flex-col items-center py-16">
        <div className="card card-body w-[470px] bg-base-300 max-w-[350px] text-primary-content items-center">
          <div className="col-span-1">
            <input
              placeholder="min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              className="input input-bordered"
            />
          </div>
          <div className="col-span-1">
            <input
              placeholder="max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              className="input input-bordered"
            />
          </div>
          <div className="col-span-1">
            <button onClick={handleSearch} className="btn mt-8 btn-primary">
              Search
            </button>
            <button onClick={handleResetButton} className="btn mt-8 btn-secondary ml-2">
              Reset
            </button>
          </div>
        </div>
        {errorMessage && <div className=" text-red-600">{errorMessage}</div>}
      </div>

      <div className="flex flex-col items-center py-16">
        <div className="card card-body bg-base-300 max-w-[350px]">
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Searched Hotels:</h2>
            <ul>
              {hotels.map((hotel) => (
                <li>
                  {hotel.name} - ${hotel.pricePerNightInUSD}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
