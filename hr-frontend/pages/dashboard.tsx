// A full-featured dashboard for people, properties, and relationships
// React + Next.js + Tailwind + Typescript compatible

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


type PropertyType = 'Office' | 'Retail' | 'Warehouse' | string;
type Role = 'Est Ag' | 'Landlord' | 'Ass Man' | string;

interface Person {
  id: number;
  name: string;
  organisation :string;
  role: Role;
  email:string;
  contact_number:string;
  family : string;
  your_curren_position:string,
  property_address_for_enquiry:string,
  total_rateable_value_of_the_property:string,
   estate_agents_name:string,
   estate_agent_contact_number:string,
   estate_agent_email:string,
   poc_email:string,
   poc_contact_numbe:string,
   poc_leases:string;
}

interface Property {
  id: number;
  inquirer: string;
  city: string;
  address: string;
  property_type: PropertyType;
  building_rateable_value: number | null;
  rates_payable_before_relief:number | null;
  has_car_park: boolean;
  car_park_rateable_value: number | null;
  car_park_rates_payable_before_relief: number | null;
  total_rateable_value:number | null;
  total_rate_payable: number | null;
  donation_due : Date | null;
  post_code : string;
  landlord_name :string;
              landlord_email:string;
              landlord_no:string;
              rateablevalue_ratespayabl:string;
              rates_for_each:string;
              point_of_company:string;
              rates_multiplier:string;
              strate_date_of_lease:string;
              length_of_lease:string;
              end_date_of_lease:Date | null;
              lease_period:string;
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
  const [editPropertyMode, setEditPropertyMode] = useState(false);
  const [editPersonMode, setEditPersonMode] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPropertyAddress, setNewPropertyAddress] = useState('');
  const [editingPersonIdForProperty, setEditingPersonIdForProperty] = useState<number | null>(null);
  const [editedPersonForProperty, setEditedPersonForProperty] = useState<Partial<Person>>({});
  const [openPersonPopups, setOpenPersonPopups] = useState<Person[]>([]);

  const handlePersonHeaderClickp = (person: Person) => {
    setOpenPersonPopups((prev) => {
      // Avoid duplicates
      if (prev.find((p) => p.id === person.id)) return prev;
      return [...prev, person];
    });
  };
  
  const closePersonPopup = (id: number) => {
    setOpenPersonPopups((prev) => prev.filter((p) => p.id !== id));
  };
  
  const [newPerson, setNewPerson] = useState<Omit<Person, 'id'>>({
    name: '',
    organisation: '',
    role: '',
    email: '',
    contact_number: '',
    family:'',
    your_curren_position:'',
    property_address_for_enquiry:'',
    total_rateable_value_of_the_property:'',
     estate_agents_name:'',
     estate_agent_contact_number:'',
     estate_agent_email:'',
     poc_email:'',
     poc_contact_numbe:'',
     poc_leases:''
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
    donation_due:null,
    post_code : '',
    landlord_name:'',
    landlord_email:'',
    landlord_no:'',
    rateablevalue_ratespayabl:'',
    rates_for_each:'',
    point_of_company:'',
    rates_multiplier:'',
    strate_date_of_lease:'',
    length_of_lease:'',
    end_date_of_lease:null,
    lease_period:'',
    
  });

  // State for the join table
  const [personProperties, setPersonProperties] = useState<PersonProperty[]>([]);
  
  // NEW: Store the currently clicked/selected person and property from the header
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedPropety, setSelectedProperty] = useState<Property | null>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({});
  
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
      const res = await fetch('http://localhost:5000/api/person_property');
      const data = await res.json();
      setPersonProperties(data);
    } catch (error) {
      console.error('Error fetching person_property', error);
    }
  };

  // --------------------------
  // NEW: Handler for clicking on a Person name  and property address in the header
  // --------------------------
  const handlePersonHeaderClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handlePropertyHeaderClick = (property: Property) => {
    setSelectedProperty(property);
  };

  function openModal(person: Person) {
    setSelectedPerson(person);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }


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
      family:'',
      your_curren_position:'',
      property_address_for_enquiry:'',
      total_rateable_value_of_the_property:'',
       estate_agents_name:'',
       estate_agent_contact_number:'',
       estate_agent_email:'',
       poc_email:'',
       poc_contact_numbe:'',
       poc_leases:''
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
        donation_due:null,
        post_code:'',
        landlord_name:'',
        landlord_email:'',
        landlord_no:'',
        rateablevalue_ratespayabl:'',
        rates_for_each:'',
        point_of_company:'',
        rates_multiplier:'',
        strate_date_of_lease:'',
        length_of_lease:'',
        end_date_of_lease:null,
        lease_period:'',
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
        const res = await fetch('http://localhost:5000/api/person_property', {
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
        alert('Failed to add person_property relationship');
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
          `http://localhost:5000/api/person_property/${existing.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRelated: newValue }),
          }
        );
        if (!res.ok) throw new Error('Failed to update relationship');
      } else {
        // If no row yet, create one with isRelated=true
        const res = await fetch('http://localhost:5000/api/person_property', {
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
    <div className="mb-6 p-4 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Logout Button */}
      <button onClick={handleLogout} className="btn btn-secondary mb-3">
        Sign Out
      </button>

     {/* Add Person Form */}
     <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add Person</h2>
        <form onSubmit={addPersoon} className="space-y-4">
  
          {/* */}
          <div className="row g-3">

            {/* Column 1 */}
            <div className="col-md-3  p-3 rounded">

              {/* Row: Name */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Name:</label>
                <input
                  className="form-control"
                  placeholder="Name"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  required
                />
              </div>
              {/* Row: Last Name */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Last Name:</label>
                <input
                  className="form-control"
                  placeholder="Last Name"
                  value={newPerson.family}
                  onChange={(e) => setNewPerson({ ...newPerson, family: e.target.value })}
                  required
                />
              </div>

              {/* Row: Organisation */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Organisation:</label>
                <input
                  className="form-control"
                  placeholder="Organisation"
                  value={newPerson.organisation}
                  onChange={(e) => setNewPerson({ ...newPerson, organisation: e.target.value })}
                />
              </div>

              {/* Row: Role */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Role:</label>
                <input
                  list="role-options"
                  className="form-control"
                  placeholder="Select or type role"
                  value={newPerson.role}
                  onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value as Person['role'] })}
                />
                <datalist id="role-options">
                  <option value="Est Ag" />
                  <option value="Landlord" />
                  <option value="Ass Man" />
                </datalist>
              </div>

              {/* Row: Email */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Email:</label>
                <input
                  className="form-control"
                  placeholder="Email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                />
              </div>

              {/* Row: Contact Number */}
              <div className="d-flex align-items-center mb-4">
                <label className="form-label me-2 mb-0 w-50">Contact No:</label>
                <input
                  className="form-control"
                  placeholder="Contact Number"
                  value={newPerson.contact_number}
                  onChange={(e) => setNewPerson({ ...newPerson, contact_number: e.target.value })}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="col-md-3 bg-light p-3 rounded">

              {/* Row: your_curren_position */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">your curren position:</label>
                <input
                  className="form-control"
                  placeholder="your curren position"
                  value={newPerson.your_curren_position}
                  onChange={(e) => setNewPerson({ ...newPerson, your_curren_position: e.target.value })}
                  required
                />
              </div>

              {/* Row: property_address_for_enquiry*/}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">property address for enquiry:</label>
                <input
                  className="form-control"
                  placeholder="property address for enquiry"
                  value={newPerson.property_address_for_enquiry}
                  onChange={(e) => setNewPerson({ ...newPerson, property_address_for_enquiry: e.target.value })}
                  required
                />
              </div>

              {/* Row: total_rateable_value_of_the_property */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">total rateable value of the property:</label>
                <input
                  className="form-control"
                  placeholder="total rateable value of the property"
                  value={newPerson.total_rateable_value_of_the_property}
                  onChange={(e) => setNewPerson({ ...newPerson, total_rateable_value_of_the_property: e.target.value })}
                  required
                />
              </div>

              {/* Row:  estate_agents_name */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">estate agents name:</label>
                <input
                  className="form-control"
                  placeholder="estate agents name"
                  value={newPerson.estate_agents_name}
                  onChange={(e) => setNewPerson({ ...newPerson, estate_agents_name: e.target.value })}
                  required
                />
              </div>

              {/* Row: estate_agent_contact_number */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">estate agent contact number:</label>
                <input
                  className="form-control"
                  placeholder="estate agent contact number"
                  value={newPerson.estate_agent_contact_number}
                  onChange={(e) => setNewPerson({ ...newPerson, estate_agent_contact_number: e.target.value })}
                  required
                />
              </div>

              {/* Row:  estate_agent_email */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Last Name:</label>
                <input
                  className="form-control"
                  placeholder="estate agent email"
                  value={newPerson.estate_agent_email}
                  onChange={(e) => setNewPerson({ ...newPerson, estate_agent_email: e.target.value })}
                  required
                />
              </div>

              {/* Row: poc_email */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">poc_email:</label>
                <input
                  className="form-control"
                  placeholder="poc email"
                  value={newPerson.poc_email}
                  onChange={(e) => setNewPerson({ ...newPerson,poc_email: e.target.value })}
                  required
                />
              </div>

              
              {/* Row:  poc_contact_numbe */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50"> poc_contact_numbe :</label>
                <input
                  className="form-control"
                  placeholder=" poc contact numbe "
                  value={newPerson.poc_contact_numbe}
                  onChange={(e) => setNewPerson({ ...newPerson, poc_contact_numbe : e.target.value })}
                  required
                />
              </div>

              
              {/* Row:  poc_leases */}
              <div className="d-flex align-items-center mb-3">
                <label className="form-label me-2 mb-0 w-50">Is there a management company who will be POC for leases/invoices etc?:</label>
                <input
                  className="form-control"
                  placeholder="poc leases"
                  value={newPerson.poc_leases}
                  onChange={(e) => setNewPerson({ ...newPerson, poc_leases: e.target.value })}
                  required
                />
              </div>

            </div>

            {/* Column 3 */}
            <div className="col-md-3  p-3 rounded">
      
            </div>

            {/* Column 4 */}
            <div className="col-md-3 bg-light p-3 rounded">
 
            </div>
          </div>
          {/* Submit Button */}
          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Add Person
            </button>
          </div>        
        </form>
      </div>

      {/* */}




       {/* Add Property Form */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add Property</h2>
        <form onSubmit={addProperrty}>

            {/* */}
            {/* */}
          <div className="row g-3">

          {/* Column 1 */}
          <div className="col-md-3  p-3 rounded">
           {/* */}
          {/* Landlord / Organisation */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Landlord / Organisation:</label>
            <input
              className="form-control"
              placeholder="Landlord / Organisation"
              value={newProperty.inquirer}
              onChange={(e) => setNewProperty({ ...newProperty, inquirer: e.target.value })}
              required
            />
          </div>

          {/* City */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>City:</label>
            <input
              className="form-control"
              placeholder="City"
              value={newProperty.city}
              onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Address:</label>
            <input
              className="form-control"
              placeholder="Address"
              value={newProperty.address}
              onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
            />
          </div>

           {/* Post Code */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>post Code:</label>
            <input
              className="form-control"
              placeholder="post code"
              value={newProperty.post_code}
              onChange={(e) => setNewProperty({ ...newProperty, post_code: e.target.value })}
            />
          </div>

          {/* Property Type */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Property Type:</label>
            <input
              list="property-type-options"
              className="form-control"
              placeholder="property type"
              value={newProperty.property_type}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  property_type: e.target.value as Property['property_type'],
                })
              }
            />
            <datalist id="property-type-options">
              <option value="Office" />
              <option value="Retail" />
              <option value="Warehouse" />
            </datalist>
          </div>

          {/* Building Rateable Value */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Building Rateable Value:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Building Rateable Value"
              value={newProperty.building_rateable_value ?? ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  building_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Rates Payable Before Relief */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Rates Payable Before Relief:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Rates payable before relief"
              value={newProperty.rates_payable_before_relief ?? ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Has Car Park */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Has Car Park?</label>
            <input
              type="checkbox"
              checked={newProperty.has_car_park}
              onChange={(e) =>
                setNewProperty({ ...newProperty, has_car_park: e.target.checked })
              }
            />
          </div>

          {/* Car Park Rateable Value */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Car Park Rateable Value:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Car park rateable value"
              value={newProperty.car_park_rateable_value ?? ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  car_park_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Car Park Rates Payable Before Relief */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Car Park Rates Payable Before Relife:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Rates before relief"
              value={newProperty.car_park_rates_payable_before_relief ?? ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  car_park_rates_payable_before_relief:
                    e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Total Rateable Value */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Total Rateable Value:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Total rateable value"
              value={newProperty.total_rateable_value ?? ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  total_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Total Rate Payable */}
          <div className="d-flex align-items-center mb-3">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Total Rate Payable:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Total rate payable"
              value={newProperty.total_rate_payable ?? ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  total_rate_payable: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </div>

          {/* Donation Due */}
          <div className="d-flex align-items-center mb-4">
            <label className="me-3 mb-0" style={{ width: '160px' }}>Donation Due:</label>
            <input
              type="date"
              className="form-control"
              value={newProperty.donation_due ? newProperty.donation_due.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  donation_due: e.target.value ? new Date(e.target.value) : null,
                })
              }
            />
          </div>
          {/* */}
          </div>

          {/* Column 2 */}
          <div className="col-md-3 bg-light p-3 rounded">
            {/* landlord_name*/}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>landlord_name:</label>
              <input
                className="form-control"
                placeholder="landlord_name"
                value={newProperty.landlord_name}
                onChange={(e) => setNewProperty({ ...newProperty, landlord_name: e.target.value })}
                required
              />
            </div>
            {/* landlord_email */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}> landlord_email:</label>
              <input
                className="form-control"
                placeholder=" landlord_email"
                value={newProperty.landlord_email}
                onChange={(e) => setNewProperty({ ...newProperty, landlord_email: e.target.value })}
                required
              />
            </div>
            {/* landlord_no */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>landlord contact Number:</label>
              <input
                className="form-control"
                placeholder="landlord_no"
                value={newProperty.landlord_no}
                onChange={(e) => setNewProperty({ ...newProperty, landlord_no: e.target.value })}
                required
              />
            </div>
            {/* rateablevalue_ratespayabl */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>Landlord / Organisation:</label>
              <input
                className="form-control"
                placeholder="Landlord / Organisation"
                value={newProperty. rateablevalue_ratespayabl}
                onChange={(e) => setNewProperty({ ...newProperty, rateablevalue_ratespayabl: e.target.value })}
                required
              />
            </div>
            {/*  rates_for_each */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}> rates_for_each:</label>
              <input
                className="form-control"
                placeholder=" rates_for_each"
                value={newProperty. rates_for_each}
                onChange={(e) => setNewProperty({ ...newProperty,  rates_for_each: e.target.value })}
                required
              />
            </div>
            {/* point_of_company*/}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>point_of_company:</label>
              <input
                className="form-control"
                placeholder="point_of_company"
                value={newProperty.point_of_company}
                onChange={(e) => setNewProperty({ ...newProperty, point_of_company: e.target.value })}
                required
              />
            </div>
            {/* rates_multiplier */}
                        <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>rates_multiplier:</label>
              <input
                className="form-control"
                placeholder="rates_multiplier"
                value={newProperty.rates_multiplier}
                onChange={(e) => setNewProperty({ ...newProperty, rates_multiplier: e.target.value })}
                required
              />
            </div>
            {/* strate_date_of_lease */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>strate_date_of_lease:</label>
              <input
                className="form-control"
                placeholder="strate_date_of_lease"
                value={newProperty.strate_date_of_lease}
                onChange={(e) => setNewProperty({ ...newProperty, strate_date_of_lease: e.target.value })}
                required
              />
            </div>
            {/*  length_of_lease */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}> length_of_lease:</label>
              <input
                className="form-control"
                placeholder=" length_of_lease"
                value={newProperty. length_of_lease}
                onChange={(e) => setNewProperty({ ...newProperty,  length_of_lease: e.target.value })}
                required
              />
            </div>
            {/* end_date_of_lease */}
            <div className="d-flex align-items-center mb-4">
              <label className="me-3 mb-0" style={{ width: '160px' }}>end_date_of_lease:</label>
              <input
                type="date"
                className="form-control"
                value={newProperty.end_date_of_lease ? newProperty.end_date_of_lease.toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    donation_due: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </div>
            {/* lease_period*/}
            <div className="d-flex align-items-center mb-3">
              <label className="me-3 mb-0" style={{ width: '160px' }}>lease_period:</label>
              <input
                className="form-control"
                placeholder="lease_period"
                value={newProperty.lease_period}
                onChange={(e) => setNewProperty({ ...newProperty,lease_period: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="col-md-3  p-3 rounded">
        
          </div>

          {/* Column 4 */}
          <div className="col-md-3 bg-light p-3 rounded">
  
          </div>
          </div>
          {/* Submit */}
          <div className="text-end">
            <button type="submit" className="btn btn-primary px-4 py-2">
              Add Property
            </button>
          </div>
        </form>
      </div>
      
      {/* Table for Relationship*/}

      <div className="mb-6 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">
         Relationships
      </h2>
      
        <table className="min-w-full border-collapse border border-gray-300 cursor-pointer">
          <thead>
            <tr className="bg-gray-200">
              <th className="border min-w-[150px] min-h-[50px] p-2 text-center">Property \ Person</th>
              {people.map((person) => (
                <th key={person.id} className="border min-w-[100px] min-h-[50px] p-2 text-center "
                  onClick={() => handlePersonHeaderClick(person)}>           
                  {person.name || 'Name'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="text-center" >  
                {/* Left column = property address */}
                <td className="border min-w-[150px] min-h-[50px] p-2 text-left" onClick={() => handlePropertyHeaderClick(property)}>
                {property.address || 'Address'}
                </td>

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
      




        {/* */}
        {openPersonPopups.map((person) => {
            const relatedProperties = personProperties
              .filter((pp) => pp.person_id === person.id && pp.is_related)
              .map((pp) => properties.find((prop) => prop.id === pp.property_id))
              .filter((p): p is Property => !!p);

            return (
              <div
                key={person.id}
                className="fixed top-20 right-5 bg-white border shadow-lg rounded-lg p-4 z-50 w-[300px] max-h-[80vh] overflow-auto"
                style={{ marginBottom: '1rem' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{person.name}</h3>
                  <button
                    onClick={() => closePersonPopup(person.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✖
                  </button>
                </div>
                <p><strong>Organisation:</strong> {person.organisation}</p>
                <p><strong>Role:</strong> {person.role}</p>
                <p><strong>Email:</strong> {person.email}</p>
                <p><strong>Contact:</strong> {person.contact_number}</p>

                <div className="mt-4">
                  <h4 className="font-semibold">Related Properties</h4>
                  <ul className="list-disc list-inside text-sm">
                    {relatedProperties.length > 0 ? (
                      relatedProperties.map((property) => (
                        <li key={property.id}>
                          {property.address} ({property.city})
                        </li>
                      ))
                    ) : (
                      <li>No related properties</li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}

        {/* */}












      {/* If selectedPerson is set, show more details below */}
      {selectedPerson && (
        <div className="p-4 mt-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Selected Person</h2>
          {/* ✅ Place this inside the block, right after opening it: */}
          {(() => {
            const relatedProperties = personProperties
              .filter((pp) => pp.person_id === selectedPerson.id && pp.is_related)
              .map((pp) => properties.find((prop) => prop.id === pp.property_id))
              .filter((p): p is Property => !!p); // remove undefined values

            return (
              <>
                {/* Person Details + Edit Mode UI (already in your code) */}
                {/* Your existing form/view for person goes here... */}
                  
                {editPersonMode ? (
                  <>
                    <p>
                    <label><strong>Name:</strong></label>
                    <input
                      className="border p-2 w-full my-1"
                      value={selectedPerson.name}
                      onChange={(e) =>
                        setSelectedPerson({ ...selectedPerson, name: e.target.value })
                      }
                    /></p>
                    <p>
                    <label><strong>Organisation:</strong></label>
                    <input
                      className="border p-2 w- my-1"
                      value={selectedPerson.organisation}
                      onChange={(e) =>
                        setSelectedPerson({ ...selectedPerson, organisation: e.target.value })
                      }
                    /></p>
                      <p>
                      <label><strong>Role:</strong></label>
                      <select
                        className="border p-2 w-full my-1"
                        value={selectedPerson.role}
                        onChange={(e) =>
                          setSelectedPerson({
                            ...selectedPerson,
                            role: e.target.value as Person['role'],
                          })
                        }
                      >
                        <option value="Est Ag">Est Ag</option>
                        <option value="Landlord">Landlord</option>
                        <option value="Ass Man">Ass Man</option>
                      </select>
                    </p>
                    <p>
                    <label><strong>Email:</strong></label>
                    <input
                      className="border p-2 w-full my-1"
                      value={selectedPerson.email}
                      onChange={(e) =>
                        setSelectedPerson({ ...selectedPerson, email: e.target.value })
                      }
                    /></p>
                    <p>
                    <label><strong>Contact:</strong></label>
                    <input
                      className="border p-2 w-full my-1"
                      value={selectedPerson.contact_number}
                      onChange={(e) =>
                        setSelectedPerson({ ...selectedPerson, contact_number: e.target.value })
                      }
                    /></p>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {selectedPerson.name}</p>
                    <p><strong>Organisation:</strong> {selectedPerson.organisation}</p>
                    <p><strong>Role:</strong> {selectedPerson.role}</p>
                    <p><strong>Email:</strong> {selectedPerson.email}</p>
                    <p><strong>Contact:</strong> {selectedPerson.contact_number}</p>
                  </>
                )}

                {/* ACTION BUTTONS - your existing Save/Edit/Delete/Close logic */}
                {/* ... */}

                {/* ACTION BUTTONS */}
                <div className="mt-4 space-x-2">
                  {editPersonMode ? (
                    <>
                      <button
                        onClick={async () => {
                          const res = await fetch(`http://localhost:5000/api/people/${selectedPerson.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(selectedPerson),
                          });
                          if (res.ok) {
                            setEditPersonMode(false);
                            fetchPeople();
                          } else {
                            alert('Failed to update person');
                          }
                        }}
                        className="bg-gray-300 px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditPersonMode(false)}
                        className="bg-gray-300 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditPersonMode(true)}
                        className="bg-gray-300 px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          const confirmDelete = confirm('Are you sure you want to delete this person?');
                          if (!confirmDelete) return;

                          const res = await fetch(`http://localhost:5000/api/people/${selectedPerson.id}`, {
                            method: 'DELETE',
                          });

                          if (res.ok) {
                            setSelectedPerson(null);
                            fetchPeople();
                          } else {
                            alert('Failed to delete person');
                          }
                        }}
                        className="bg-gray-300 px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setSelectedPerson(null)}
                  >
                    Close
                  </button>
                </div>     
                {/* ✅ Now insert related properties here */}
                {relatedProperties.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Related Properties</h3>
                    <ul className="space-y-2">
                      {relatedProperties.map((property) => (
                        <li key={property.id} className="border p-3 rounded bg-gray-50">
                        {editingPropertyId === property.id ? (
                          <>               
                            <p>
                            <label><strong>Landlord/Organisation:</strong></label>                         
                            <input
                              className="border p-1 w-full my-1"
                              value={editedProperty.inquirer ?? property.inquirer}
                              onChange={(e) => setEditedProperty({ ...editedProperty, inquirer: e.target.value })}
                            /></p> 
                            <p> 
                            <label><strong>City:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              value={editedProperty.city ?? property.city}
                              onChange={(e) => setEditedProperty({ ...editedProperty, city: e.target.value })}
                            /></p> 
                            <p> 
                            <label><strong>Address:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              value={editedProperty.address ?? property.address}
                              onChange={(e) => setEditedProperty({ ...editedProperty, address: e.target.value })}
                            /></p> 
                            <p> 
                              <label><strong>Property Type:</strong></label>     
                              <select
                                className="border p-1 w-full my-1"
                                value={editedProperty.property_type ?? property.property_type}
                                onChange={(e) =>
                                  setEditedProperty({
                                    ...editedProperty,
                                    property_type: e.target.value as Property['property_type'],
                                  })
                                }
                              >
                                <option value="Office">Office</option>
                                <option value="Retail">Retail</option>
                                <option value="Warehouse">Warehouse</option>
                              </select>
                            </p>
 
                            <p>
                            <label><strong>Building rateable value:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              type="number"
                              value={editedProperty.building_rateable_value ?? property.building_rateable_value ?? ''}
                              onChange={(e) =>
                                setEditedProperty({ ...editedProperty, building_rateable_value: e.target.value === '' ? null : Number(e.target.value) })
                              }
                            /></p>
                            <p>
                            <label><strong>Rates payable before relief:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              type="number"
                              value={editedProperty.rates_payable_before_relief?? property.rates_payable_before_relief?? ''}
                              onChange={(e) =>
                                setEditedProperty({ ...editedProperty, rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value) })
                              }
                            /></p>
                            <p>
                              <label className="inline-flex items-center space-x-2 my-1">
                                <input
                                  type="checkbox"
                                  checked={editedProperty.has_car_park ?? property.has_car_park}
                                  onChange={(e) =>
                                    setEditedProperty({ ...editedProperty, has_car_park: e.target.checked })
                                  }
                                />
                                <span><strong>Has Car Park?</strong></span>
                              </label>
                            </p>
                            <p>
                            <label><strong>Car park rateable value:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              type="number"
                              value={editedProperty.car_park_rateable_value ?? property.car_park_rateable_value ?? ''}
                              onChange={(e) =>
                                setEditedProperty({ ...editedProperty, car_park_rateable_value: e.target.value === '' ? null : Number(e.target.value) })
                              }
                            /></p>
                            <p>
                            <label><strong>Car park rates payable before relief:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              type="number"
                              value={editedProperty.car_park_rates_payable_before_relief ?? property.car_park_rates_payable_before_relief ?? ''}
                              onChange={(e) =>
                                setEditedProperty({ ...editedProperty,car_park_rates_payable_before_relief : e.target.value === '' ? null : Number(e.target.value) })
                              }
                            /></p>
                            <p>
                            <label><strong>Total rateable value:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              type="number"
                              value={editedProperty.total_rateable_value ?? property.total_rateable_value?? ''}
                              onChange={(e) =>
                                setEditedProperty({ ...editedProperty, total_rateable_value: e.target.value === '' ? null : Number(e.target.value) })
                              }
                            /></p>
                            <p>
                            <label><strong>Total rate payable:</strong></label>     
                            <input
                              className="border p-1 w-full my-1"
                              type="number"
                              value={editedProperty.total_rate_payable ?? property.total_rate_payable ?? ''}
                              onChange={(e) =>
                                setEditedProperty({ ...editedProperty, total_rate_payable: e.target.value === '' ? null : Number(e.target.value) })
                              }
                            /></p>

                            {/* Add other fields similarly... */}
                            <div className="flex gap-2 mt-2">
                              <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={async () => {
                                  const res = await fetch(`http://localhost:5000/api/propertiies/${property.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ...property, ...editedProperty }),
                                  });
                                  if (res.ok) {
                                    setEditingPropertyId(null);
                                    setEditedProperty({});
                                    fetchProperties();
                                    fetchPersonProperties();
                                  } else {
                                    alert('Update failed');
                                  }
                                }}
                              >
                                Save
                              </button>
                              <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                  setEditingPropertyId(null);
                                  setEditedProperty({});
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p><strong>Landlord/Organisation:</strong> {property.inquirer}</p>
                            <p><strong>City:</strong> {property.city}</p>
                            <p><strong>Address:</strong> {property.address}</p>
                            <p><strong>Property Type:</strong> {property.property_type}</p>
                            <p><strong>Building rateable value:</strong> {property.building_rateable_value}</p>
                            <p><strong>Rates payable before relief:</strong> {property.rates_payable_before_relief}</p>
                            <p><strong>Has car park:</strong> {property.has_car_park ? 'Yes' : 'No'}</p>
                            <p><strong>Car park rateable value:</strong> {property.car_park_rateable_value}</p>
                            <p><strong>Car park rates payable before relief:</strong> {property.car_park_rates_payable_before_relief}</p>
                            <p><strong>Total rateable value:</strong> {property.total_rateable_value}</p>
                            <p><strong>Total rate payable:</strong> {property.total_rate_payable}</p>
                      
                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 mt-2">
                              <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                  setEditingPropertyId(property.id);
                                  setEditedProperty(property); // preload existing
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={async () => {
                                  const confirmDelete = confirm('Are you sure you want to delete this property?');
                                  if (!confirmDelete) return;
                      
                                  const res = await fetch(`http://localhost:5000/api/propertiies/${property.id}`, {
                                    method: 'DELETE',
                                  });
                      
                                  if (res.ok) {
                                    fetchProperties();
                                    fetchPersonProperties();
                                  } else {
                                    alert('Failed to delete property');
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                      
                      ))}
                    </ul>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

    {/**/}

    {/* If selectedProperty is set, show more details below */}
      {selectedPropety && (  
        <div className="p-4 mt-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Selected Property</h2>

          {editPropertyMode ? (
            <>
              <p> 
              <label><strong>Landlord/Organisation:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.inquirer}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, inquirer: e.target.value })
                }
              /></p>
                <p> 
                <label><strong>City:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.city}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, city: e.target.value })
                }
              /></p>
                <p> 
                <label><strong>Address:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, address: e.target.value })
                }
              /></p>
              <p> 
                  <label><strong>Property Type:</strong></label> 
                  <select
                    className="border p-2 w-full my-1"
                    value={selectedPropety.property_type}
                    onChange={(e) =>
                      setSelectedProperty({
                        ...selectedPropety,
                        property_type: e.target.value as Property['property_type'],
                      })
                    }
                  >
                    <option value="Office">Office</option>
                    <option value="Retail">Retail</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
              </p>

              <p> 
              <label><strong>Building rateable value:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.building_rateable_value ?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    building_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
              <p> 
              <label><strong>Rates payable before relief:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.rates_payable_before_relief ?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
              <label className="inline-flex items-center space-x-2 my-1">
                <input
                  type="checkbox"
                  checked={selectedPropety.has_car_park}
                  onChange={(e) =>
                    setSelectedProperty({
                      ...selectedPropety,
                      has_car_park: e.target.checked, // ✅ checkbox gives true/false
                    })
                  }
                />
                <span><strong>Has Car Park?</strong></span>
              </label>
              <p> 
              <label><strong>Car park rateable value:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.car_park_rateable_value ?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    car_park_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
                <p> 
                <label><strong>Car park rates payable before relief:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.car_park_rates_payable_before_relief ?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    car_park_rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
                <p> 
                <label><strong>Total rateable value:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.total_rateable_value ?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    total_rateable_value : e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
                <p> 
                <label><strong>Total rate payable:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.total_rate_payable ?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    total_rate_payable : e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
              {/* Repeat for other fields */}
            </>
          ) : (
            <>
              <p><strong>Landlord/Organisation:</strong> {selectedPropety.inquirer}</p>
              <p><strong>City:</strong> {selectedPropety.city}</p>
              <p><strong>Address:</strong> {selectedPropety.address}</p>
              <p><strong>Property Type:</strong> {selectedPropety.property_type}</p>
              <p><strong>Building rateable value:</strong> {selectedPropety.building_rateable_value}</p>
              <p><strong>Rates payable before relief:</strong> {selectedPropety.rates_payable_before_relief}</p>
              <p><strong>Has car park:</strong> {selectedPropety.has_car_park ? 'Yes' : 'No'}</p>
              <p><strong>Car park rateable value:</strong> {selectedPropety.car_park_rateable_value}</p>
              <p><strong>Car park rates payable before relief:</strong> {selectedPropety.car_park_rates_payable_before_relief}</p>
              <p><strong>Total rateable value:</strong> {selectedPropety.total_rateable_value}</p>
              <p><strong>Total rate payable:</strong> {selectedPropety.total_rate_payable}</p>
            </>
          )}

          {/* ACTION BUTTONS */}
            <div className="mt-4 space-x-2">
              {editPropertyMode ? (
                <>
                  <button
                    onClick={async () => {
                      // Call PUT API to update property
                      const res = await fetch(`http://localhost:5000/api/propertiies/${selectedPropety.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(selectedPropety),
                      });
                      if (res.ok) {
                        setEditPropertyMode(false);
                        fetchProperties();
                      } else {
                        alert('Update failed');
                      }
                    }}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditPropertyMode(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditPropertyMode(true)}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        const confirmDelete = confirm('Are you sure you want to delete this property?');
                        if (!confirmDelete) return;
                        const res = await fetch(`http://localhost:5000/api/propertiies/${selectedPropety.id}`, {
                          method: 'DELETE',
                        });
                        if (res.ok) {
                          setSelectedProperty(null);
                          fetchProperties();
                        } else {
                          alert('Delete failed');
                        }
                      }}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setSelectedProperty(null)}
                >
                  Close
                </button>
              </div>

              {personProperties.length > 0 && people.length > 0 && selectedPropety && (
                (() => {
                  const relatedPeople = personProperties
                    .filter((pp) => pp.property_id === selectedPropety.id && pp.is_related)
                    .map((pp) => people.find((p) => p.id === pp.person_id))
                    .filter((p): p is Person => !!p);

                  return (
                    relatedPeople.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">People Related to This Property</h3>
                        <ul className="space-y-2">
                          {relatedPeople.map((person) => (
                            <li key={person.id} className="border p-3 rounded bg-gray-50">
                              {editingPersonIdForProperty === person.id ? (
                                <>
                                  <p>
                                  <label><strong>Name:</strong></label>
                                  <input
                                    className="border p-2 w-full my-1"
                                    value={editedPersonForProperty.name ?? person.name}
                                    onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, name: e.target.value })}
                                  /></p>
                                  
                                  <p>
                                  <label><strong>Organisation:</strong></label>
                                  <input
                                    className="border p-2 w-full my-1"
                                    value={editedPersonForProperty.organisation ?? person.organisation}
                                    onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, organisation: e.target.value })}
                                  /></p>
                                    <p>
                                    <label><strong>Role:</strong></label>
                                    <select
                                      className="border p-2 w-full my-1"
                                      value={editedPersonForProperty.role ?? person.role}
                                      onChange={(e) =>
                                        setEditedPersonForProperty({
                                          ...editedPersonForProperty,
                                          role: e.target.value as Person['role'],
                                        })
                                      }
                                    >
                                      <option value="Est Ag">Est Ag</option>
                                      <option value="Landlord">Landlord</option>
                                      <option value="Ass Man">Ass Man</option>
                                    </select>
                                  </p>


                                  <p>
                                  <label><strong>Email:</strong></label>
                                  <input
                                    className="border p-2 w-full my-1"
                                    value={editedPersonForProperty.email ?? person.email}
                                    onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, email: e.target.value })}
                                  /></p>

                                  <p>
                                  <label><strong>Contact Number:</strong></label>
                                  <input
                                    className="border p-2 w-full my-1"
                                    value={editedPersonForProperty.contact_number ?? person.contact_number}
                                    onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, contact_number: e.target.value })}
                                  /></p>
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      className="bg-gray-300 px-4 py-2 rounded"
                                      onClick={async () => {
                                        const res = await fetch(`http://localhost:5000/api/people/${person.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ ...person, ...editedPersonForProperty }),
                                        });
                                        if (res.ok) {
                                          setEditingPersonIdForProperty(null);
                                          setEditedPersonForProperty({});
                                          fetchPeople();
                                        } else {
                                          alert('Failed to update person');
                                        }
                                      }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="bg-gray-300 px-4 py-2 rounded"
                                      onClick={() => {
                                        setEditingPersonIdForProperty(null);
                                        setEditedPersonForProperty({});
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p><strong>Name:</strong> {person.name}</p>
                                  <p><strong>Organisation:</strong> {person.organisation}</p>
                                  <p><strong>Role:</strong> {person.role}</p>
                                  <p><strong>Email:</strong> {person.email}</p>
                                  <p><strong>Contact Number:</strong> {person.contact_number}</p>

                                  <div className="flex gap-2 mt-2">
                                    <button
                                      className="bg-gray-300 px-4 py-2 rounded"
                                      onClick={() => {
                                        setEditingPersonIdForProperty(person.id);
                                        setEditedPersonForProperty(person);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="bg-gray-300 px-4 py-2 rounded"
                                      onClick={async () => {
                                        const confirmDelete = confirm('Are you sure you want to delete this person?');
                                        if (!confirmDelete) return;
                                        const res = await fetch(`http://localhost:5000/api/people/${person.id}`, {
                                          method: 'DELETE',
                                        });
                                        if (res.ok) {
                                          fetchPeople();
                                          fetchPersonProperties();
                                        } else {
                                          alert('Delete failed');
                                        }
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  );
                })()
              )}
            </div>
          )}
      </div>    
    </div>
  );
}
