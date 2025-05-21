import type { Property, Person, PersonProperty } from '../../pages/dashboard';
import CreateProposalForm from './CreateProposalForm'; // adjust path if needed
import ProposalStatus from './ProposalStatus';
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { MediaList } from '../../components/MediaUploader/MediaList'
import PropertyForm from '../../components/ReportPropertyDetails/PropertyForm'
import PropertySummary from '../../components/ReportPropertyDetails/PropertySummary'
import PropertyActions from '../../components/ReportPropertyDetails/PropertyActions'
 

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

    //show media list
    const [mediaReloadKey, setMediaReloadKey] = useState(0)
    const [showMediaList, setShowMediaList] = useState(false)
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
            {/*<h5 className="text-lg font-semibold mb-2">View Media list</h5>*/}
            <button
              onClick={() => setShowMediaList((v) => !v)}
              className="btn btn-sm btn-primary mb-2"
            >
            {showMediaList ? 'Hide Media List' : 'View Media List'}
            </button>

          {/* Conditionally render the MediaList */}
          {showMediaList && (
            <MediaList
              propertyId={selectedPropety.id}
              reloadTrigger={mediaReloadKey}
              allowDelete={false} 
            />
          )}
            
          </div>
        )}


{/*//////////////////////////////////////////*/}
        {editPropertyMode ? (
          <>
            <PropertyForm
              selectedPropety={selectedPropety}
              setSelectedProperty={setSelectedProperty}
            />  
          </>
        ) : (
          <>
          <PropertySummary selectedProperty={selectedPropety} /> 
          </>
        )}

        {/* ACTION BUTTONS */}
        <PropertyActions
          isEditing={editPropertyMode}
          selectedProperty={selectedPropety}
          setEditPropertyMode={setEditPropertyMode}
          setSelectedProperty={setSelectedProperty}
          fetchProperties={fetchProperties}
        />



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