import React, { useEffect, useState } from 'react';

type GroupedData = Record<string, Record<string, string[]>>;

export default function GroupedPropertyList() {
  const [data, setData] = useState<GroupedData>({});
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('http://localhost:5000/api/propertiies/grouped')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const toggleCountry = (country: string) => {
    const updated = new Set(expandedCountries);
    updated.has(country) ? updated.delete(country) : updated.add(country);
    setExpandedCountries(updated);
  };

  const toggleCity = (country: string, city: string) => {
    const key = `${country}-${city}`;
    const updated = new Set(expandedCities);
    updated.has(key) ? updated.delete(key) : updated.add(key);
    setExpandedCities(updated);
  };

  return (
    <div className="mt-4">
      {Object.entries(data).map(([country, cities]) => (
        <div key={country} className="mb-3">
          <h5
            style={{ cursor: 'pointer', color: '#1d4ed8' }}
            onClick={() => toggleCountry(country)}
          >
            {expandedCountries.has(country) ? '▼' : '▶'} {country}
          </h5>

          {expandedCountries.has(country) &&
            Object.entries(cities).map(([city, addresses]) => (
              <div key={city} className="ms-3">
                <p
                  style={{ cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => toggleCity(country, city)}
                >
                  {expandedCities.has(`${country}-${city}`) ? '•' : '+'} {city}
                </p>

                {expandedCities.has(`${country}-${city}`) && (
                  <ul>
                    {addresses.filter(Boolean).map((addr, i) => (
                      <li key={i}>{addr}</li>
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
