import { useState, useEffect } from 'react';
import ReportTable from '../components/Dashboard/ReportTable';

// You could display a list of signed properties in table format using it


type Organisation = { organisation: string };
type Landlord = { landlord: string };
type Property = {
  property_floor: string;
  property_first_line_address: string;
  property_second_line_address: string;
  city: string;
  post_code: string;
};

export default function InvoicePage() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [expandedLandlord, setExpandedLandlord] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  // Load organisations on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/invoices/organisations')
      .then(res => res.json())
      .then(data => setOrganisations(data));
  }, []);

  const handleOrgClick = async (org: string) => {
    setExpandedOrg(org);
    setExpandedLandlord(null);
    setProperties([]);
    const res = await fetch(`http://localhost:5000/api/invoices/landlords?org=${encodeURIComponent(org)}`);
    const data = await res.json();
    setLandlords(data);
  };

  const handleLandlordClick = async (landlord: string) => {
    setExpandedLandlord(landlord);
    const res = await fetch(`http://localhost:5000/api/invoices/properties?inquirer=${encodeURIComponent(landlord)}`);
    const data = await res.json();
    setProperties(data);
  };

  return (
    <div className="container mt-4">
      <h2>Invoice Explorer</h2>

      {organisations.map(org => (
        <div key={org.organisation} className="mb-3">
          <button
            className="btn btn-outline-primary w-100 text-start"
            onClick={() => handleOrgClick(org.organisation)}
          >
            {org.organisation}
          </button>

          {expandedOrg === org.organisation && (
            <div className="ms-4 mt-2">
              {landlords.map(l => (
                <div key={l.landlord} className="mb-2">
                  <button
                    className="btn btn-outline-secondary w-100 text-start"
                    onClick={() => handleLandlordClick(l.landlord)}
                  >
                    {l.landlord}
                  </button>

                  {expandedLandlord === l.landlord && (
                    <div className="ms-4 mt-2">
                      {properties.length === 0 ? (
                        <p className="text-muted">No signed properties found.</p>
                      ) : (
                        <ul className="list-group">
                          {properties.map((prop, idx) => (
                            <li key={idx} className="list-group-item">
                              {prop.property_floor && <strong>Floor: </strong>}
                              {prop.property_floor && <span>{prop.property_floor}, </span>}
                              {prop.property_first_line_address}, {prop.property_second_line_address}, {prop.city}, {prop.post_code}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}




