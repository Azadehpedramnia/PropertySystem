import React from 'react';
import type { Property, Person, PersonProperty } from '../../pages/dashboard';

interface Props {
    selectedPropety: Property;
    editPropertyMode: boolean;
    personProperties: PersonProperty[];
    people: Person[];
    fetchProperties: () => void;
    fetchPeople: () => void;
    fetchPersonProperties: () => void;  
    setSelectedProperty: (p: Property | null) => void;
    setEditPropertyMode: (mode: boolean) => void;
    //setSelectedPerson: (p: Person | null) => void;
    setEditingPersonIdForProperty: (id: number | null) => void;
    editingPersonIdForProperty: number | null;
    editedPersonForProperty: Partial<Person>;
    setEditedPersonForProperty: (p: Partial<Person>) => void;
  }
  
  const PropertyDetails: React.FC<Props> = ({
    selectedPropety,
    editPropertyMode,
    personProperties,
    people,
    fetchProperties,
    fetchPeople,
    fetchPersonProperties,
    setSelectedProperty,
    setEditPropertyMode,
    //setSelectedPerson,
    setEditingPersonIdForProperty,
    editingPersonIdForProperty,
    editedPersonForProperty,
    setEditedPersonForProperty,
  }) => {
    return (
        
        <div className="p-4 mt-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Report For Address : {selectedPropety.property_first_line_address}_{selectedPropety.property_floor}_{selectedPropety.post_code}</h2>

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
            <p><strong>Dontion:</strong> {selectedPropety.donation_due
                  ? new Date(selectedPropety.donation_due).toISOString().split('T')[0]
                  : 'N/A'}
            </p>
            <p><strong>Landlord name :</strong> {selectedPropety.landlord_Address}</p>
            <p><strong>Landlord email address :</strong> {selectedPropety.landlord_email}</p>
            <p><strong>Landlord phone number :</strong> {selectedPropety.landlord_no}</p>
            <p><strong>Rateable Multiplier applicable for the property :</strong> {selectedPropety.rates_multiplier}</p>            
            <p><strong>Agreed Start data of lease:</strong> {selectedPropety.start_date_of_lease
                ? new Date(selectedPropety.start_date_of_lease).toISOString().split('T')[0]
                : 'N/A'}                
            </p>
            <p><strong>End data of lease:</strong> {selectedPropety.end_date_of_lease
                 ? new Date(selectedPropety.end_date_of_lease).toISOString().split('T')[0]
                 : 'N/A'}
            </p>
            <p><strong>Length Of Lease:</strong> {selectedPropety.length_of_lease}</p>
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

                      // tell all dashboard tabs to refresh
                      const bc = new BroadcastChannel('dashboard‑updates')
                      bc.postMessage('property‑updated')
                      bc.close()


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
                      <ol className="space-y-2">
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

                                <p>
                                <label><strong>Adress:</strong></label>
                                <input
                                  className="border p-2 w-full my-1"
                                  value={editedPersonForProperty.property_address_for_enquiry ?? person.property_address_for_enquiry}
                                  onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, name: e.target.value })}
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
                                        //updata dashboard tabs
                                        const bc = new BroadcastChannel('dashboard-updates');
                                        bc.postMessage('person-updated');
                                        bc.close();

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
                                <p><strong>Address:</strong> {person.property_address_for_enquiry}</p>

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
                      </ol>
                    </div>
                  )
                );
              })()
            )}
          </div>



        





    );
  };
  export default PropertyDetails;