import React from "react";
import type { Person } from "../../pages/dashboard";

interface Props {
  person: Person;
  editedPerson: Partial<Person>;
  setEditedPerson: (p: Partial<Person>) => void;
  setEditingPersonId: (id: number | null) => void;
  fetchPeople: () => void;
}

const capitalizeWords = (str: string) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const EditPersonForm: React.FC<Props> = ({
  person,
  editedPerson,
  setEditedPerson,
  setEditingPersonId,
  fetchPeople,
}) => {
  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/api/people/${person.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...person, ...editedPerson }),
    });

    if (res.ok) {
      const bc = new BroadcastChannel("dashboard-updates");
      bc.postMessage("person-updated");
      bc.close();

      setEditingPersonId(null);
      setEditedPerson({});
      fetchPeople();
    } else {
      alert("Failed to update person");
    }
  };

  return (
    <li className="border p-3 rounded bg-gray-50">
      {[
        { label: "First Name", key: "name" },
        { label: "Last Name", key: "family" },
        { label: "Organisation", key: "organisation" },
        { label: "Role", key: "role" },
        { label: "Email", key: "email" },
        { label: "Contact Number", key: "contact_number" },
        { label: "First Address Line", key: "first_line_contac_address" },
        { label: "Second Address Line", key: "second_line_contac_address" },
        { label: "Floor Number", key: "floor_no" },
        { label: "City", key: "contac_city" },
        { label: "County", key: "contact_county" },
        { label: "Postcode", key: "iqu_post_code_address" },
      ].map(({ label, key }) => (
        <div className="mb-3" key={key}>
          <label className="form-label"><strong>{label}:</strong></label>
          <input
            className="form-control"
            value={(editedPerson as any)[key] ?? ""}
            onChange={(e) => {
              const value =
                key === "name" || key === "family"
                  ? capitalizeWords(e.target.value)
                  : key === "iqu_post_code_address"
                  ? e.target.value.toUpperCase()
                  : e.target.value;
              setEditedPerson({ ...editedPerson, [key]: value });
            }}
          />
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleSave}>
          Save
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => {
            setEditingPersonId(null);
            setEditedPerson({});
          }}
        >
          Cancel
        </button>
      </div>
    </li>
  );
};

export default EditPersonForm;
