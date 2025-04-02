// A full-featured dashboard for people, properties, and relationships
// React + Next.js + Tailwind + Typescript compatible

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Person {
  id: number;
  name: string;
  organisation :string;
  role:string;
  email:string;
  contact_number:string
}

interface Property {
  id: number;
  inquirer: string;
  city: string;
  address: string;
  property_type: string;
  building_rateable_value: number | null;
  rates_payable_before_relief:number | null;
  has_car_park: boolean;
  car_park_rateable_value: number | null;
  car_park_rates_payable_before_relief: number | null;
  total_rateable_value:number | null;
  total_rate_payable: number | null;
}
export default function Dashboard() {
  const [people, setPeople] = useState<Person[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [newPersonName, setNewPersonName] = useState('');
  const [newPropertyAddress, setNewPropertyAddress] = useState('');
 
  const [newPerson, setNewPerson] = useState<Omit<Person, 'id'>>({
    name: '',
    organisation: '',
    role: '',
    email: '',
    contact_number: '',
  });

  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
    inquirer: '',
    city: '',
    address: '',
    property_type: '',
    building_rateable_value: null,
    rates_payable_before_relief: null,
    has_car_park: false,
    car_park_rateable_value: null,
    car_park_rates_payable_before_relief: null,
    total_rateable_value: null,
    total_rate_payable: null,
  });


  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    fetchPeople();
    fetchProperties();
  }, []);

  const fetchPeople = async () => {
    const res = await fetch('http://localhost:5000/api/people');
    const data = await res.json();
    setPeople(data);
  };

  const fetchProperties = async () => {
    const res = await fetch('http://localhost:5000/api/propertiies');
    const data = await res.json();
    setProperties(data);
  };

  const addPerson = async () => {
    await fetch('http://localhost:5000/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPersonName }),
    });
    setNewPersonName('');
    fetchPeople();
  };

  // Add Person
  const addPersoon = async () => {  
    await fetch('http://localhost:5000/api/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Pass the entire person object
      body: JSON.stringify(newPerson),
    });
    // Reset fields
    setNewPerson({
      name: '',
      organisation: '',
      role: '',
      email: '',
      contact_number: '',
    });
    // Reload table
    fetchPeople();
  };

  const addProperty = async () => {
    await fetch('http://localhost:5000/api/propertiies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: newPropertyAddress }),
    });
    setNewPropertyAddress('');
    fetchProperties();
  };

    // Add Property
    const addProperrty = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent full page reload
      await fetch('http://localhost:5000/api/propertiies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass the entire property object
        body: JSON.stringify(newProperty),
      });
      // Reset fields
      setNewProperty({
        inquirer: '',
        city: '',
        address: '',
        property_type: '',
        building_rateable_value: null,
        rates_payable_before_relief:null,
        has_car_park: false,
        car_park_rateable_value: null,
        car_park_rates_payable_before_relief: null,
        total_rateable_value: null,
        total_rate_payable:null,
      });
      // Reload table
      fetchProperties();
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Logout Button */}
      <button onClick={handleLogout} className="btn btn-secondary mb-3">
        Sign Out
      </button>

     {/* Add Person Form */}
     <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Add Person</h2>
        <form onSubmit={addPersoon} className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Organisation"
            value={newPerson.organisation}
            onChange={(e) => setNewPerson({ ...newPerson, organisation: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Role"
            value={newPerson.role}
            onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Email"
            value={newPerson.email}
            onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Contact Number"
            value={newPerson.contact_number}
            onChange={(e) => setNewPerson({ ...newPerson, contact_number: e.target.value })}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Person
          </button>
        </form>
      </div>

     {/* Display People in a Table */}
     <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">People List</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Organisation</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="text-center">
                <td className="border p-2">{person.name}</td>
                <td className="border p-2">{person.organisation}</td>
                <td className="border p-2">{person.role}</td>
                <td className="border p-2">{person.email}</td>
                <td className="border p-2">{person.contact_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

 
       {/* Add Property Form */}
       <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Add Property</h2>
        <form onSubmit={addProperrty} className="space-y-2">
          <input
            className="border p-2 w-full"
            placeholder="Landlord/Organisation"
            value={newProperty.inquirer}
            onChange={(e) => setNewProperty({ ...newProperty, inquirer: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="City"
            value={newProperty.city}
            onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Address"
            value={newProperty.address}
            onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Property Type"
            value={newProperty.property_type}
            onChange={(e) => setNewProperty({ ...newProperty, property_type: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Building rateable value"
            type="number"
            value={newProperty.building_rateable_value ?? ''} 
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                building_rateable_value:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />

          <input
            className="border p-2 w-full"
            placeholder="Rates payable before relief"
            type="number"
            value={newProperty.rates_payable_before_relief ?? ''}
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                rates_payable_before_relief: 
                e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newProperty.has_car_park}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  has_car_park: e.target.checked,
                })
              }
            />
            <span>Has Car Park?</span>
          </label>
          {/* Car Park Rateable Value */}
          <input
            className="border p-2 w-full"
            placeholder="Car park rateable value"
            type="number"
            value={newProperty.car_park_rateable_value ?? ''} 
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                // if blank, store null; otherwise convert to Number
                car_park_rateable_value: e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />

          {/* Car Park Rates Payable Before Relief */}
          <input
            className="border p-2 w-full"
            placeholder="Car park rates payable before relief"
            type="number"
            value={newProperty.car_park_rates_payable_before_relief ?? ''} 
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                car_park_rates_payable_before_relief:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />

         {/* Total Rateable Value */}
          <input
            className="border p-2 w-full"
            placeholder="Total rateable value"
            type="number"
            value={newProperty.total_rateable_value ?? ''}
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                total_rateable_value: e.target.value === '' 
                  ? null 
                  : Number(e.target.value),
              })
            }
          />

          {/* Total Rate Payable */}
          <input
            className="border p-2 w-full"
            placeholder="Total rate payable"
            type="number"
            value={newProperty.total_rate_payable ?? ''}
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                total_rate_payable: e.target.value === '' 
                  ? null 
                  : Number(e.target.value),
              })
            }
          />


          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Property
          </button>
        </form>
      </div>

      {/* Display Properties in a Table */}
      <div className="mb-6 p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Properties List</h2>
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Landlord/Organisation</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Property Type</th>
              <th className="border p-2">Building rateable value</th>
              <th className="border p-2">Rates payable before relief</th>
              <th className="border p-2">Has car park</th>
              <th className="border p-2">Car park rateable value</th>
              <th className="border p-2">Car park rates payable before relief</th>
              <th className="border p-2">Total rateable value</th>
              <th className="border p-2">Total rate payable</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="text-center">
                <td className="border p-2">{property.inquirer}</td>
                <td className="border p-2">{property.city}</td>
                <td className="border p-2">{property.address}</td>
                <td className="border p-2">{property.property_type}</td>
                <td className="border p-2">{property.building_rateable_value}</td>
                <td className="border p-2">{property.rates_payable_before_relief}</td>
                <td className="border p-2">{property.has_car_park? 'Yes' : 'No'}</td>
                <td className="border p-2">{property.car_park_rateable_value}</td>
                <td className="border p-2">{property.car_park_rates_payable_before_relief}</td>
                <td className="border p-2">{property.total_rateable_value}</td>
                <td className="border p-2">{property.total_rate_payable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <hr/>
    </div>
  );
}
