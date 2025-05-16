import React, { useEffect, useState } from 'react';
import { MediaUploader } from '../components/Dashboard/MediaUploader';
import { MediaList } from '../components/MediaUploader/MediaList'; 

type AddressItem  = { id: number; address: string };
type GroupedData  = Record<string, Record<string, AddressItem[]>>;

export default function GroupedPropertyList() {
  const [data, setData] = useState<GroupedData>({});
  const [expandedCountries, setExpandedCountries] = useState(new Set<string>());
  const [expandedCities, setExpandedCities]       = useState(new Set<string>());

  useEffect(() => {
    fetch('http://localhost:5000/api/propertiies/grouped')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const toggleCountry = (c: string) => {
    setExpandedCountries(prev => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  };

  const toggleCity = (c: string, city: string) => {
    const k = `${c}-${city}`;
    setExpandedCities(prev => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  return (
    <div className="mt-4">
      {Object.entries(data).map(([country, cities]) => (
        <div key={country} className="mb-3">
          <h5
            className="cursor-pointer text-blue-700"
            onClick={() => toggleCountry(country)}
          >
            {expandedCountries.has(country) ? '▼' : '▶'} {country}
          </h5>

          {expandedCountries.has(country) &&
            Object.entries(cities).map(([city, addresses]) => (
              <div key={city} className="ms-3">
                <p
                  className="cursor-pointer font-medium"
                  onClick={() => toggleCity(country, city)}
                >
                  {expandedCities.has(`${country}-${city}`) ? '•' : '+'} {city}
                </p>

                {expandedCities.has(`${country}-${city}`) && (
                  <ul>
                    {addresses
                      .filter(a => a.address)          // skip blank strings
                      .map(({ id, address }) => (
                        <li key={id} className="flex justify-between items-center mb-2">
                          <span>{address}</span>
                          <MediaUploader propertyId={id} /> 
                          <MediaList propertyId={id} />
                        </li> 
                      ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
