import React from 'react';
import type { Person, Property, PersonProperty } from '../../pages/dashboard';



interface Props {
    selectedPerson: Person;
    selectedPropety: Property | null; 
    personProperties: PersonProperty[];
    properties: Property[];
    editPersonMode: boolean;
    setSelectedPerson: (p: Person | null) => void;
    setEditPersonMode: (mode: boolean) => void;
    fetchPeople: () => void;
    fetchProperties: () => void;
    fetchPersonProperties: () => void;
    editingPropertyId: number | null;
    editedProperty: Partial<Property>;
    setSelectedProperty: (p: Property | null) => void;
    setEditedProperty: (p: Partial<Property>) => void;
    setEditingPropertyId: (id: number | null) => void;
  }
  
  const PersonDetails: React.FC<Props> = ({
    selectedPerson,
    selectedPropety,
    personProperties,
    properties,
    editPersonMode,
    setSelectedProperty,
    setSelectedPerson,
    setEditPersonMode,
    fetchPeople,
    fetchProperties,
    fetchPersonProperties,
    editingPropertyId,
    editedProperty,
    setEditedProperty,
    setEditingPropertyId,
  }) => {
    const relatedProperties = personProperties
      .filter(pp => pp.person_id === selectedPerson.id && pp.is_related)
      .map(pp => properties.find(prop => prop.id === pp.property_id))
      .filter((p): p is Property => !!p);

      return (
        <div className="container mt-4">
          
           <div className="row">
            {/* Left Column – Person Details */}
              <div className="col-md-6">
                <div className="card shadow-sm rounded">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Report For <strong>{selectedPerson.name}</strong></h5>
                    {/* Person Info Form */}
                    {editPersonMode ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label"><strong>Name:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.name}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, name: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Organisation:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.organisation}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, organisation: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Role:</strong></label>
                          <select
                            className="form-select"
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
                            <option value="property Manager">Property Manager</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Email:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.email}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, email: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Contact:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.contact_number}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, contact_number: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Property address for enquiry:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.property_address_for_enquiry}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, property_address_for_enquiry: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>Name:</strong> {selectedPerson.name}</p>
                        <p><strong>Last Name:</strong> {selectedPerson.family}</p>
                        <p><strong>Organisation:</strong> {selectedPerson.organisation}</p>
                        <p><strong>Role:</strong> {selectedPerson.role}</p>
                        <p><strong>Email:</strong> {selectedPerson.email}</p>
                        <p><strong>Contact:</strong> {selectedPerson.contact_number}</p>
                        <p><strong>Property address for enquiry:</strong> {selectedPerson.property_address_for_enquiry}</p>
                      </>
                    )}

                    <div className="mt-3">
                      {editPersonMode ? (
                        <>
                          <button className="btn btn-success me-2" onClick={async () => {
                            const res = await fetch(`http://localhost:5000/api/people/${selectedPerson.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(selectedPerson),
                            });
                            if (res.ok) {
                              const bc = new BroadcastChannel('dashboard-updates');
                              bc.postMessage('person-updated');
                              bc.close();
                              setEditPersonMode(false);
                              fetchPeople();
                            } else {
                              alert('Failed to update person');
                            }
                          }}>Save</button>
                          <button className="btn btn-secondary" onClick={() => setEditPersonMode(false)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary me-2" onClick={() => setEditPersonMode(true)}>Edit</button>
                          <button className="btn btn-danger me-2" onClick={async () => {
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
                          }}>Delete</button>
                          <button className="btn btn-secondary" onClick={() => setSelectedPerson(null)}>Close</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column – Related Properties */}
              <div className="col-md-6">
                <div className="card shadow-sm rounded">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Related Properties</h5>
                    <ol className="list-group list-group-numbered">
                      {relatedProperties.map((property) => {
                        const isExpanded = selectedPropety?.id === property.id;
                        return (
                          <li key={property.id} className="list-group-item">
                            <div
                              className="text-primary fw-bold cursor-pointer"
                              onClick={() => setSelectedProperty(isExpanded ? null : property)}
                            >
                              {property.address}, {property.post_code}
                            </div>
                            {isExpanded && (
                              <div className="mt-2">
                                <p><strong>Type:</strong> {property.property_type}</p>
                                <p><strong>City:</strong> {property.city}</p>
                                <p><strong>Rates Payable:</strong> {property.rates_payable_before_relief}</p>
                                <p><strong>Has Car Park:</strong> {property.has_car_park ? 'Yes' : 'No'}</p>
                                {/* Add more details or buttons here as needed */}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>



           </div>
                  <h2 className="text-xl font-semibold mb-2">Report For {selectedPerson.name}</h2>
                  {/* ✅ Place this inside the block, right after opening it: */}
                  {(() => {
                    const relatedProperties = personProperties
                      .filter((pp) => pp.person_id === selectedPerson.id && pp.is_related)
                      .map((pp) => properties.find((prop) => prop.id === pp.property_id))
                      .filter((p): p is Property => !!p); // remove undefined values
        
                    return (
                      <>
                        {/* Person Details + Edit Mode UI (already in your code) */}
                          
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
                                <option value="property Manager">property Man</option>
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
                            <p>
                            <label><strong>property address for enquiry:</strong></label>
                            <input
                              className="border p-2 w-full my-1"
                              value={selectedPerson.property_address_for_enquiry}
                              onChange={(e) =>
                                setSelectedPerson({ ...selectedPerson, property_address_for_enquiry: e.target.value })
                              }
                            /></p>
                          </>
                        ) : (
                          <>
                            <p><strong>Name:</strong> {selectedPerson.name}</p>
                            <p><strong>Last Name:</strong> {selectedPerson.family}</p>
                            <p><strong>Organisation:</strong> {selectedPerson.organisation}</p>
                            <p><strong>Role:</strong> {selectedPerson.role}</p>
                            <p><strong>Email:</strong> {selectedPerson.email}</p>
                            <p><strong>Contact:</strong> {selectedPerson.contact_number}</p>
                            <p><strong>property address for enquiry:</strong> {selectedPerson.property_address_for_enquiry}</p>
                          </>
                        )}
        
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
                                    
                                    //updata dashboard tabs
                                    const bc = new BroadcastChannel('dashboard-updates');
                                    bc.postMessage('person-updated');
                                    bc.close();
                             
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
                            

                            <ol className="space-y-2 list-decimal list-inside">
                            {relatedProperties.map((property) => {
                              const isExpanded = selectedPropety?.id === property.id;

                              return (
                                    <li key={property.id}  className="border p-3 rounded bg-gray-50">
                                      <div
                                        className="border font-semibold text-blue-600 p-3 rounded bg-gray-50 cursor-pointer hover:bg-gray-100"
                                        onClick={() => setSelectedProperty(isExpanded ? null : property)}
                                      > 
                                        {property.address}, {property.post_code}
                                      </div>

                                      {isExpanded && (
                                        <div className="mt-3">
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
                                              <label><strong>Donation Due:</strong></label>
                                              <input
                                                className="border p-1 w-full my-1"
                                                type="date"
                                                value={
                                                  editedProperty.donation_due
                                                    ? new Date(editedProperty.donation_due).toISOString().split('T')[0]
                                                    : property.donation_due
                                                    ? new Date(property.donation_due).toISOString().split('T')[0]
                                                    : ''
                                                }
                                                onChange={(e) =>
                                                  setEditedProperty({
                                                    ...editedProperty,
                                                    donation_due: e.target.value === '' ? null : new Date(e.target.value),
                                                  })
                                                }
                                              />
                                              <p> 
                                              <label><strong>Landloard Adress:</strong></label>     
                                              <input
                                                className="border p-1 w-full my-1"
                                                value={editedProperty.landlord_Address ?? property.landlord_Address}
                                                onChange={(e) => setEditedProperty({ ...editedProperty, landlord_Address : e.target.value })}
                                              /></p>
                                              <p> 
                                              <label><strong>Landloard email:</strong></label>     
                                              <input
                                                className="border p-1 w-full my-1"
                                                value={editedProperty.landlord_email ?? property.landlord_email}
                                                onChange={(e) => setEditedProperty({ ...editedProperty, landlord_email : e.target.value })}
                                              /></p>  
                  
                                              {/* Add other fields similarly... */}
                                              <div className="flex gap-2 mt-2">
                                                <button
                                                 className="btn btn-danger"
                                                  onClick={async () => {
                                                    const res = await fetch(`http://localhost:5000/api/propertiies/${property.id}`, {
                                                      method: 'PUT',
                                                      headers: { 'Content-Type': 'application/json' },
                                                      body: JSON.stringify({ ...property, ...editedProperty }),
                                                    });
                                                    if (res.ok) {
                                                      // tell all dashboard tabs to refresh
                                                      const bc = new BroadcastChannel('dashboard‑updates')
                                                      bc.postMessage('property‑updated')
                                                      bc.close()
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
                                              <p><strong>Address:</strong> {property.address}{property.post_code}</p>
                                              <p><strong>Property Type:</strong> {property.property_type}</p>
                                              <p><strong>Building rateable value:</strong> {property.building_rateable_value}</p>
                                              <p><strong>Rates payable before relief:</strong> {property.rates_payable_before_relief}</p>
                                              <p><strong>Has car park:</strong> {property.has_car_park ? 'Yes' : 'No'}</p>
                                              <p><strong>Car park rateable value:</strong> {property.car_park_rateable_value}</p>
                                              <p><strong>Car park rates payable before relief:</strong> {property.car_park_rates_payable_before_relief}</p>
                                              <p><strong>Total rateable value:</strong> {property.total_rateable_value}</p>
                                              <p><strong>Total rate payable:</strong> {property.total_rate_payable}</p>
                                              <p><strong>Dontion:</strong>{property.donation_due
                                                    ? new Date(property.donation_due).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                  
                                              {/*<p><strong>Landlord name :</strong> {property}</p>*/}
                                              <p><strong>Landlord email address :</strong> {property.landlord_email}</p>
                                              <p><strong>Landlord phone number :</strong> {property.landlord_no}</p>
                                              <p><strong>Rateable Multiplier applicable for the property :</strong> {property.rates_multiplier}</p>            
                                              
                                              <p><strong>Agreed Start data of lease:</strong> {property.start_date_of_lease
                                                    ? new Date(property.start_date_of_lease).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              <p><strong>End data of lease:</strong> {property.end_date_of_lease
                                                    ? new Date(property.end_date_of_lease).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              <p><strong>Length Of Lease:</strong> {property.length_of_lease}</p>
                  
                                        
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
                                        </div>
                                      )}
                                    </li>
                              );
                            })}
                          </ol>

















{/*

                            <ol className="space-y-2">
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
                                    <label><strong>Donation Due:</strong></label>
                                    <input
                                      className="border p-1 w-full my-1"
                                      type="date"
                                      value={
                                        editedProperty.donation_due
                                          ? new Date(editedProperty.donation_due).toISOString().split('T')[0]
                                          : property.donation_due
                                          ? new Date(property.donation_due).toISOString().split('T')[0]
                                          : ''
                                      }
                                      onChange={(e) =>
                                        setEditedProperty({
                                          ...editedProperty,
                                          donation_due: e.target.value === '' ? null : new Date(e.target.value),
                                        })
                                      }
                                    />
                                    <p> 
                                    <label><strong>Landloard Adress:</strong></label>     
                                    <input
                                      className="border p-1 w-full my-1"
                                      value={editedProperty.landlord_Address ?? property.landlord_Address}
                                      onChange={(e) => setEditedProperty({ ...editedProperty, landlord_Address : e.target.value })}
                                    /></p>
                                    <p> 
                                    <label><strong>Landloard email:</strong></label>     
                                    <input
                                      className="border p-1 w-full my-1"
                                      value={editedProperty.landlord_email ?? property.landlord_email}
                                      onChange={(e) => setEditedProperty({ ...editedProperty, landlord_email : e.target.value })}
                                    /></p>  
        
                                    {/* Add other fields similarly... 
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
                                            // tell all dashboard tabs to refresh
                                            const bc = new BroadcastChannel('dashboard‑updates')
                                            bc.postMessage('property‑updated')
                                            bc.close()
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
                                    <p><strong>Address:</strong> {property.address}{property.post_code}</p>
                                    <p><strong>Property Type:</strong> {property.property_type}</p>
                                    <p><strong>Building rateable value:</strong> {property.building_rateable_value}</p>
                                    <p><strong>Rates payable before relief:</strong> {property.rates_payable_before_relief}</p>
                                    <p><strong>Has car park:</strong> {property.has_car_park ? 'Yes' : 'No'}</p>
                                    <p><strong>Car park rateable value:</strong> {property.car_park_rateable_value}</p>
                                    <p><strong>Car park rates payable before relief:</strong> {property.car_park_rates_payable_before_relief}</p>
                                    <p><strong>Total rateable value:</strong> {property.total_rateable_value}</p>
                                    <p><strong>Total rate payable:</strong> {property.total_rate_payable}</p>
                                    <p><strong>Dontion:</strong>{property.donation_due
                                          ? new Date(property.donation_due).toISOString().split('T')[0]
                                          : 'N/A'}
                                    </p>
        
                                    {/*<p><strong>Landlord name :</strong> {property}</p>
                                    <p><strong>Landlord email address :</strong> {property.landlord_email}</p>
                                    <p><strong>Landlord phone number :</strong> {property.landlord_no}</p>
                                    <p><strong>Rateable Multiplier applicable for the property :</strong> {property.rates_multiplier}</p>            
                                    
                                    <p><strong>Agreed Start data of lease:</strong> {property.start_date_of_lease
                                          ? new Date(property.start_date_of_lease).toISOString().split('T')[0]
                                          : 'N/A'}
                                    </p>
                                    <p><strong>End data of lease:</strong> {property.end_date_of_lease
                                          ? new Date(property.end_date_of_lease).toISOString().split('T')[0]
                                          : 'N/A'}
                                    </p>
                                    <p><strong>Length Of Lease:</strong> {property.length_of_lease}</p>
        
                              
                                    {/* ACTION BUTTONS *
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        className="bg-gray-300 px-4 py-2 rounded"
                                        onClick={() => {
                                          //setEditingPropertyId(property.id);
                                          //setEditedProperty(property); // preload existing
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
                            </ol>*/}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

      );
  };  
  export default PersonDetails;