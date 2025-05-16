import React, { useEffect, useState } from 'react';
import { MediaUploader } from '../components/Dashboard/MediaUploader';
import { MediaList } from '../components/MediaUploader/MediaList';

type AddressItem = { id: number; address: string };
type GroupedData = Record<string, Record<string, AddressItem[]>>;

export default function GroupedPropertyList() {
  const [data, setData] = useState<GroupedData>({});
  const [expandedCountries, setExpandedCountries] = useState(new Set<string>());
  const [expandedCities, setExpandedCities] = useState(new Set<string>());
  const [showUploaderFor, setShowUploaderFor] = useState<number | null>(null);

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

  const toggleUploader = (id: number) => {
    setShowUploaderFor(prev => (prev === id ? null : id));
  };

  return (
    <div className="container mt-4">
      {Object.entries(data).map(([country, cities]) => (
        <div key={country} className="mb-4">
          <div
            className="d-flex align-items-center fw-bold fs-5 cursor-pointer text-dark"
            onClick={() => toggleCountry(country)}
          >
            {expandedCountries.has(country) ? '▼' : '▶'}&nbsp;{country}
          </div>

          {expandedCountries.has(country) &&
            Object.entries(cities).map(([city, addresses]) => (
              <div key={city} className="ms-4 mt-2">
                <button
                  //className="w-100 text-start py-2 px-3 mb-2 border-0 rounded bg-secondary text-white fw-semibold d-flex align-items-center"
                  className="w-100 text-start py-4 px-3 mb-2 border-0 rounded bg-secondary text-white fw-semibold d-flex align-items-center"

                  onClick={() => toggleCity(country, city)}
                >
                  <span className="me-2">
                    {expandedCities.has(`${country}-${city}`) ? '▼' : '▶'}
                  </span>
                  <span>{city}</span>
                </button>

                {expandedCities.has(`${country}-${city}`) && (
                  <ul className="list-group mb-3">
                    {addresses
                      .filter(a => a.address)
                      .map(({ id, address }) => (
                        <li key={id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="fw-semibold">{address}</div>
                            <button
                              className="btn btn-outline-primary btn-sm"

                              onClick={() => toggleUploader(id)}
                            >
                              {showUploaderFor === id ? 'Hide' : 'Upload Media'}
                            </button>
                          </div>

                          {showUploaderFor === id && (
                            <div className="mb-2">
                              <MediaUploader propertyId={id} />
                              <MediaList propertyId={id} />
                            </div>
                          )}       
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
