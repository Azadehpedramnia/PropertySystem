import React, { useState } from "react";
import type { Property, Person, PersonProperty } from "../../pages/dashboard";
import CreateProposalForm from "../Dashboard/CreateProposalForm";
import EditPersonForm from "./EditPersonForm";
import PersonDisplay from "./PersonDisplay";


interface Proposal {
  id: number;
  person_id: number;
  property_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  selectedProperty: Property;
  personProperties: PersonProperty[];
  people: Person[];
  editingPersonId: number | null;
  setEditingPersonId: (id: number | null) => void;
  editedPerson: Partial<Person>;
  setEditedPerson: (p: Partial<Person>) => void;
  creatingProposalForId: number | null;
  setCreatingProposalForId: (id: number | null) => void;
  fullPropertyAddress: string;
  allProposals: Proposal[];
  fetchPeople: () => void;
  fetchPersonProperties: () => void;
  refreshProposals: () => void;
}



const RelatedPeopleSection: React.FC<Props> = ({
  selectedProperty,
  personProperties,
  people,
  editingPersonId,
  setEditingPersonId,
  editedPerson,
  setEditedPerson,
  creatingProposalForId,
  setCreatingProposalForId,
  fullPropertyAddress,
  allProposals,
  fetchPeople,
  fetchPersonProperties,
  refreshProposals,
}) => {
  const relatedPeople = personProperties
    .filter((pp) => pp.property_id === selectedProperty.id && pp.is_related)
    .map((pp) => people.find((p) => p.id === pp.person_id))
    .filter((p): p is Person => !!p);


  //step 1
  if (relatedPeople.length === 0) return null;

  // Group by organisation
  const groupedByOrg: { [org: string]: Person[] } = {};

  relatedPeople.forEach((person) => {
    const org = person.organisation || "Unknown Organisation";
    if (!groupedByOrg[org]) groupedByOrg[org] = [];
    groupedByOrg[org].push(person);
  });

  //step 2
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  const toggleOrg = (org: string) => {
    setExpandedOrgs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(org)) {
        newSet.delete(org);
      } else {
        newSet.add(org);
      }
      return newSet;
    });
  };


  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Organisations of people connected to this property</h3>
      {/*<ol className="space-y-2">
        {relatedPeople.map((person) =>
          editingPersonId === person.id ? (
            <EditPersonForm
              key={person.id}
              person={person}
              editedPerson={editedPerson}
              setEditedPerson={setEditedPerson}
              setEditingPersonId={setEditingPersonId}
              fetchPeople={fetchPeople}
            />
          ) : (
            <PersonDisplay
              key={person.id}
              person={person}
              selectedProperty={selectedProperty}
              creatingProposalForId={creatingProposalForId}
              setCreatingProposalForId={setCreatingProposalForId}
              fullPropertyAddress={fullPropertyAddress}
              proposals={allProposals}
              setEditingPersonId={setEditingPersonId}
              setEditedPerson={setEditedPerson}
              fetchPeople={fetchPeople}
              fetchPersonProperties={fetchPersonProperties}
              refreshProposals={refreshProposals}
            />
          )
        )}
      </ol>*/}
      {Object.entries(groupedByOrg).map(([org, peopleInOrg]) => (
        <div key={org} className="mb-4 border rounded p-2 bg-gray-100">
          <button
            onClick={() => toggleOrg(org)}
            className="w-full text-left font-semibold bg-blue-200 px-3 py-2 rounded"
          >
            {expandedOrgs.has(org) ? "▼" : "▶"} {org}
          </button>

          {expandedOrgs.has(org) && (
            <ol className="mt-2 space-y-2">
              {peopleInOrg.map((person) =>
                editingPersonId === person.id ? (
                  <EditPersonForm
                    key={person.id}
                    person={person}
                    editedPerson={editedPerson}
                    setEditedPerson={setEditedPerson}
                    setEditingPersonId={setEditingPersonId}
                    fetchPeople={fetchPeople}
                  />
                ) : (
                  <PersonDisplay
                    key={person.id}
                    person={person}
                    selectedProperty={selectedProperty}
                    creatingProposalForId={creatingProposalForId}
                    setCreatingProposalForId={setCreatingProposalForId}
                    fullPropertyAddress={fullPropertyAddress}
                    proposals={allProposals}
                    setEditingPersonId={setEditingPersonId}
                    setEditedPerson={setEditedPerson}
                    fetchPeople={fetchPeople}
                    fetchPersonProperties={fetchPersonProperties}
                    refreshProposals={refreshProposals}
                  />
                )
              )}
            </ol>
          )}
        </div>
      ))}

    </div>
  );
};

export default RelatedPeopleSection;
