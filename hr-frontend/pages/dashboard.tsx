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
  building_rateable_value: number;
  rates_payable_before_relief: number;
  has_car_park: boolean;
  car_park_rateable_value: number | null;
  car_park_rates_payable_before_relief: number | null;
  total_rateable_value: number;
  total_rate_payable: number;
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
    building_rateable_value: 0,
    rates_payable_before_relief: 0,
    has_car_park: false,
    car_park_rateable_value: null,
    car_park_rates_payable_before_relief: null,
    total_rateable_value: 0,
    total_rate_payable: 0,
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

      <hr/>
      {/* Add People */}
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Add person name"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
        />
        <button onClick={addPerson} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Person
        </button>
      </div>

      {/* Add Property */}
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Add property address"
          value={newPropertyAddress}
          onChange={(e) => setNewPropertyAddress(e.target.value)}
        />
        <button onClick={addProperty} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Property
        </button>
      </div>

      {/* Display Lists */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">People</h2>
        <ul className="list-disc list-inside">
          {people.map(person => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Properties</h2>
        <ul className="list-disc list-inside">
          {properties.map(property => (
            <li key={property.id}>{property.address}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
