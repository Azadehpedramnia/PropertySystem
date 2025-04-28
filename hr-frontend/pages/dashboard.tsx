// A full-featured dashboard for people, properties, and relationships
// React + Next.js + Tailwind + Typescript compatible

import { useEffect, useState, useRef ,useCallback  } from 'react';
import { useRouter } from 'next/router';
import RegisterContact from "../components/Dashboard/RegisterContact";
import RegisterProperty from "../components/Dashboard/RegisterProperty";
import SearchComponent from "../components/Dashboard/search";
import PersonDetails from "../components/Dashboard/PersonDetails";
import PropertyDetails from '../components/Dashboard/PropertyDetails';
import ReportTable from '../components/Dashboard/ReportTable';

//import { usePeople } from '../hooks/usePeople';

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
  lease_duration_text: string;
  landlord_post_code_address:string;
  property_first_line_address:string;
  property_second_line_address:string;
  property_floor:string;
  property_solely_occupied:boolean;
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
  //const [newPersonName, setNewPersonName] = useState('');
 // const [newPropertyAddress, setNewPropertyAddress] = useState('');
  const [editingPersonIdForProperty, setEditingPersonIdForProperty] = useState<number | null>(null);
  const [editedPersonForProperty, setEditedPersonForProperty] = useState<Partial<Person>>({});
  //const [openPersonPopups, setOpenPersonPopups] = useState<Person[]>([]);
  //const [roles, setRoles] = useState<string[]>([]);

  const [allRoles, setAllRoles] = useState<string[]>([]);
  //const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  //scrooling smooth after click on floor and neighbour and template
  const registerPropertyRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState(false);
  
  const scrollToRegisterProperty = () => {
    registerPropertyRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    setHighlight(true);                 // Set highlight to true immediately
  };
  

  // State for the join table
  const [personProperties, setPersonProperties] = useState<PersonProperty[]>([]);
  
  // NEW: Store the currently clicked/selected person and property from the header
  //const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedPropety, setSelectedProperty] = useState<Property | null>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({});
//

/////SEARCH PART//////
//const [searchType, setSearchType] = useState<"people" | "propertiies">("people");
//  const [query, setQuery] = useState("");
 // const [results, setResults] = useState<Person | Property[]>([]);
  //const [loading, setLoading] = useState(false);
{/*
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
  };*/}

///////////
  
{/*
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
   */}
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

  const handleSelectPersonToContactForm = (person: Person) => {
    setNewPerson({
      name: person.name,
      family: person.family,
      organisation: person.organisation,
      role: person.role,
      email: person.email,
      contact_number: person.contact_number,
      property_address_for_enquiry: '', // empty by default
      iqu_post_code_address: '', // empty by default
    });
  };
 


// it makes lots of error i dont know why i have to check


//fetching role 
  useEffect(() => {
    fetch("http://localhost:5000/api/people/role")
      .then((res) => {
        if (!res.ok) {
          console.error("Error fetching from /api/people/role:", res.status);
          return [];
        }
        return res.json();
      })
      .then((dbRoles: string[]) => {
        const defaultRoles = ["Est Agent", "Landlord", "Property Manager"]; // Move it here to avoid dependency issues      
        const merged = [...new Set([...defaultRoles, ...(dbRoles || [])])];
        setAllRoles(merged); // this will show in the UI
      })
      .catch((err) => console.error("Fetch error:", err));
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
    lease_duration_text: '',
    landlord_post_code_address:'',   
    property_first_line_address:'',
    property_second_line_address:'',
    property_floor:'',
    property_solely_occupied:false,
  });


  {/*
  // For your join table form:
  const [newPersonProperty, setNewPersonProperty] = useState({
    person_id: 0,
    property_id: 0,
    person_name: '',
    property_address:'',
    is_related: false,
  });*/}
  
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

