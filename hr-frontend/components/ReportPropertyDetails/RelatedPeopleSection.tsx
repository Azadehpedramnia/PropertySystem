import React from "react";
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

  if (relatedPeople.length === 0) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">People Related to This Property</h3>
      <ol className="space-y-2">
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
      </ol>
    </div>
  );
};

export default RelatedPeopleSection;
