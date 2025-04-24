// components/Dashboard/RegisterContact.tsx
import React from "react";


interface Person {
  name: string;
  family: string;
  organisation: string;
  role: string;
  email: string;
  contact_number: string;
  property_address_for_enquiry: string;
  iqu_post_code_address:string;
}

interface RegisterContactProps {
  newPerson: Person;
  setNewPerson: React.Dispatch<React.SetStateAction<Person>>;
  addPersoon: (e: React.FormEvent<HTMLFormElement>) => void;
  allRoles: string[];
}

const RegisterContact: React.FC<RegisterContactProps> = ({
  newPerson,
  setNewPerson,
  addPersoon,
  allRoles,
}) => {
  return (
      <form onSubmit={addPersoon} className="space-y-4">
        <div className="row g-3">
          {/* Row: Name */}
          <div className="col-12">
            <label className="form-label me-2 mb-0 w-50">Name:</label>
            <input
              className="form-control"
              placeholder="Name"
              value={newPerson.name}
              onChange={(e) =>
                setNewPerson({ ...newPerson, name: e.target.value })
              }
              required
            />
          </div>
          {/* Row: Last Name */}
          <div className="col-12">
            <label className="form-label">Last Name:</label>
            <input
              className="form-control"
              placeholder="Last Name"
              value={newPerson.family}
              onChange={(e) =>
                setNewPerson({ ...newPerson, family: e.target.value })
              }
              required
            />
          </div>
          {/* Row: Organisation */}
          <div className="col-12">
            <label className="form-label">Organisation:</label>
            <input
              className="form-control"
              placeholder="Organisation"
              value={newPerson.organisation}
              onChange={(e) =>
                setNewPerson({ ...newPerson, organisation: e.target.value })
              }
            />
          </div>
          {/* Row: Role */}
          <div className="col-12">
            <label className="form-label">Role:</label>
            <input
              list="role-options"
              className="form-control"
              placeholder="Select or type a role"
              value={newPerson.role}
              onChange={(e) =>
                setNewPerson((prev) => ({ ...prev, role: e.target.value }))
              }
            />
            <datalist id="role-options">
              {allRoles.map((r, index) => (
                <option key={index} value={r} />
              ))}
            </datalist>
          </div>
          {/* Row: Email */}
          <div className="col-12">
            <label className="form-label">Email:</label>
            <input
              className="form-control"
              placeholder="Email"
              value={newPerson.email}
              onChange={(e) =>
                setNewPerson({ ...newPerson, email: e.target.value })
              }
            />
          </div>
          {/* Row: Contact Number */}
          <div className="col-12">
            <label  className="form-label">Contact No:</label>
            <input
              className="form-control"
              placeholder="Contact Number"
              value={newPerson.contact_number}
              onChange={(e) =>
                setNewPerson({ ...newPerson, contact_number: e.target.value })
              }
            />
          </div>
          {/* Row: Postcode*/}
          <div className="col-12">
            <label  className="form-label">postcode:</label>
            <input
              className="form-control"
              placeholder="postcode"
              value={newPerson.iqu_post_code_address}
              onChange={(e) =>
                setNewPerson({
                  ...newPerson,
                  iqu_post_code_address: e.target.value,
                })
              }
            />
          </div>

          {/* Row: Address */}
          <div className="col-12">
            <label  className="form-label">Address:</label>
            <input
              className="form-control"
              placeholder="Address"
              value={newPerson.property_address_for_enquiry}
              onChange={(e) =>
                setNewPerson({
                  ...newPerson,
                  property_address_for_enquiry: e.target.value,
                })
              }
            />
          </div>

        
          {/* Submit Button */}
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">
              Add Details
            </button>
          </div>
        </div>
      </form>
    
  );
};

export default RegisterContact;
