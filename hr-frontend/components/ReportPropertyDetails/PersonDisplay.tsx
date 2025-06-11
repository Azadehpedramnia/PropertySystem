import React from "react";
import type { Person, Property } from "../../pages/dashboard";
import CreateProposalForm from "../Dashboard/CreateProposalForm";

interface Proposal {
  id: number;
  person_id: number;
  property_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  person: Person;
  selectedProperty: Property;
  creatingProposalForId: number | null;
  setCreatingProposalForId: (id: number | null) => void;
  fullPropertyAddress: string;
  proposals: Proposal[];
  setEditingPersonId: (id: number) => void;
  setEditedPerson: (p: Partial<Person>) => void;
  fetchPeople: () => void;
  fetchPersonProperties: () => void;
  refreshProposals: () => void;
}

const PersonDisplay: React.FC<Props> = ({
  person,
  selectedProperty,
  creatingProposalForId,
  setCreatingProposalForId,
  fullPropertyAddress,
  proposals,
  setEditingPersonId,
  setEditedPerson,
  fetchPeople,
  fetchPersonProperties,
  refreshProposals,
}) => {
  const mine = proposals
    .filter((p) => p.person_id === person.id && p.property_id === selectedProperty.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const latestProposal = mine[0];
  const latestStatus = latestProposal?.status ?? "No proposal";
  const latestDate = latestProposal?.created_at
    ? new Date(latestProposal.created_at).toLocaleDateString()
    : "";
  const proposalId = latestProposal?.id;

  return (
    <li className="border p-3 rounded bg-gray-50">
      <button
        className="bg-blue-300 px-4 py-2 rounded"
        onClick={() => setCreatingProposalForId(person.id)}
      >
        Create Proposal
      </button>

      {creatingProposalForId === person.id && (
        <CreateProposalForm
          personId={person.id}
          propertyId={selectedProperty.id}
          RecipiantName={
            selectedProperty.landlord_name?.trim()
              ? selectedProperty.landlord_name
              : `${person.name} ${person.family}`.trim()
          }
          RecipiantAddressFloor={
            selectedProperty.landlord_floor_number?.trim()
              ? selectedProperty.landlord_floor_number
              : `${person.floor_no}`.trim()
          }
          RecipiantFirstLineAddress={
            selectedProperty.landlord_first_line_address?.trim()
              ? selectedProperty.landlord_first_line_address
              : `${person.first_line_contac_address}`.trim()
          }
          RecipiantSecondLineAddress={
            selectedProperty.landlord_second_line_address?.trim()
              ? selectedProperty.landlord_second_line_address
              : `${person.second_line_contac_address}`.trim()
          }
          RecipiantCity={
            selectedProperty.landlord_city?.trim()
              ? selectedProperty.landlord_city
              : `${person.contac_city}`.trim()
          }
          RecipiantPostcode={
            selectedProperty.landlord_post_code_address?.trim()
              ? selectedProperty.landlord_post_code_address
              : `${person.iqu_post_code_address}`.trim()
          }
          RecipiantCounty={
            selectedProperty.landlord_county?.trim()
              ? selectedProperty.landlord_county
              : `${person.contact_county}`.trim()
          }
          personName={`${person.name} ${person.family}`}
          propertyAddress={fullPropertyAddress}
          onCancel={() => setCreatingProposalForId(null)}
          onSuccess={() => {
            setCreatingProposalForId(null);
            refreshProposals();
          }}
        />
      )}

      <span className="ml-2">
        <strong>Status:</strong> {latestStatus}
        {latestDate && <em className="text-sm text-gray-600"> ({latestDate})</em>}
      </span>

      {proposalId && (
        <a
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposals/${proposalId}/download-pdf`}
          className="ml-4 text-blue-600 hover:underline"
        >
          Download PDF
        </a>
      )}

      <div className="mt-3">
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
      </div>

      <div className="flex gap-2 mt-2">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => {
            setEditingPersonId(person.id);
            setEditedPerson(person);
          }}
        >
          Edit
        </button>

        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={async () => {
            const confirmDelete = confirm("Are you sure you want to delete this person?");
            if (!confirmDelete) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/people/${person.id}`, {
              method: "DELETE",
            });

            if (res.ok) {
              fetchPeople();
              fetchPersonProperties();
            } else {
              alert("Delete failed");
            }
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default PersonDisplay;
