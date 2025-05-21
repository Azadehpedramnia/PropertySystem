import React from "react";
import type { Property } from "../../pages/dashboard";

interface Props {
  isEditing: boolean;
  selectedProperty: Property;
  setEditPropertyMode: (mode: boolean) => void;
  setSelectedProperty: (p: Property | null) => void;
  fetchProperties: () => void;
}

const PropertyActions: React.FC<Props> = ({
  isEditing,
  selectedProperty,
  setEditPropertyMode,
  setSelectedProperty,
  fetchProperties,
}) => {
  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/api/propertiies/${selectedProperty.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedProperty),
    });

    if (res.ok) {
      const bc = new BroadcastChannel("dashboard‑updates");
      bc.postMessage("property‑updated");
      bc.close();

      setEditPropertyMode(false);
      fetchProperties();
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/api/propertiies/${selectedProperty.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSelectedProperty(null);
      fetchProperties();
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="mt-4 space-x-2">
      {isEditing ? (
        <>
          <button onClick={handleSave} className="bg-gray-300 px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => setEditPropertyMode(false)} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setEditPropertyMode(true)} className="bg-gray-300 px-4 py-2 rounded">
            Edit
          </button>
          <button onClick={handleDelete} className="bg-gray-300 px-4 py-2 rounded">
            Delete
          </button>
        </>
      )}
      <button onClick={() => setSelectedProperty(null)} className="bg-gray-300 px-4 py-2 rounded">
        Close
      </button>
    </div>
  );
};

export default PropertyActions;
