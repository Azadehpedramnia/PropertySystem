// A full-featured dashboard for people, properties, and relationships
// React + Next.js + Tailwind + Typescript compatible

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import RegisterContact from "../components/Dashboard/RegisterContact";
import RegisterProperty from "../components/Dashboard/RegisterProperty";
import SearchComponent from "../components/Dashboard/search";
import PersonDetails from "../components/Dashboard/PersonDetails";
import PropertyDetails from '../components/Dashboard/PropertyDetails';
import ReportTable from '../components/Dashboard/ReportTable';

import { usePeople } from '../hooks/usePeople';

type PropertyType = 'Office' | 'Retail' | 'Warehouse' | string;
type Role = 'Est Agent' | 'Landlord' | 'Property Manager' | string;

export interface Person {
  id: number;
  name: string;
  organisation :string;
  role: Role;
  email:string;
  contact_number:string;
  family : string;
  property_address_for_enquiry:string;
  iqu_post_code_address:string;
}

export interface Property {
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
  landlord_Address :string;
  landlord_email:string;
  landlord_no:string;
  rates_multiplier:string;
  start_date_of_lease:Date| null;         
  end_date_of_lease:Date | null;
  length_of_lease:number;
  landlord_post_code_address:string;
}

export interface PersonProperty {
  id: number;
  is_related: boolean;
  person_name: string;
  property_address: string;
  person_id: number;      // or personId, depending on your naming
  property_id: number;    // or propertyId
}

export interface PropertiesTableProps {
  properties: Property[];
  people: Person[];
  personProperties: PersonProperty[];
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
  const [roles, setRoles] = useState<string[]>([]);
  const defaultRoles = ["Est Agent", "Landlord", "Property Manager"];
  const [allRoles, setAllRoles] = useState<string[]>([]);

  // State for the join table
  const [personProperties, setPersonProperties] = useState<PersonProperty[]>([]);
  