{/*

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


  useEffect(() => {
    fetchPeople();
    fetchProperties();
    fetchPersonProperties();
  }, []);*/}


  const fetchPeople = useCallback(async () => {
    const res = await fetch('http://localhost:5000/api/people');
    const data = await res.json();
    setPeople(data);
  }, []);

  const fetchProperties = useCallback(async () => {
    const res = await fetch('http://localhost:5000/api/propertiies');
    const data = await res.json();
    setProperties(data);
  }, []);

  const fetchPersonProperties = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/person_property');
      const data = await res.json();
      setPersonProperties(data);
    } catch (error) {
      console.error('Error fetching person_property', error);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
    fetchProperties();
    fetchPersonProperties();
  }, [fetchPeople, fetchProperties, fetchPersonProperties]);


  // --------------------------
  // NEW: Handler for clicking on a Person name  and property address in the header
  // --------------------------
  const handlePersonHeaderClick = (person: Person) => {
    window.open(`/contact/${person.id}`, '_blank')
    //setSelectedPerson(person);
  };

  const handlePropertyHeaderClick = (property: Property) => {
    window.open(`/property/${property.id}`, '_blank')
    //setSelectedProperty(property);
  };

  {/*
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
  
  */}
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
      const diffTime = end.getTime() - start.getTime();
      
      // Calculate total days difference
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // ✅ Now let's calculate years, months, days separately
      const startYear = start.getFullYear();
      const startMonth = start.getMonth();
      const startDate = start.getDate();

      const endYear = end.getFullYear();
      const endMonth = end.getMonth();
      const endDate = end.getDate();

      let years = endYear - startYear;
      let months = endMonth - startMonth;
      let days = endDate - startDate;

      if (days < 0) {
        months -= 1;
        // Adjust days by adding days of previous month
        const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += previousMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      // 👇 Save the info you want inside newProperty
      setNewProperty(prev => ({
        ...prev,
        length_of_lease: diffDays, // keep total days
        lease_duration_text: `${years} years, ${months} months, ${days} days`
      }));

    } else {
      setNewProperty(prev => ({
        ...prev,
        length_of_lease: 0,
        lease_duration_text: "",
      }));
    }
  } else {
    setNewProperty(prev => ({
      ...prev,
      length_of_lease: 0,
      lease_duration_text: "",
    }));
  }
}, [newProperty.start_date_of_lease, newProperty.end_date_of_lease]);


  {/*
      const addProperty = async () => {
    await fetch('http://localhost:5000/api/propertiies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: newPropertyAddress }),
    });
    setNewPropertyAddress('');
    fetchProperties();
  };*/}


  
    // Add Property
    const addProperrty = async (e?: React.FormEvent) => {
      e?.preventDefault(); // Prevent full page reload
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
        lease_duration_text: '',
        landlord_post_code_address:'',
        property_first_line_address:'',
        property_second_line_address:'',
        property_floor:'',
        property_solely_occupied:false,
      });
      // Reload table
      setIsAddModalOpen(false);
      fetchProperties();
    };


    {/*
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
      
      */}
    

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

