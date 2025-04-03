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

interface PersonProperty {
  id: number;
  is_related: boolean;
  person_name: string;
  property_address: string;
  person_id: number;      // or personId, depending on your naming
  property_id: number;    // or propertyId
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

  // State for the join table
  const [personProperties, setPersonProperties] = useState<PersonProperty[]>([]);
 
  // For your join table form:
  const [newPersonProperty, setNewPersonProperty] = useState({
    person_id: 0,
    property_id: 0,
    person_name: '',
    property_address:'',
    is_related: false,
  });
  
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    fetchPeople();
    fetchProperties();
    fetchPersonProperties();
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

  // Fetch the person-property relationships from your backend
  const fetchPersonProperties = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/person-properties');
      const data = await res.json();
      setPersonProperties(data);
    } catch (error) {
      console.error('Error fetching person-properties:', error);
    }
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


    const addPersonProperty = async () => {
      //e.preventDefault(); // prevent page reload  e:React.FormEvent
      
      // Make sure you have valid IDs before sending:
      if (!newPersonProperty.person_id || !newPersonProperty.property_id) {
        alert('Please select a valid person and property.');
        return;
      }
    
      try {
        const res = await fetch('http://localhost:5000/api/person-properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personId: newPersonProperty.person_id,
            propertyId: newPersonProperty.property_id,
            isRelated: newPersonProperty.is_related,
            person_name: newPersonProperty.person_name,
            property_address:newPersonProperty.property_address,
          }),
        });
    
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error adding relationship');
        }
    
        // Clear the form fields
        setNewPersonProperty({
          person_id: 0,
          property_id: 0,
          person_name: '',
          property_address: '',
          is_related: false,
        });
    
        // Refresh your table of relationships:
        fetchPersonProperties();
      } catch (error) {
        console.error(error);
        alert('Failed to add person-property relationship');
      }
    };

    //
    
    //

    // Toggle the is_related value for a given (person, property) pair
    async function handleToggle(personId: number, propertyId: number) {
      try {
        // Does this (personId, propertyId) pair exist in personProperties?
        const existing = personProperties.find(
          (pp) => pp.person_id === personId && pp.property_id === propertyId
        );

      if (existing) {
        // If it exists, toggle the relationship with a PUT
        const newValue = !existing.is_related;
        const res = await fetch(
          `http://localhost:5000/api/person-properties/${existing.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRelated: newValue }),
          }
        );
        if (!res.ok) throw new Error('Failed to update relationship');
      } else {
        // If no row yet, create one with isRelated=true
        const res = await fetch('http://localhost:5000/api/person-properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personId,
            propertyId,
            isRelated: true,
          }),
        });
        if (!res.ok) throw new Error('Failed to create relationship');
      }

    // Refresh data after update
    fetchPersonProperties();
    }catch (err) {
        console.error(err);
        alert('Error toggling relationship');
      }
  }




    //
   
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
      {/* */}
      <div>
      <h2 className="text-lg font-semibold mb-2">Person-Property Relationships</h2>
      
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Person ID</th>
            <th className="border p-2">Property ID</th>
            <th className="border p-2">Is Related</th>
          </tr>
        </thead>
        <tbody>
          {personProperties.map((pp) => (
            <tr key={pp.id} className="text-center">
              <td className="border p-2">{pp.id}</td>
              <td className="border p-2">{pp.person_id}</td>
              <td className="border p-2">{pp.property_id}</td>
              <td className="border p-2">{pp.is_related ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* */}
    <div className="mb-6 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Add Person-Property Relationship</h2>
      <form onSubmit={addPersonProperty} className="space-y-2">

        {/* Choose which Person by ID */}
        <label className="block">
          <span>Select Person:</span>
          <select
            className="border p-2 w-full"
            value={newPersonProperty.person_id}
            onChange={(e) =>
              setNewPersonProperty({
                ...newPersonProperty,
                person_id: Number(e.target.value),
              })
            }
          >
            <option value={0}>-- Select Person --</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (ID {p.id})
              </option>
            ))}
          </select>
        </label>

        {/* Choose which Property by ID */}
        <label className="block">
          <span>Select Property:</span>
          <select
            className="border p-2 w-full"
            value={newPersonProperty.property_id}
            onChange={(e) =>
              setNewPersonProperty({
                ...newPersonProperty,
                property_id: Number(e.target.value),
              })
            }
          >
            <option value={0}>-- Select Property --</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.address} (ID {prop.id})
              </option>
            ))}
          </select>
        </label>

        {/* Set is_related */}
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newPersonProperty.is_related}
            onChange={(e) =>
              setNewPersonProperty({
                ...newPersonProperty,
                is_related: e.target.checked,
              })
            }
          />
          <span>Is Related?</span>
        </label>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Relationship
        </button>
      </form>
    </div>
    {/*
     * 
     */}
     <div>
      <h2 className="text-lg font-semibold mb-2">
        Property vs. Person Relationships
      </h2>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border min-w-[150px] min-h-[50px] p-2 text-center">Property \ Person</th>
            {people.map((person) => (
              <th key={person.id} className="border min-w-[100px] min-h-[50px] p-2 text-center">
                {person.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="text-center">
              {/* Left column = property address */}
              <td className="border min-w-[150px] min-h-[50px] p-2 text-left">{property.address}</td>

              {/* For each person, check if related */}
              {people.map((person) => {
                const relation = personProperties.find(
                  (pp) =>
                    pp.property_id === property.id &&
                    pp.person_id === person.id
                );
                const isRelated = relation?.is_related ?? false;

                return (
                  <td
                    key={person.id}
                    className="border min-w-[100px] min-h-[50px] p-2 cursor-pointer text-center align-middle"
                    onClick={() => handleToggle(person.id, property.id)}
                  >
                    {isRelated ? '✔️' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     {/** */}
      <div>
      <h2 className="text-lg font-semibold mb-2">Person-Property Relationships</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Person Name</th>
            <th className="border p-2">Property Address</th>
            <th className="border p-2">Is Related?</th>
          </tr>
        </thead>
        <tbody>
          {personProperties.map((pp) => (
            <tr key={pp.id} className="text-center">
              <td className="border p-2">{pp.id}</td>
              <td className="border p-2">{pp.person_name}</td>
              <td className="border p-2">{pp.property_address}</td>
              <td className="border p-2">{pp.is_related ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
