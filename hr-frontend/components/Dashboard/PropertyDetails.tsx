import React, { useState, useEffect } from 'react';
import type { Property, Person, PersonProperty } from '../../pages/dashboard';
import CreateProposalForm from './CreateProposalForm';

interface Proposal {
  id: number;
  person_id: number;
  property_id: number;
  status: string;
  created_at: string;
  updated_at: string;
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
  setEditingPersonIdForProperty: (id: number | null) => void;
  editingPersonIdForProperty: number | null;
  editedPersonForProperty: Partial<Person>;
  setEditedPersonForProperty: (p: Partial<Person>) => void;
}


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
  setEditingPersonIdForProperty,
  editingPersonIdForProperty,
  editedPersonForProperty,
  setEditedPersonForProperty,
}) => {
  const [proposalRefreshKey, setProposalRefreshKey] = useState(0);
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [creatingProposalForPersonId, setCreatingProposalForPersonId] = useState<number | null>(null);
  const [editModeForPersonId, setEditModeForPersonId] = useState<number | null>(null);

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

  const relatedPeople = personProperties
    .filter(pp => pp.property_id === selectedPropety.id && pp.is_related)
    .map(pp => people.find(p => p.id === pp.person_id))
    .filter((p): p is Person => !!p);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left - Property Report */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Report For Address:
                <br />
                <strong>
                  {selectedPropety.property_first_line_address}_{selectedPropety.property_floor}_{selectedPropety.post_code}
                </strong>
              </h5>

              {!editPropertyMode ? (
                <>
                  <p><strong>Landlord/Organisation:</strong> {selectedPropety.inquirer}</p>
                  <p><strong>City:</strong> {selectedPropety.city}</p>
                  <p><strong>Address:</strong> {selectedPropety.address}</p>
                  <p><strong>Property Type:</strong> {selectedPropety.property_type}</p>
                  <p><strong>Building rateable value:</strong> {selectedPropety.building_rateable_value}</p>
                  <p><strong>Rates payable before relief:</strong> {selectedPropety.rates_payable_before_relief}</p>
                  <p><strong>Has car park:</strong> {selectedPropety.has_car_park ? 'Yes' : 'No'}</p>
                  <p><strong>Car park rateable value:</strong> {selectedPropety.car_park_rateable_value}</p>
                  <p><strong>Car park rates payable before relief:</strong> {selectedPropety.car_park_rates_payable_before_relief}</p>
                  <p><strong>Total rateable value:</strong> {selectedPropety.total_rateable_value}</p>
                  <p><strong>Total Rates Payable Before Relief:</strong> {selectedPropety.total_rate_payable_before_relief}</p>
                  <p><strong>Total Rates Payable After Relief:</strong> {selectedPropety.total_rate_payable_after_relief}</p>
                  <p><strong>Rates Multiplier:</strong> {selectedPropety.rates_multiplier}</p>
                  <p><strong>Donation Due:</strong> {selectedPropety.donation_due}</p>
                  <p><strong>Landlord:</strong> {selectedPropety.landlord_name}</p>
                  <p><strong>Landlord Email:</strong> {selectedPropety.landlord_email}</p>
                  <p><strong>Landlord Phone:</strong> {selectedPropety.landlord_no}</p>
                  <p><strong>Lease Start:</strong> {selectedPropety.start_date_of_lease?.toString()}</p>
                  <p><strong>Lease End:</strong> {selectedPropety.end_date_of_lease?.toString()}</p>
                  <p><strong>Lease Length:</strong> {selectedPropety.length_of_lease}</p>

                  <div className="mt-3">
                    <button className="btn btn-primary me-2" onClick={() => setEditPropertyMode(true)}>Edit</button>
                    <button className="btn btn-danger me-2" onClick={async () => {
                      if (confirm('Are you sure you want to delete this property?')) {
                        const res = await fetch(`http://localhost:5000/api/propertiies/${selectedPropety.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          setSelectedProperty(null);
                          fetchProperties();
                        } else {
                          alert('Delete failed');
                        }
                      }
                    }}>Delete</button>
                    <button className="btn btn-secondary" onClick={() => setSelectedProperty(null)}>Close</button>
                  </div>
                </>
              ) : (
                <div className="container mt-4">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="card shadow-sm rounded">
                        <div className="card-body">
                          <h5 className="card-title mb-3">
                            Edit Property Details for: <strong>{selectedPropety.property_first_line_address}</strong>
                          </h5>

                          <div className="mb-3">
                            <label className="form-label"><strong>Landlord/Organisation:</strong></label>
                            <input
                              className="form-control"
                              value={selectedPropety.inquirer}
                              onChange={(e) => setSelectedProperty({ ...selectedPropety, inquirer: e.target.value })}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label"><strong>City:</strong></label>
                            <input
                              className="form-control"
                              value={selectedPropety.city}
                              onChange={(e) => setSelectedProperty({ ...selectedPropety, city: e.target.value })}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label"><strong>Address:</strong></label>
                            <input
                              className="form-control"
                              value={selectedPropety.address}
                              onChange={(e) => setSelectedProperty({ ...selectedPropety, address: e.target.value })}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label"><strong>Property Type:</strong></label>
                            <select
                              className="form-select"
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
                          </div>

                          <div className="d-flex gap-2 mt-4">
                            <button
                              className="btn btn-success me-2"
                              onClick={async () => {
                                const res = await fetch(`http://localhost:5000/api/propertiies/${selectedPropety.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(selectedPropety),
                                });
                                if (res.ok) {
                                  const bc = new BroadcastChannel('dashboard-updates');
                                  bc.postMessage('property-updated');
                                  bc.close();
                                  setEditPropertyMode(false);
                                  fetchProperties();
                                } else {
                                  alert('Update failed');
                                }
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setEditPropertyMode(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              )}
            </div>
          </div>
        </div>

        {/* Right - Related People */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">People Related to This Property</h5>
              {relatedPeople.length === 0 ? (
                <p>No related people found.</p>
              ) : (



                <ol className="list-group list-group-numbered">
  {relatedPeople.map((person) => {
    const isExpanded = editingPersonIdForProperty === person.id;
    const isEditing = editModeForPersonId === person.id;

    return (
      <li key={person.id} className="list-group-item">
        <div
          role="button"
          className="text-primary fw-bold"
          onClick={() =>
            setEditingPersonIdForProperty(isExpanded ? null : person.id)
          }
        >
          {person.name} {person.family}
        </div>

        {isExpanded && (
          <div className="mt-3 border-top pt-3">
            {isEditing ? (
              <>
                <div className="mb-3">
                  <label className="form-label"><strong>First Name:</strong></label>
                  <input
                    className="form-control"
                    value={editedPersonForProperty.name ?? person.name}
                    onChange={(e) =>
                      setEditedPersonForProperty({
                        ...editedPersonForProperty,
                        name: capitalizeWords(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label"><strong>Last Name:</strong></label>
                  <input
                    className="form-control"
                    value={editedPersonForProperty.family ?? person.family}
                    onChange={(e) =>
                      setEditedPersonForProperty({
                        ...editedPersonForProperty,
                        family: capitalizeWords(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label"><strong>Organisation:</strong></label>
                  <input
                    className="form-control"
                    value={editedPersonForProperty.organisation ?? person.organisation}
                    onChange={(e) =>
                      setEditedPersonForProperty({
                        ...editedPersonForProperty,
                        organisation: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Add more fields here as needed... */}

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={async () => {
                      const res = await fetch(`http://localhost:5000/api/people/${person.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...person, ...editedPersonForProperty }),
                      });
                      if (res.ok) {
                        const bc = new BroadcastChannel("dashboard-updates");
                        bc.postMessage("person-updated");
                        bc.close();
                        setEditModeForPersonId(null);
                        setEditingPersonIdForProperty(null);
                        setEditedPersonForProperty({});
                        fetchPeople();
                      } else {
                        alert("Failed to update person");
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditModeForPersonId(null);
                      setEditedPersonForProperty({});
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Organisation:</strong> {person.organisation}</p>
                <p><strong>Role:</strong> {person.role}</p>
                <p><strong>Email:</strong> {person.email}</p>
                <p><strong>Contact:</strong> {person.contact_number}</p>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditedPersonForProperty(person);
                      setEditModeForPersonId(person.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
                      const confirmDelete = confirm("Are you sure you want to delete this person?");
                      if (!confirmDelete) return;
                      const res = await fetch(`http://localhost:5000/api/people/${person.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        fetchPeople();
                        fetchPersonProperties();
                        setEditingPersonIdForProperty(null);
                      } else {
                        alert("Delete failed");
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


              





               
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
