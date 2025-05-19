import type { Property, Person, PersonProperty } from '../../pages/dashboard';
import CreateProposalForm from './CreateProposalForm'; // adjust path if needed
import ProposalStatus from './ProposalStatus';
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

interface Proposal {
  id: number;
  person_id: number;
  property_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  // …other fields if you like
}

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

  //keep capital first letter of each name like 'Jone Poul'
  const capitalizeWords = (str: string) =>
    str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');





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

    const BuildingModelViewer = dynamic(() => import("./BuildingModelViewer"), { ssr: false });//
    const fullPropertyAddress = [
      selectedPropety.property_floor,
      selectedPropety.property_first_line_address,
      selectedPropety.property_second_line_address,
      selectedPropety.city,
      selectedPropety.property_county,
      selectedPropety.post_code
    ]
      .filter(Boolean) // remove any undefined/null/empty values
      .join(', ');

      

    //proposal create form sataes refresh after creat proposal
  const [proposalRefreshKey, setProposalRefreshKey] = useState(0);
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
    const [creatingProposalForPersonId, setCreatingProposalForPersonId] = React.useState<number | null>(null);

     // load (and reload) all proposals
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/proposals');
        if (!res.ok) throw new Error(await res.text());
        setAllProposals(await res.json());
      } catch (err) {
        console.error('Could not load proposals', err);
      }
    }
    load();
  }, [proposalRefreshKey]);  


    return (
        
        <div className="p-4 mt-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">
            Report For :{selectedPropety.property_floor}_{selectedPropety.property_first_line_address}__{selectedPropety.post_code}
        </h2>

        {/* Show 3D model of the propert if selected property*/}
        {selectedPropety && (
          <div className="my-4">
            <h5 className="text-lg font-semibold mb-2">3D Building View</h5>
            <BuildingModelViewer modelPath="/models/PropertyA.glb" />
            
          </div>
        )}

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
              />
            </p>
            <p>
              <label className="form-label d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedPropety.property_solely_occupied ?? false}
                  onChange={(e) =>
                    setSelectedProperty({ ...selectedPropety, property_solely_occupied: e.target.checked })
                  }
                />
                <span><strong>Is The Property Solely Occupied?</strong></span>
              </label>
            </p>

            <p> 
              <label><strong>Floor Number:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.property_floor}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, property_floor: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Property Fisrt Line Address:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_first_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_first_line_address : e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Property Second Line Address:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_second_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_second_line_address : e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>City:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.city}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, city: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>County:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.property_county}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, property_county: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Postcode:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.post_code}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, post_code: e.target.value.toUpperCase(), })
                }
              />
            </p>
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
            <label><strong>Property Rateable Value:</strong></label> 
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
            <label><strong>Rates Payable Before Relief Per Year:</strong></label> 
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
            <label><strong>Car Park Rateable Value:</strong></label> 
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
              <label><strong>Car Park Rates Payable Before Relief Per Year:</strong></label> 
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
              <label><strong>Total Rateable Value:</strong></label> 
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
              <label><strong>Total Rates Payable Before Relief :</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.total_rate_payable_before_relief?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  total_rate_payable_before_relief : e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
            <p> 
            <label><strong>Total Rates Payable After Relief:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.total_rate_payable_after_relief?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  total_rate_payable_after_relief : e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
             <p> 
              <label><strong>Rates Multiplier Of The Property :</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.rates_multiplier}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, rates_multiplier: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Donation Due By Landlord:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.donation_due?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    donation_due : e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
            <p>
            <label className="form-label"><strong>Start Date of Lease:</strong></label>
              <input
                type="date"
                className="form-control"
                value={
                  selectedPropety.start_date_of_lease
                    ? new Date(selectedPropety.start_date_of_lease).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    start_date_of_lease: new Date(e.target.value), // 🔁 convert string to Date
                  })
                }
              />
            </p>

            <p>
            <label className="form-label"><strong>End Date Of Lease:</strong></label>
              <input
                type="date"
                className="form-control"
                value={
                  selectedPropety.end_date_of_lease
                    ? new Date(selectedPropety.end_date_of_lease).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    end_date_of_lease: new Date(e.target.value), // 🔁 convert string to Date
                  })
                }
              />
            </p>
            <p>
            <label className="form-label"><strong>Length of Lease:</strong></label>
              <input
                type="number"
                placeholder="Length of Lease (in days)"
                className="border p-2 w-full my-1"
                value={selectedPropety.length_of_lease}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    length_of_lease: Number(e.target.value) || 0, // fallback to 0 if empty
                  })
                }
              />
            </p>
            <p> 
              <label><strong>County:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.property_county}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, property_county: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Landlord's Name::</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_name}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_name: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Email:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_email}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_email: e.target.value })
                }
              /></p>
            <p> 
            <label><strong>Landlord's Contact Number:</strong></label> 
            <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_no}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_no: e.target.value })
                }
              /></p>
            <p> 
              <label><strong>Landlord's First Address Line:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_first_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_first_line_address: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Second Address Line:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_second_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_second_line_address: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Floor Number:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_floor_number}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_floor_number: e.target.value })
                }
              /></p>
              <p> 
              <label><strong>Landlord's City:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_city}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_city: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's County:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_county}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_county: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Postcode</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_post_code_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_post_code_address: e.target.value.toUpperCase(), })
                }
              /></p>
            {/* Repeat for other fields */}
          </>
        ) : (
          <>

          <p><strong>Landlord/Organisation:</strong> {selectedPropety.inquirer}</p>
           <p><strong>Is The Property Solely Occupied? :</strong> {selectedPropety.has_car_park ? 'Yes' : 'No'}</p>
            <p><strong>Floor Number:</strong> {selectedPropety.property_floor}</p>
            <p><strong>Property Fisrt Line Address:</strong> {selectedPropety.property_first_line_address}</p>
            <p><strong>Property Second Line Address:</strong> {selectedPropety.property_second_line_address}</p>
            <p><strong>City:</strong> {selectedPropety.city}</p>
            <p><strong>Postcode:</strong> {selectedPropety.post_code}</p>
            <p><strong>Property Type:</strong> {selectedPropety.property_type}</p>

            <p><strong>Property Rateable Value:</strong> {selectedPropety.building_rateable_value}</p>
                                              <p><strong>Rates Payable Before Relief Per Year:</strong> {selectedPropety.rates_payable_before_relief}</p>
                                              <p><strong>Has car park:</strong> {selectedPropety.has_car_park ? 'Yes' : 'No'}</p>
                                              <p><strong>Car Park Rateable Value:</strong> {selectedPropety.car_park_rateable_value}</p>
                                              <p><strong>Car Park Rates Payable Before Relief Per Year:</strong> {selectedPropety.car_park_rates_payable_before_relief}</p>
                                              <p><strong>Total Rateable Value:</strong> {selectedPropety.total_rateable_value}</p>                                       
                                              <p><strong>Total Rates Payable Before Relief:</strong> {selectedPropety.total_rate_payable_before_relief}</p>
                                              <p><strong>Total Rates Payable After Relief:</strong> {selectedPropety.total_rate_payable_after_relief}</p>
                                              <p><strong> Rates Multiplier Of The Property:</strong> {selectedPropety.rates_multiplier}</p>
                                             
                                              <p>
                                                <strong>Donation Due By Landlord:</strong> 
                                                {selectedPropety.donation_due !== null && selectedPropety.donation_due !== undefined
                                                  ? `£${selectedPropety.donation_due}`
                                                  : 'N/A'}
                                              </p>
                                              
                                              <p><strong>Start Date of Lease:</strong>{selectedPropety.start_date_of_lease
                                                    ? new Date(selectedPropety.start_date_of_lease).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              
                                              <p><strong>End Data Of Lease:</strong> {selectedPropety.end_date_of_lease
                                                    ? new Date(selectedPropety.end_date_of_lease).toISOString().split('T')[0]
                                                    : 'N/A'}
                                              </p>
                                              <p><strong>Length Of Lease:</strong> {selectedPropety.length_of_lease}</p>
                                         

                                         
                                              <p><strong>Landlord's Name:</strong> {selectedPropety.landlord_name}</p>
                                              <p><strong>Landlord's Email :</strong> {selectedPropety.landlord_email}</p>
                                              <p><strong>Landlord's Contact Number:</strong> {selectedPropety.landlord_no}</p>

                                              <p><strong>Landlord's First Address Line:</strong> {selectedPropety.landlord_first_line_address}</p>
                                              <p><strong>Landlord's Second Address Line:</strong> {selectedPropety.landlord_second_line_address}</p>
                                              <p><strong>Landlord's Floor Number:</strong> {selectedPropety.landlord_floor_number}</p>
                                             
                                              <p><strong>Landlord's City:</strong> {selectedPropety.landlord_city}</p>
                                              <p><strong>Landlord's County:</strong> {selectedPropety.landlord_county}</p>
                                              <p><strong>Landlord's Postcode :</strong> {selectedPropety.landlord_post_code_address}</p>

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
                        {relatedPeople.map((person) => { 
                          
                              // ──❶ Compute this person’s proposals once per render:
                              const mine = allProposals
                              .filter(
                                (p) =>
                                  p.person_id === person.id &&
                                  p.property_id === selectedPropety.id
                              )
                              .sort(
                                (a, b) =>
                                  new Date(b.created_at).getTime() -
                                  new Date(a.created_at).getTime()
                              );

                            // ──❷ Derive latestStatus & latestDate here:
                            const latestStatus =
                              mine.length > 0 ? mine[0].status : 'No proposal';
                            const latestDate =
                              mine.length > 0
                                ? new Date(mine[0].created_at).toLocaleDateString()
                                : '';

                            const latestProposal = mine[0];             // this is undefined if no proposals
                            const proposalId     = latestProposal?.id;  // safely get the id or undefined

                          return(
                          <li key={person.id} className="border p-3 rounded bg-gray-50">
                            {editingPersonIdForProperty === person.id ? (
                              <>

                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>First Name:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.name}
                                                          //onChange={(e) => setSelectedPerson({ ...selectedPerson, name: e.target.value })}
                                                          onChange={(e) => {
                                                            const capitalized = capitalizeWords(e.target.value);
                                                            setEditedPersonForProperty({ ...editedPersonForProperty, name: capitalized });
                                                          }}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Last Name:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.family}
                                                          //onChange={(e) => setSelectedPerson({ ...selectedPerson,family: e.target.value })}
                                                          onChange={(e) => {
                                                            const capitalized = capitalizeWords(e.target.value);
                                                            setEditedPersonForProperty({ ...editedPersonForProperty, family: capitalized });
                                                          }}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Organisation:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.organisation}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, organisation: e.target.value })}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Role:</strong></label>
                                                        <select
                                                          className="form-select"
                                                          value={editedPersonForProperty.role}
                                                          onChange={(e) =>
                                                            setEditedPersonForProperty({
                                                              ...editedPersonForProperty,
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
                                                          value={editedPersonForProperty.email}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, email: e.target.value })}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Contact Number:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.contact_number}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, contact_number: e.target.value })}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>First Address Line:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.first_line_contac_address}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, first_line_contac_address: e.target.value })}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Second Address Line:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.second_line_contac_address}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, second_line_contac_address: e.target.value })}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Floor Number:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.floor_no}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty,floor_no: e.target.value })}
                                                        />
                                                      </div>
                                                      
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>City:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.contac_city}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, contac_city: e.target.value })}
                                                        />
                                                      </div>
                                                   
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>County:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.contact_county}
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, contact_county: e.target.value })}
                                                        />
                                                      </div>
                              
                                                      <div className="mb-3">
                                                        <label className="form-label"><strong>Postcode:</strong></label>
                                                        <input
                                                          className="form-control"
                                                          value={editedPersonForProperty.iqu_post_code_address}
                                                          pattern="^[A-Za-z].*"
                                                          title="Postcode must start with a letter"
                                                          onChange={(e) => setEditedPersonForProperty({ ...editedPersonForProperty, iqu_post_code_address: e.target.value.toUpperCase() })}
                                                        />
                                                      </div>


                               
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
                                <button
                                  className="bg-blue-300 px-4 py-2 rounded"
                                  onClick={() => setCreatingProposalForPersonId(person.id)}
                                >
                                  Create Proposal
                                </button>
                                {creatingProposalForPersonId === person.id && (
                                    <CreateProposalForm
                                      personId={person.id}
                                      propertyId={selectedPropety.id}
                                      RecipiantName ={
                                        selectedPropety.landlord_name?.trim()
                                          ? selectedPropety.landlord_name
                                          : `${person.name} ${person.family}`.trim()
                                      }
                                      RecipiantAddressFloor={
                                        selectedPropety.landlord_floor_number?.trim()
                                          ? selectedPropety.landlord_floor_number
                                          : `${person.floor_no}`.trim()
                                      }
                                      RecipiantFirstLineAddress={
                                        selectedPropety.landlord_first_line_address?.trim()
                                          ? selectedPropety.landlord_first_line_address
                                          : `${person.first_line_contac_address}`.trim()
                                      }
                                      RecipiantSecondLineAddress={
                                        selectedPropety.landlord_second_line_address?.trim()
                                          ? selectedPropety.landlord_second_line_address
                                          : `${person.second_line_contac_address}`.trim()
                                      }
                                      RecipiantCity={
                                        selectedPropety.landlord_city?.trim()
                                          ? selectedPropety.landlord_city
                                          : `${person.contac_city}`.trim()
                                      }
                                      RecipiantPostcode={
                                        selectedPropety.landlord_post_code_address?.trim()
                                          ? selectedPropety.landlord_post_code_address
                                          : `${person.iqu_post_code_address}`.trim()
                                      }
                                      RecipiantCounty={
                                        selectedPropety.landlord_county?.trim()
                                          ? selectedPropety.landlord_county
                                          : `${person.contact_number}`.trim()
                                      }

                               
                                      personName={`${person.name} ${person.family}`}
                                     
                                      propertyAddress={fullPropertyAddress}
                                      onCancel={() => setCreatingProposalForPersonId(null)}
                                      onSuccess={() => {
                                        setCreatingProposalForPersonId(null);
                                        setProposalRefreshKey(k => k + 1);
                                      }}
                                      
                                    />
                                )}
                                {/**/}                           
                                {/*state of last proposal*/}
                                <span className="ml-2">
                                  <strong>Status:</strong> {latestStatus}
                                  {latestDate && <em className="text-sm text-gray-600"> ({latestDate})</em>}
                                </span>                     

                                {proposalId && (
                                  <a
                                    href={`http://localhost:5000/api/proposals/${proposalId}/download-pdf`}
                                    className="ml-4 text-blue-600 hover:underline"
                                  >
                                    Download PDF
                                  </a>
                                )}


                                {/* */}
                                <p><strong>First Name:</strong> {person.name}</p>
                                <p><strong>Last Name:</strong> {person.family}</p>
                                <p><strong>Organisation:</strong> {person.organisation}</p>
                                <p><strong>Role:</strong> {person.role}</p>
                                <p><strong>Email:</strong> {person.email}</p>
                                <p><strong>Contact Number:</strong> {person.contact_number}</p>
                             


                                <p><strong>First Name:</strong> {person.name}</p>
                                <p><strong>Last Name:</strong> {person.family}</p>
                                <p><strong>Organisation:</strong> {person.organisation}</p>
                                <p><strong>Role:</strong> {person.role}</p>
                                <p><strong>Email:</strong> {person.email}</p>
                                <p><strong>Contact Number:</strong> {person.contact_number}</p>
                                <p><strong>First Address Line:</strong> {person.first_line_contac_address}</p>
                                <p><strong>Second Address Line:</strong> {person.second_line_contac_address}</p>
                                <p><strong>Floor Number:</strong> {person.floor_no}</p>
                                <p><strong>City:</strong> {person.contac_city}</p>
                                <p><strong>County:</strong> {person.contact_county}</p>
                                <p><strong>Postcode:</strong> {person.iqu_post_code_address}</p>

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
                          );
                        })}
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