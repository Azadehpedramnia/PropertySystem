import React, { useEffect, useState } from 'react';

type GroupedData = Record<string, Record<string, string[]>>;

export default function GroupedPropertyList() {
  const [data, setData] = useState<GroupedData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/propertiies/grouped')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="mt-4">
      {Object.entries(data).map(([country, cities]) => (
        <div key={country} className="mb-4">
          <h3>{country}</h3>
          {Object.entries(cities).map(([city, addresses]) => (
            <div key={city} className="ms-3 mb-2">
              <h5>{city}</h5>
              <ul>
                {addresses.map((addr, index) => (
                  <li key={index}>{addr}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
