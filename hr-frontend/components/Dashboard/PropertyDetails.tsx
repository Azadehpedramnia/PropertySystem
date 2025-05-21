import type { Property, Person, PersonProperty } from '../../pages/dashboard';
import CreateProposalForm from './CreateProposalForm'; // adjust path if needed
import ProposalStatus from './ProposalStatus';
import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { MediaList } from '../../components/MediaUploader/MediaList'
import PropertyForm from '../../components/ReportPropertyDetails/PropertyForm'
import PropertySummary from '../../components/ReportPropertyDetails/PropertySummary'
import PropertyActions from '../../components/ReportPropertyDetails/PropertyActions'
import RelatedPeopleSection from '../../components/ReportPropertyDetails/RelatedPeopleSection'
 

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
              <RelatedPeopleSection
                selectedProperty={selectedPropety}
                personProperties={personProperties}
                people={people}
                editingPersonId={editingPersonIdForProperty}
                setEditingPersonId={setEditingPersonIdForProperty}
                editedPerson={editedPersonForProperty}
                setEditedPerson={setEditedPersonForProperty}
                creatingProposalForId={creatingProposalForPersonId}
                setCreatingProposalForId={setCreatingProposalForPersonId}
                fullPropertyAddress={fullPropertyAddress}
                allProposals={allProposals}
                fetchPeople={fetchPeople}
                fetchPersonProperties={fetchPersonProperties}
                refreshProposals={() => setProposalRefreshKey((k) => k + 1)}
              />
            )}
      </div>
    );
  };
  export default PropertyDetails;