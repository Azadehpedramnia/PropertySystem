// A full-featured dashboard for people, properties, and relationships
// React + Next.js +  Typescript compatible

import { useEffect, useState, useRef ,useCallback  } from 'react';
import { useRouter } from 'next/router';
import RegisterContact from "../components/Dashboard/RegisterContact";
import RegisterProperty from "../components/Dashboard/RegisterProperty";
import SearchComponent from "../components/Dashboard/search";
import PersonDetails from "../components/Dashboard/PersonDetails";
import PropertyDetails from '../components/Dashboard/PropertyDetails';
import ReportTable from '../components/Dashboard/ReportTable';
import Link from 'next/link';

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
  contact_county:string;
  floor_no:string;
  first_line_contac_address:string;
  second_line_contac_address:string;
  contac_city:string;
  organisation_email:string;
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
  total_rate_payable_before_relief: number | null;
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
  property_county:string;
  landlord_county:string;
  donation_due :number | null;
  total_rate_payable_after_relief:number | null;
  landlord_name : string;
  landlord_city:string;
  landlord_first_line_address:string;
  landlord_second_line_address:string;
  landlord_floor_number:string;
  country:string;
  total_rates_payable_before_mandatory_relief:number | null;
  total_rates_payable_before_discretionary_relief:number | null;
  total_rate_payable_after_mandatory_relief:number | null;
  total_rate_payable_after_discretionary_relief:number | null;
  contract_signed:boolean;
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
  const [editingPersonIdForProperty, setEditingPersonIdForProperty] = useState<number | null>(null);
  const [editedPersonForProperty, setEditedPersonForProperty] = useState<Partial<Person>>({});


  const [allRoles, setAllRoles] = useState<string[]>([]);

  //add cansel button aftr click add for new role for contact
  const [showContactCancel, setShowContactCancel] = useState(false);

  //scrooling smooth after click on floor and neighbour and template
  const registerPropertyRef = useRef<HTMLDivElement>(null);
  const [highlightProperty, setHighlightProperty] = useState(false);
  const scrollToRegisterProperty = () => {
    registerPropertyRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    setHighlightProperty(true);                 // Set highlight to true immediately
  };
  
  //smooth scrool to register contact
  const registerPersonRoleRef = useRef<HTMLDivElement>(null);
  const [highlightContact, setHighlightContact] = useState(false);
  const scrollToRegisterContact = () => {
    registerPersonRoleRef.current?.scrollIntoView({ behavior: 'smooth' });
    setHighlightContact(true);
    setShowContactCancel(true); // show cancel button
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

  const [newPerson, setNewPerson] = useState<Omit<Person, 'id'>>({
    name: '',
    organisation: '',
    role: '',
    email: '',
    contact_number: '',
    family:'',
    property_address_for_enquiry:'',
    iqu_post_code_address:'',
    contact_county:'',
    floor_no:'',
    first_line_contac_address:'',
    second_line_contac_address:'',
    contac_city:'',
    organisation_email:'',
  });

  const handleSelectPersonToContactForm = (person: Person) => {
    setNewPerson({
      name: person.name,
      family: person.family,
      organisation: person.organisation,
      role: '',
      email: person.email,
      contact_number: person.contact_number,
      property_address_for_enquiry: person.property_address_for_enquiry, // empty by default
      iqu_post_code_address:person.iqu_post_code_address, // empty by default   
      contact_county:person.contact_county,
      floor_no:person.floor_no,
      first_line_contac_address:person.first_line_contac_address,
      second_line_contac_address:person.second_line_contac_address,
      contac_city:person.contac_city,
      organisation_email:person.organisation_email,
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
    total_rate_payable_before_relief: null,
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
    property_county:'',
    landlord_county:'',
    donation_due:null,
    total_rate_payable_after_relief:null,
    landlord_name:'',
    landlord_city:'',
    landlord_first_line_address:'',
    landlord_second_line_address:'',
    landlord_floor_number:'',
    country:'',
    total_rates_payable_before_mandatory_relief:null,
    total_rates_payable_before_discretionary_relief: null,
    total_rate_payable_after_mandatory_relief:null,
    total_rate_payable_after_discretionary_relief:null,
    contract_signed:false,
  });


  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handlePersonRoleClick = (person: Person) => {
    // example: navigate to /persons/123?role=manager
    router.push({
      pathname: `/contact/${person.id}`,
      query: { role: person.role }
    })
  }

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
      iqu_post_code_address:'' ,  
      contact_county:'' ,
      floor_no:'',
      first_line_contac_address:'',
      second_line_contac_address:'',
      contac_city:'',
      organisation_email:'',
      
    });
    // Reload table
    fetchPeople();
    setHighlightContact(false);
    setShowContactCancel(false);
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
        total_rate_payable_before_relief:null,
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
        property_county:'',
        landlord_county:'',
        donation_due:null,
        total_rate_payable_after_relief:null,
        landlord_name : '',
        landlord_city:'',
        landlord_first_line_address:'',
        landlord_second_line_address:'',
        landlord_floor_number:'',
        country:'',
        total_rates_payable_before_mandatory_relief:null,
        total_rates_payable_before_discretionary_relief:null,
        total_rate_payable_after_mandatory_relief:null,
        total_rate_payable_after_discretionary_relief:null,
        contract_signed:false,
      });
      // Reload table
      setIsAddModalOpen(false);
      fetchProperties();
    };


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

  //Add property in report table//

  // controls modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // which button was clicked
  const [addModalType,   setAddModalType]   = useState<'Floor'|'Neighbor'|'Template'|null>(null);
  // store the clicked row’s property
  const [selectedPropertyForAdd, setSelectedPropertyForAdd] = useState<Property|null>(null);



  function handleAddProperty(property: Property, type: 'Floor'|'Neighbor'|'Template') {
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
  


  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Ivoice page link ****/}
            <div className="d-flex gap-3 mb-4">
            
              {/* Logout Button on the left */}
                <button onClick={handleLogout} className="btn btn-secondary">
                  Sign Out
                </button>

              {/* 👇 Add this button */}
              <Link href="/invoice">
                <button className="btn btn-dark">Invoice</button>
              </Link>
            </div>

          {/* Search Component on the right */}
          <SearchComponent />
      </div>   

      {/* */}
      

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
              handlePersonRoleClick={handlePersonRoleClick}
              scrollToRegisterContact={scrollToRegisterContact}
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
                      setHighlightProperty(false);         // 👈 turn off border here
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
            <div className="col-md-6 mb-4"  ref={registerPersonRoleRef}>
              <div className={`card shadow-sm border-2 ${highlightContact ? 'highlighted-card' : ''}`}>
                <div className="card-header bg-light text-dark fw-bold fs-5 border-bottom" 
                style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
                  Register a contact
                </div>
                <div className="card-body">
                  <RegisterContact
                    newPerson={newPerson}
                    setNewPerson={setNewPerson}
                    addPersoon={addPersoon}
                    allRoles={allRoles}
                  />
                    {showContactCancel && (
                      <button
                        type="button"
                        className="btn btn-outline-danger mt-2"
                        onClick={() => {
                          setHighlightContact(false);
                          setShowContactCancel(false);
                          setNewPerson({
                            name: '',
                            organisation: '',
                            role: '',
                            email: '',
                            contact_number: '',
                            family: '',
                            property_address_for_enquiry: '',
                            iqu_post_code_address: '',
                            contact_county:'',
                            floor_no:'',
                            first_line_contac_address:'',
                            second_line_contac_address:'',
                            contac_city:'',
                            organisation_email:'',
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}

                </div>
              </div>
            </div>

            {/* Property Registration Card */}
            <div className="col-md-6 mb-4"  ref={registerPropertyRef}>
              <div className={`card shadow-sm border-2 ${highlightProperty ? 'highlighted-card' : ''}`}>
                <div className="card-header bg-light text-dark fw-bold fs-5 border-bottom"
                 style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
                  Register a property
                </div>
                <div className="card-body">
                  <RegisterProperty
                    newProperty={newProperty}
                    setNewProperty={setNewProperty}
                    addProperrty={addProperrty}
                    onSuccessAdd={() => {
                      setHighlightProperty(false);         //turn off border here
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
                          setHighlightProperty(false);
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
                            total_rate_payable_before_relief: null,
     
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
                            property_county:'',
                            landlord_county:'',
                            donation_due: null,
                            total_rate_payable_after_relief:null,
                            landlord_name:'',
                            landlord_city:'',
                            landlord_first_line_address:'',
                            landlord_second_line_address:'',
                            landlord_floor_number:'',
                            country:'',
                            total_rates_payable_before_mandatory_relief: null,
                            total_rates_payable_before_discretionary_relief:null,
                            total_rate_payable_after_mandatory_relief:null,
                            total_rate_payable_after_discretionary_relief:null,
                            contract_signed:false,
                            
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
