import React from 'react';
import type { Person, Property, PersonProperty } from '../../pages/dashboard';
import { useRouter } from 'next/router';


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

  //

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

    const router = useRouter();
    const relatedProperties = personProperties
      .filter(pp => pp.person_id === selectedPerson.id && pp.is_related)
      .map(pp => properties.find(prop => prop.id === pp.property_id))
      .filter((p): p is Property => !!p);

    //keep capital first letter of each name like 'Jone Poul'
    const capitalizeWords = (str: string) =>
      str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return (
        <div className="container mt-4">
          
           <div className="row">
            {/* Left Column – Person Details */}
              <div className="col-md-6">
                <div className="card shadow-sm rounded">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Report For <strong>{selectedPerson.name}</strong> as <strong>{selectedPerson.role}</strong></h5>
                    {/* Person Info Form */}
                    {editPersonMode ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label"><strong>First Name:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.name}
                            //onChange={(e) => setSelectedPerson({ ...selectedPerson, name: e.target.value })}
                            onChange={(e) => {
                              const capitalized = capitalizeWords(e.target.value);
                              setSelectedPerson({ ...selectedPerson, name: capitalized });
                            }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Last Name:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.family}
                            //onChange={(e) => setSelectedPerson({ ...selectedPerson,family: e.target.value })}
                            onChange={(e) => {
                              const capitalized = capitalizeWords(e.target.value);
                              setSelectedPerson({ ...selectedPerson, family: capitalized });
                            }}
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
                          <label className="form-label"><strong>Contact Number:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.contact_number}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, contact_number: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Contact's Postcode:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.iqu_post_code_address}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, iqu_post_code_address: e.target.value })}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label"><strong>Contact's Address:</strong></label>
                          <input
                            className="form-control"
                            value={selectedPerson.property_address_for_enquiry}
                            onChange={(e) => setSelectedPerson({ ...selectedPerson, property_address_for_enquiry: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p><strong>First Name:</strong> {selectedPerson.name}</p>
                        <p><strong>Last Name:</strong> {selectedPerson.family}</p>
                        <p><strong>Organisation:</strong> {selectedPerson.organisation}</p>
                        <p><strong>Role:</strong> {selectedPerson.role}</p>
                        <p><strong>Email:</strong> {selectedPerson.email}</p>
                        <p><strong>Contact Number:</strong> {selectedPerson.contact_number}</p>
                        <p><strong>Contact's Postcode:</strong> {selectedPerson.iqu_post_code_address}</p>
                        <p><strong>Contact's Address:</strong> {selectedPerson.property_address_for_enquiry}</p>
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
                          <button
                            className="btn btn-secondary"
                            onClick={() => router.push('/dashboard')}
                          >
                            Back to Dashboard
                          </button>
                          {/*<button className="btn btn-secondary" onClick={() => setSelectedPerson(null)}>Close</button>*/}
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
                            <span
                              style={{ cursor: 'pointer' }}
                              className="text-primary fw-bold cursor-pointer"
                              onClick={() => setSelectedProperty(isExpanded ? null : property)}
                            >            
                                {[
                                    property.property_floor,
                                    property.property_first_line_address,
                                    property.property_second_line_address,
                                    property.post_code,
                                  ]
                                    .filter(Boolean) // Removes any empty, null, or undefined values
                                    .join(' _ ') || 'Address'}
                            </span>
                            {isExpanded && (
                              <div className="mt-3">                            
                                          {editingPropertyId === property.id ? (
                                            <>
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Landlord/Organisation:</strong></label>                         
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.inquirer ?? property.inquirer}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, inquirer: e.target.value })}
                                                />                                            
                                              </div>

                                              <div className="mb-3">
                                                <label className="form-label">
                                                    <input
                                                      type="checkbox"
                                                      className="form-check-label"
                                                      checked={editedProperty.property_solely_occupied?? property.property_solely_occupied}
                                                      onChange={(e) =>
                                                        setEditedProperty({ ...editedProperty, property_solely_occupied: e.target.checked })
                                                      }
                                                    />
                                                    <span><strong>Is the property solely occupied?</strong></span>
                                                  </label>
                                              </div>
                                                     
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Floor Number:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.property_floor ?? property.property_floor }
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, property_floor : e.target.value })}
                                                />
                                              </div>
                                              
                                              
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Property Fisrt Line Address:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.property_first_line_address ?? property.property_first_line_address}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, property_first_line_address: e.target.value })}
                                                />
                                              </div>
                                              
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Property Second Line Address::</strong></label>     
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.property_second_line_address ?? property.property_second_line_address}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, property_second_line_address: e.target.value })}
                                                />
                                              </div>

                                              <div className="mb-3">
                                                <label className="form-label"><strong>City:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.city ?? property.city}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, city: e.target.value })}
                                                />
                                              </div>                                   
                                         
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Post Code:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.post_code?? property.post_code}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, post_code: e.target.value })}
                                                />
                                              </div>
                                        
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Property Type:</strong></label>     
                                                  <select
                                                    className="form-control"
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
                                              </div>
                  
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Property rateable value:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.building_rateable_value ?? property.building_rateable_value ?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty, building_rateable_value: e.target.value === '' ? null : Number(e.target.value) })
                                                  }
                                                />
                                              </div>
                                           
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Rates payable before relief per year:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.rates_payable_before_relief?? property.rates_payable_before_relief?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty, rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value) })
                                                  }
                                                />
                                              </div>
                                            
                                              <div className="mb-3">
                                                <label className="form-label">
                                                    <input
                                                      type="checkbox"
                                                      className="form-check-label"
                                                      checked={editedProperty.has_car_park ?? property.has_car_park}
                                                      onChange={(e) =>
                                                        setEditedProperty({ ...editedProperty, has_car_park: e.target.checked })
                                                      }
                                                    />
                                                    <span><strong>Has Car Park?</strong></span>
                                                  </label>
                                              </div>
                                     
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Car park rateable value:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.car_park_rateable_value ?? property.car_park_rateable_value ?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty, car_park_rateable_value: e.target.value === '' ? null : Number(e.target.value) })
                                                  }
                                                />
                                              </div>
                                        
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Car park rates payable before relief per year:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.car_park_rates_payable_before_relief ?? property.car_park_rates_payable_before_relief ?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty,car_park_rates_payable_before_relief : e.target.value === '' ? null : Number(e.target.value) })
                                                  }
                                                />
                                              </div>
                                    
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Total rateable value:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.total_rateable_value ?? property.total_rateable_value?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty, total_rateable_value: e.target.value === '' ? null : Number(e.target.value) })
                                                  }
                                                />
                                              </div>
                                   
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Total rate payable:</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.total_rate_payable ?? property.total_rate_payable ?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty, total_rate_payable: e.target.value === '' ? null : Number(e.target.value) })
                                                  }
                                                />
                                              </div>

                                              
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Rates Multiplier applicable for the property :</strong></label>     
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  value={editedProperty.rates_multiplier ?? property.rates_multiplier ?? ''}
                                                  onChange={(e) =>
                                                    setEditedProperty({ ...editedProperty, rates_multiplier: e.target.value , })
                                                  }
                                                />
                                              </div>

 
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Donation Due:</strong></label>
                                                <input
                                                  className="form-control"
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
                                              </div>
                                                
                                              <div className="mb-3">
                                                <label className="form-label"><strong> Start Date of Lease:</strong></label>
                                                  <input
                                                    type="date"
                                                    className="form-control"
                                                    value={
                                                      editedProperty.start_date_of_lease &&
                                                      !isNaN(new Date(editedProperty.start_date_of_lease as unknown as string).getTime())
                                                        ? new Date(editedProperty.start_date_of_lease as unknown as string).toISOString().split("T")[0]
                                                        : ""

                                                    }
                                                    onChange={(e) =>
                                                      setEditedProperty({
                                                        ...editedProperty,
                                                        start_date_of_lease: e.target.value ? new Date(e.target.value) : null,
                                                      })
                                                    }
                                                  />
                                              </div>
                                              
                                              <div className="mb-3">
                                                <label className="form-label"><strong> End Date of Lease:</strong></label>
                                                  <input
                                                    type="date"
                                                    className="form-control"
                                                    value={
                                                      editedProperty.end_date_of_lease &&
                                                      !isNaN(new Date(editedProperty.end_date_of_lease as unknown as string).getTime())
                                                      ? new Date(editedProperty.end_date_of_lease as unknown as string).toISOString().split("T")[0]
                                                      : ""
                                                    
                                                    }
                                                    onChange={(e) =>
                                                      setEditedProperty({
                                                        ...editedProperty,
                                                        end_date_of_lease: e.target.value ? new Date(e.target.value) : null,
                                                      })
                                                    }
                                                  />
                                              </div>

                                              <div className="mb-3" key="length_of_lease">
                                                <label  className="form-label">
                                                  <strong>Length of Lease (days):</strong>
                                                </label>
                                                <input
                                                  className="form-control"
                                                  value={editedProperty.length_of_lease}
                                                  readOnly
                                                />
                                              </div>
                                              

                                              <div className="mb-3">
                                                <label className="form-label"><strong>Landloard register Adress:</strong></label>     
                                                <input
                                                  placeholder="Landlord Address"
                                                  className="form-control"
                                                  value={editedProperty.landlord_Address ?? property.landlord_Address}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, landlord_Address : e.target.value })}
                                                />
                                              </div>

                                              <div className="mb-3">
                                                <label  className="form-label">
                                                  <strong>
                                                    Landlord Postcode
                                                  </strong>                                        
                                                </label>
                                                <input
                                                  className="form-control"
                                                  placeholder="Landlord postcode"
                                                  value={editedProperty.landlord_post_code_address}
                                                  onChange={(e) =>
                                                    setEditedProperty({
                                                      ...editedProperty,
                                                      landlord_post_code_address: e.target.value,
                                                    })
                                                  }
                                                />
                                                </div>
                                             
                                              <div className="mb-3">
                                                <label className="form-label"><strong>Landloard email:</strong></label>     
                                                <input
                                                  placeholder="Landlord emai"
                                                  className="form-control"
                                                  value={editedProperty.landlord_email ?? property.landlord_email}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, landlord_email : e.target.value })}
                                                />
                                              </div>
                                                  
                                              <div className="mb-3">
                                                <label  className="form-label"><strong>Landlord Contact Number:</strong></label>
                                                <input
                                                  className="form-control"
                                                  placeholder="Landlord Contact Number"
                                                  value={editedProperty.landlord_no}
                                                  onChange={(e) => setEditedProperty({ ...editedProperty, landlord_no: e.target.value })}
                                                />
                                                </div>
                  
                                              {/* Add other fields similarly... */}
                                              <div className="flex gap-2 mt-2">
                                                <button
                                                 className="btn btn-success me-2" 
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
                                                  className="btn btn-secondary"
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
                                              <p><strong>Is the property solely occupied? :</strong> {property.has_car_park ? 'Yes' : 'No'}</p>
                                              <p><strong>Floor Number:</strong> {property.city}</p>
                                              <p><strong>Property Fisrt Line Address:</strong> {property.city}</p>
                                              <p><strong>Property Second Line Address:</strong> {property.city}</p>
                                              <p><strong>City:</strong> {property.city}</p>
                                              <p><strong>Post Code:</strong> {property.city}</p>
                                              <p><strong>Property Type:</strong> {property.property_type}</p>
                                              <p><strong>Property rateable value:</strong> {property.building_rateable_value}</p>
                                              <p><strong>Rates payable before relief per year:</strong> {property.rates_payable_before_relief}</p>
                                              <p><strong>Has car park:</strong> {property.has_car_park ? 'Yes' : 'No'}</p>
                                              <p><strong>Car park rateable value:</strong> {property.car_park_rateable_value}</p>
                                              <p><strong>Car park rates payable before relief per year:</strong> {property.car_park_rates_payable_before_relief}</p>
                                              <p><strong>Total rateable value:</strong> {property.total_rateable_value}</p>                                       
                                              <p><strong>Total Rate Payable:</strong> {property.total_rateable_value}</p>
                                              <p><strong> Rates Multiplier applicable for the property :</strong> {property.total_rateable_value}</p>
                                             
                                           
                                              <p><strong>Donation Due:</strong>{property.donation_due
                                                    ? new Date(property.donation_due).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              
                                              <p><strong>Start Date of Lease:</strong>{property.start_date_of_lease
                                                    ? new Date(property.start_date_of_lease).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              
                                              <p><strong>End data of lease:</strong> {property.end_date_of_lease
                                                    ? new Date(property.end_date_of_lease).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              <p><strong>Length Of Lease:</strong> {property.length_of_lease}</p>
                                         
 
                                              <p><strong>Landlord Register address :</strong> {property.landlord_email}</p>
                                              <p><strong>Landlord Postcode :</strong> {property.landlord_email}</p>
                                              <p><strong>Landlord email :</strong> {property.landlord_email}</p>
                                              <p><strong>Landlord Contact number :</strong> {property.landlord_no}</p>
                                            
                                              
                                              {/* ACTION BUTTONS */}
                                              <div className="flex gap-2 mt-2">
                                                <button
                                                  className="btn btn-primary me-2"
                                                  onClick={() => {
                                                    setEditingPropertyId(property.id);
                                                    setEditedProperty(property); // preload existing
                                                  }}
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  className="btn btn-danger me-2"
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
                  </div>
                </div>
              </div>
           </div>
      </div>
    );
  };  
  export default PersonDetails;