  // NEW: Store the currently clicked/selected person and property from the header
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedPropety, setSelectedProperty] = useState<Property | null>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({});
//
const [searchType, setSearchType] = useState<"people" | "propertiies">("people");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/${searchType}/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
//
  

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
    property_address_for_enquiry:'',
    iqu_post_code_address:''
  });



  useEffect(() => {
    fetch("http://localhost:5000/api/people/role")
    .then((res) => {
      // If your server returns 404 or an error, res.ok might be false
      if (!res.ok) {
        console.error("Error fetching from /api/people/roles:", res.status);
        return [];
      }
      return res.json();
    })
    .then((dbRoleArray: string[]) => {
      // Merge with defaults, remove duplicates
      const merged = [...new Set([...defaultRoles, ...(dbRoleArray || [])])];
      setAllRoles(merged);
    })
    .catch((err) => console.error("Fetch error:", err));
  }, [defaultRoles]);


  // 3) On mount, fetch distinct roles
  useEffect(() => {
    fetch('http://localhost:5000/api/people/role')
      .then((res) => res.json())
      .then((data: string[]) => setRoles(data))
      .catch((err) => console.error('Error fetching role:', err));
  }, []);

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
    landlord_Address:'',
    landlord_email:'',
    landlord_no:'',
    rates_multiplier:'',
    start_date_of_lease:null,
    end_date_of_lease:null,
    length_of_lease:0,
    landlord_post_code_address:'',   
  });


  
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
    window.open(`/contact/${person.id}`, '_blank')
    //setSelectedPerson(person);
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
      property_address_for_enquiry:'',
      iqu_post_code_address:''    
    });
    // Reload table
    fetchPeople();
  };


 // Auto-calculate lease length when both start and end dates are set.
  useEffect(() => {
    if (newProperty.start_date_of_lease && newProperty.end_date_of_lease) {
      const start = new Date(newProperty.start_date_of_lease);
      const end = new Date(newProperty.end_date_of_lease);
      if (end >= start) {
        // getTime() returns the numeric timestamp
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
        setNewProperty(prev => ({
          ...prev,
          length_of_lease: diffDays
        }));
      } else {
        // Option A: Reset length to 0 (or remove it)
        setNewProperty(prev => ({
          ...prev,
          length_of_lease: 0
        }));

        // Optionally, show a warning
        alert("End date must be on or after the start date.");
          }
    }
  }, [newProperty.start_date_of_lease, newProperty.end_date_of_lease]);

  
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
        landlord_Address:'',
        landlord_email:'',
        landlord_no:'',       
        rates_multiplier:'',
        start_date_of_lease:null,
        end_date_of_lease:null,
        length_of_lease:0,
        landlord_post_code_address:'',
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



    
  // In Dashboard.tsx updating table data after save  editing data
  useEffect(() => {
    const bc = new BroadcastChannel('dashboard-updates');

    bc.onmessage = (event) => {
      if (event.data === 'person-updated') {
        fetchPeople();
        fetchPersonProperties();
      }
      if (event.data === 'property-updated') {
        fetchProperties();
        fetchPersonProperties();
      }
    };

    return () => {
      bc.close();
    };
  }, [fetchPeople, fetchProperties, fetchPersonProperties]);
    ///////////////////


  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Logout Button on the left */}
          <button onClick={handleLogout} className="btn btn-secondary">
            Sign Out
          </button>

          {/* Search Component on the right */}
          <SearchComponent />
      </div>   

      {/* */}
     

      <div className="mb-6 p-4 border rounded-lg  position-relative" style={{ position: 'relative' }}>
         <h2 className="text-lg font-semibold">Report</h2>

        
            {/*Relation report table */}
            <ReportTable
              people={people}
              properties={properties}
              personProperties={personProperties}
              handlePersonHeaderClick={handlePersonHeaderClick}
              handlePropertyHeaderClick={handlePropertyHeaderClick}
              handleToggle={handleToggle}
            />
                
            {/* contact report*/}
            {selectedPerson && (
              <PersonDetails
                selectedPerson={selectedPerson}
                personProperties={personProperties}
                properties={properties}
                editPersonMode={editPersonMode}
                setSelectedPerson={setSelectedPerson}
                setEditPersonMode={setEditPersonMode}
                fetchPeople={fetchPeople}
                fetchProperties={fetchProperties}
                fetchPersonProperties={fetchPersonProperties}
                editingPropertyId={editingPropertyId}
                editedProperty={editedProperty}
                setEditedProperty={setEditedProperty}
                setEditingPropertyId={setEditingPropertyId}
              />
            )}

            {/*property report */}
            {selectedPropety && (
            <PropertyDetails
            selectedPropety={selectedPropety}
            editPropertyMode={editPropertyMode}
            personProperties={personProperties}
            people={people}
            fetchPeople={fetchPeople}
            fetchPersonProperties={fetchPersonProperties}
            fetchProperties={fetchProperties}
            setSelectedProperty={setSelectedProperty}
            setEditPropertyMode={setEditPropertyMode}
            setSelectedPerson={setSelectedPerson}
            setEditingPersonIdForProperty={setEditingPersonIdForProperty}
            editingPersonIdForProperty={editingPersonIdForProperty}
            editedPersonForProperty={editedPersonForProperty}
            setEditedPersonForProperty={setEditedPersonForProperty}
          />
        )}
  
      </div>  

      {/* */}

      
        {/* Registration*/}
        <div className="row  mb-6 p-4 border rounded-lg">
          <div className="container my-4">
                <div className="row g-4">
                      <div className="col-md-6">  
                          {/* Registration contact*/}             
                          <RegisterContact
                            newPerson={newPerson}
                            setNewPerson={setNewPerson}
                            addPersoon={addPersoon}
                            allRoles={allRoles}
                          />
                      </div>
                      <div className="col-md-6"> 
                        {/* Registration property*/}              
                        <RegisterProperty
                            newProperty={newProperty}
                            setNewProperty={setNewProperty}
                            addProperrty={addProperrty}
                          />
                      </div>
                </div>
          </div> 
        </div>
    </div>
    
  );


}