//listenner for update property and contact person i need both becuse 
// nested to each oth abd break afer implement one
// In Dashboard.tsx updating table data after save  editing data

 useEffect(() => {
  const bc = new BroadcastChannel('dashboard‑updates')
  bc.onmessage = (ev) => {
    if (ev.data === 'property‑updated') {
      fetchProperties()
      fetchPersonProperties()
    }
    if (ev.data === 'person‑updated') {
      fetchPeople()
      fetchPersonProperties()
    }
  }
  return () => bc.close()
}, [fetchProperties, fetchPersonProperties, fetchPeople])
    
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

  //Add property in report table//

  // controls modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // which button was clicked
  const [addModalType,   setAddModalType]   = useState<'floor'|'neighbor'|'template'|null>(null);
  // store the clicked row’s property
  const [selectedPropertyForAdd, setSelectedPropertyForAdd] = useState<Property|null>(null);



  function handleAddProperty(property: Property, type: 'floor'|'neighbor'|'template') {
    console.log('🏷️ button clicked:', property.id, type);
    // 1) Copy *all* fields into your form state so it’s prefilled
    setNewProperty({
      ...property,               // TS will warn if extra keys — spread explicit fields if needed
      // if `property.id` clashes, just omit it or map fields one-by-one
    });
    // 2) Remember which mode
    setAddModalType(type);
    // 3) Show the modal
    setIsAddModalOpen(true);
  }
  



  /////////////////

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
              onAddProperty={(property, type) => {
                handleAddProperty(property, type);
                scrollToRegisterProperty();  // <- Add scrolling here
              }}
              handleSelectPersonToContactForm={handleSelectPersonToContactForm}
            />
            

            {isAddModalOpen && selectedPropertyForAdd && addModalType && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-xl w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Add {addModalType} to {selectedPropertyForAdd.address}
                  </h3>

                  <RegisterProperty
                    newProperty={newProperty}
                    setNewProperty={setNewProperty}
                    onSuccessAdd={() => {
                      setHighlight(false);         // 👈 turn off border here
                      setAddModalType(null);
                      setIsAddModalOpen(false);
                      setSelectedPropertyForAdd(null);
                    }}
                    addProperrty={async () => {
                      // call your existing addProperrty POST
                      await addProperrty(/* you may need to adjust this to use newProperty */);
                      await fetchProperties();       // refresh the table
                      setIsAddModalOpen(false);      // close modal
                    }}
                    // optionally pass `mode={addModalType}` so the form can show/hide fields
                  />

                  <button
                    className="mt-4 text-sm text-gray-500 hover:underline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}


            {/* contact report*/}
            {selectedPerson && (
              <PersonDetails
                selectedPerson={selectedPerson}
                selectedPropety={selectedPropety}
                setSelectedProperty={setSelectedProperty}
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
            //setSelectedPerson={setSelectedPerson}
            setEditingPersonIdForProperty={setEditingPersonIdForProperty}
            editingPersonIdForProperty={editingPersonIdForProperty}
            editedPersonForProperty={editedPersonForProperty}
            setEditedPersonForProperty={setEditedPersonForProperty}
          />
        )}
  
      </div>  

      {/* */}

      
  {/* Registration*/}
  <div className="container my-5">
    <div className="row">
      {/* Registration Heading */}
      <div className="col-12">
        <h2 className="mb-4 text-left">Registration</h2>
      </div>

        {/* Contact Registration Card */}
            <div className="col-md-6 mb-4" >
              <div className="card shadow-sm border-2">
                <div className="card-header bg-light text-dark fw-bold fs-5 border-bottom" 
                style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
                  Register Contact
                </div>
                <div className="card-body">
                  <RegisterContact
                    newPerson={newPerson}
                    setNewPerson={setNewPerson}
                    addPersoon={addPersoon}
                    allRoles={allRoles}
                  />
                </div>
              </div>
            </div>

            {/* Property Registration Card */}
            <div className="col-md-6 mb-4"  ref={registerPropertyRef}>
              <div className={`card shadow-sm border-2 ${highlight ? 'highlighted-card' : ''}`}>
                <div className="card-header bg-light text-dark fw-bold fs-5 border-bottom"
                 style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
                  Register Property
                </div>
                <div className="card-body">
                  <RegisterProperty
                    newProperty={newProperty}
                    setNewProperty={setNewProperty}
                    addProperrty={addProperrty}
                    onSuccessAdd={() => {
                      setHighlight(false);         // 👈 turn off border here
                      setAddModalType(null);
                      setIsAddModalOpen(false);
                      setSelectedPropertyForAdd(null);
                    }}
                  />

                {/* added cancel button is click on add property button */}
                {isAddModalOpen && (
                      <button
                        type="button"
                        className="btn btn-outline-danger mt-2"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          setHighlight(false);
                          setAddModalType(null);
                          setSelectedPropertyForAdd(null);                        
                          setNewProperty({ 
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
                            donation_due: null,
                            post_code: '',
                            landlord_Address: '',
                            landlord_email: '',
                            landlord_no: '',
                            rates_multiplier: '',
                            start_date_of_lease: null,
                            end_date_of_lease: null,
                            length_of_lease: 0,
                            lease_duration_text: '',
                            landlord_post_code_address:'',
                            property_first_line_address:'',
                            property_second_line_address:'',
                            property_floor:'',
                            property_solely_occupied:false,
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}

                </div>
              </div>
            </div>
          </div>
        </div>
    </div>  
  );
}
