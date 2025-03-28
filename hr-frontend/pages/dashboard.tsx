import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

interface Enquiry {
  //property info
  id: number;
  city: string;
  full_address: string;
  property_type: 'Office' | 'Retail' | 'Warehouse';
  property_enquiry_address: string;
  total_rateable_value: number;
  //Optional Car Park
  has_car_park: boolean;
  car_park_rateable_value: string;

  //Optional Financials
  rateable_value_info: string;

  //enquirer person info
  enquirer_name: string;
  organisation: string;
  role: 'Est Ag' | 'Landlord' | 'Ass Man';
  current_position: string;
  email: string;
  contact_number: string;

  //Optional Estate Agent Details
  estate_agent_name: string;
  estate_agent_contact_number: string;
  estate_agent_email: string;

  //Optional Landlord Details
  landlord_name: string;
  landlord_email: string;
  landlord_phone: string;
 
  //Optional Management Company (POC)
  has_management_company: boolean;
  poc_email: string;
  poc_contact_number: string;
 
  //Audit
  enquiry_date: string;
}

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
}

const Dashboard = () => {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [error, setError] = useState('');
  const [editEnquiry, setEditEnquiry] = useState<Enquiry | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showLandlordDetails, setShowLandlordDetails] = useState(false);
  const [showEstateAgentDetails, setShowEstateAgentDetails] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const handleEditClick = (emp: Enquiry) => {
    // EditMode 
    setEditEnquiry(emp);
    setEditMode(true);
  };
  const handleUpdateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEnquiry) return;
  
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/enquiries/${editEnquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editEnquiry), 
        });
      if (res.ok) {
        const updatedEmp = await res.json();
        // Update Enquiry
        setEnquiries((prev) =>
          prev.map((emp) => (emp.id === updatedEmp.id ? updatedEmp : emp))
        );
        // back to normal mode
        setEditMode(false);
        setEditEnquiry(null);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Error updating enquiry person');
      }
    } catch (error) {
      setError('Error updating enquiry person');
    }
  };
  
    // Initialize new enquiry state with default values
    const [newEnquiry, setNewEnquiry] = useState<Omit<Enquiry, 'id'>>({
      
      //property info
      city:'',
      full_address: '',
      property_type: 'Office',
      property_enquiry_address: '',
      total_rateable_value: 0,
      //Optional Car Park
      has_car_park: false,
      car_park_rateable_value: '',

      //Optional Financials
      rateable_value_info: '',

      //enquirer person info
      enquirer_name: '',
      organisation: '',
      role: 'Est Ag' ,
      current_position:'',
      email: '',
      contact_number:'',

      //Optional Estate Agent Details
      estate_agent_name: '',
      estate_agent_contact_number: '',
      estate_agent_email: '',

      //Optional Landlord Details
      landlord_name: '',
      landlord_email: '',
      landlord_phone: '',
    
      //Optional Management Company (POC)
      has_management_company: false,
      poc_email: '',
      poc_contact_number: '',
    
      //Audit
      enquiry_date: '',
      
    });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Decode token to check role
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.role !== 'ADMIN') {
      setError('Access denied. Only Admin users can access this page.');
    } else {
      fetchEmployees(token);
    }
  }, []);

  const fetchEmployees = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/enquiries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Error fetching enquiries');
      }
    } catch (error) {
      setError('Error fetching enquiries');
    }
  };

  // Handle input changes for both text and checkbox fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    if (type === 'number') {
      newValue = parseFloat(value);
    }
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setNewEnquiry({
      ...newEnquiry,
      [name]: newValue,
      //[e.target.name]: e.target.value,
    });
  };

  const handleAddEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEnquiry),
      });
      if (res.ok) {
        const enquiry = await res.json();
        setEnquiries([...enquiries, enquiry]);

        // Reset the form (you can adjust defaults as needed)
        setNewEnquiry({
          city:'',
          full_address: '',
          property_type: 'Office',
          property_enquiry_address: '',
          total_rateable_value: 0,
          has_car_park: false,
          car_park_rateable_value: '',
          rateable_value_info: '',
          enquirer_name: '',
          organisation: '',
          role: 'Est Ag' ,
          current_position:'',
          email: '',
          contact_number:'',
          estate_agent_name: '',
          estate_agent_contact_number: '',
          estate_agent_email: '',
          landlord_name: '',
          landlord_email: '',
          landlord_phone: '',
          has_management_company: false,
          poc_email: '',
          poc_contact_number: '',
          enquiry_date: '',
        });
      } else {
        const errData = await res.json();
        setError(errData.message || 'Error adding enquiry');
      }
    } catch (error) {
      setError('Error adding enquiry');
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setEnquiries(enquiries.filter((enq) => enq.id !== id));
      } else {
        const errData = await res.json();
        setError(errData.message || 'Error deleting enquiry');
      }
    } catch (error) {
      setError('Error deleting enquiry');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
    );
  }

  //////
  return (
    <div className="container mt-5 ">
      <div className="d-flex gap-3">
      <h2>Enquiry Management Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-secondary mb-3">
          Sign Out
        </button>
      </div>
      <h3 className="mt-5">Add New Enquiry</h3>
      <form onSubmit={handleAddEnquiry}>

        <h4 className="mt-4">🙋 Enquirer Details</h4>
        <div className="mb-3">
          <label>Enquirer Name</label>
          <input
            name="enquirer_name"
            type="text"
            className="form-control w-50"
            value={newEnquiry.enquirer_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Organisation</label>
          <input
            name="organisation"
            type="text"
            className="form-control w-50"
            value={newEnquiry.organisation}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-control w-50"
            value={newEnquiry.role}
            onChange={handleInputChange}
          >
            <option value="Est Ag">Est Ag</option>
            <option value="Landlord">Landlord</option>
            <option value="Ass Man">Ass Man</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Current position</label>
          <input
            name="current_position"
            type="text"
            className="form-control w-50"
            value={newEnquiry.current_position}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control w-50"
            value={newEnquiry.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contact Number</label>
          <input
            name="contact_number"
            type="text"
            className="form-control w-50"
            value={newEnquiry.contact_number}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* */}
        {/* Toggle Buttons for Optional Sections */}
        <div className="mb-3">
          {/*<button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={() => setShowLandlordDetails(!showLandlordDetails)}
          >
            {showLandlordDetails ? "Hide Landlord Details" : "Add Landlord Details"}
          </button>*/}
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowEstateAgentDetails(!showEstateAgentDetails)}
          >
            {showEstateAgentDetails ?(<span className="">−</span> ) : (<span className="">+</span> )}
          </button>
        </div>

        {/* Horizontal Row for Landlord and Estate Agent Details */}
        {(showLandlordDetails || showEstateAgentDetails) && (
          <div className="">
            {showLandlordDetails && (
              <div className="col-md-6">
                <h4>Contact Details</h4>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    name="landlord_name"
                    type="text"
                    className="form-control"
                    value={newEnquiry.landlord_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label> Phone</label>
                  <input
                    name="landlord_phone"
                    type="text"
                    className="form-control"
                    value={newEnquiry.landlord_phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label> Email</label>
                  <input
                    name="landlord_email"
                    type="email"
                    className="form-control"
                    value={newEnquiry.landlord_email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            {showEstateAgentDetails && (
              <div className="col-md-6">
                <h4>Contact Details</h4>
                <div className="mb-3">
                  <label> Name</label>
                  <input
                    name="estate_agent_name"
                    type="text"
                    className="form-control"
                    value={newEnquiry.estate_agent_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label> Contact Number</label>
                  <input
                    name="estate_agent_contact_number"
                    type="text"
                    className="form-control"
                    value={newEnquiry.estate_agent_contact_number}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label> Email</label>
                  <input
                    name="estate_agent_email"
                    type="email"
                    className="form-control"
                    value={newEnquiry.estate_agent_email}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setShowLandlordDetails(!showLandlordDetails)}
                >
                  {showLandlordDetails ? (<span className="">−</span> ) : (<span className="">+</span> )}
                </button>
              </div>
            )}
          </div>
        )}

       

        <hr />
        {/*i want info about property be in table property details carpark financial be in one horizontal chart */}
        <div className="card p-4 mb-4" style={{ backgroundColor: "#f8f9fa" }}>
            <h4 className="mb-3">🏢 Property Information</h4>
            <div className="row mt-3">
              {/* Property Details */}
              <div className="col-md-4">
                <h5>🏙️ Details</h5>
                <div className="mb-3">
                  <label>City</label>
                  <input
                    name="city"
                    type="text"
                    className="form-control"
                    value={newEnquiry.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Full Address</label>
                  <input
                    name="full_address"
                    type="text"
                    className="form-control"
                    value={newEnquiry.full_address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Property Type</label>
                  <select
                    name="property_type"
                    className="form-control"
                    value={newEnquiry.property_type}
                    onChange={handleInputChange}
                  >
                    <option value="Office">Office</option>
                    <option value="Retail">Retail</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>Total Rateable Value</label>
                  <input
                    name="total_rateable_value"
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newEnquiry.total_rateable_value}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Car Park */}
              <div className="col-md-4">
                <h5>🚗 Car Park</h5>
                <div className="mb-3 form-check">
                  <input
                    name="has_car_park"
                    type="checkbox"
                    className="form-check-input"
                    checked={newEnquiry.has_car_park}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">Has car park</label>
                </div>
                <div className="mb-3">
                  <label>Car Park Rateable Value</label>
                  <input
                    name="car_park_rateable_value"
                    type="text"
                    className="form-control"
                    value={newEnquiry.car_park_rateable_value}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Financials */}
              <div className="col-md-4">
                <h5>💰 Financials</h5>
                <div className="mb-3">
                  <label>Rateable Value Info</label>
                  <input
                    name="rateable_value_info"
                    type="text"
                    className="form-control"
                    value={newEnquiry.rateable_value_info}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

        {/* */}
      
     
        {/* You can add additional fields following the same pattern */}
        <button type="submit" className="btn btn-primary">
          Add Enquiry
        </button>
      </form>
      {editMode && editEnquiry && (
        <div>
          <h3 className="mt-5">Edit Enquiry</h3>
          <form onSubmit={handleUpdateEnquiry}>
            <div className="mb-3">
              <label>Enquirer Name</label>
              <input
                name="enquirer_name"
                type="text"
                className="form-control w-50"
                value={editEnquiry.enquirer_name}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, enquirer_name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control w-50"
                value={editEnquiry.email}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>City</label>
              <input
                name="city"
                type="text"
                className="form-control w-50"
                value={editEnquiry.city}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, city: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Full Address</label>
              <input
                name="full_address"
                type="text"
                className="form-control w-50"
                value={editEnquiry.full_address}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, full_address: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Organisation</label>
              <input
                name="organisation"
                type="text"
                className="form-control w-50"
                value={editEnquiry.organisation}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, organisation: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Role</label>
              <select
                name="role"
                className="form-control w-50"
                value={editEnquiry.role}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, role: e.target.value as Enquiry['role'] })
                }
              >
                <option value="Est Ag">Est Ag</option>
                <option value="Landlord">Landlord</option>
                <option value="Ass Man">Ass Man</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Enquiry Date</label>
              <input
                name="enquiry_date"
                type="date"
                className="form-control w-50"
                value={editEnquiry.enquiry_date}
                onChange={(e) =>
                  setEditEnquiry({ ...editEnquiry, enquiry_date: e.target.value })
                }
                required
              />
            </div>
            {/* Add additional fields for editing as needed */}
            <button type="submit" className="btn btn-primary">
              Update Enquiry
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditMode(false);
                setEditEnquiry(null);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <hr />
      <h3 className="mt-5">Enquiry List</h3>
      <table className="table table-bordered">
        <thead>
            <tr>
            <th>Full Address</th>
            <th>City</th>
            <th>Property Type</th>
            <th>Total Rateable Value</th>
            <th>Has Car Park</th>
            <th>Car Park Rateable Value</th>
            <th>Rateable Value Info</th> 
            <th>Contact</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enq) => {
            // Check if this row is currently expanded
            const isExpanded = expandedRowId === enq.id;

            return (
              <React.Fragment key={enq.id}>
                {/* Main Row: Property Info */}
                <tr>
                  <td>{enq.full_address}</td>
                  <td>{enq.city}</td>
                  <td>{enq.property_type}</td>
                  <td>{Number(enq.total_rateable_value).toFixed(2)}</td>
                  <td>{enq.has_car_park ? 'Yes' : 'No'}</td>
                  <td>{enq.car_park_rateable_value}</td>
                  <td>{enq.rateable_value_info}</td>
                  
                  {/* New "Contact" column with a toggle button */}
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => setExpandedRowId(isExpanded ? null : enq.id)}
                    >
                      {isExpanded ? 'Hide Contact' : 'Show Contact'}
                    </button>
                  </td>

                  {/* Actions column (Edit/Delete) */}
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleEditClick(enq)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEnquiry(enq.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Expanded Row: Only show if isExpanded == true */}
                {isExpanded && (
                  <tr>
                    {/* colSpan should match the total columns (9 in this example) */}
                    <td colSpan={9}>
                      {/* Contact fields */}
                      <div><strong>Enquirer Name:</strong> {enq.enquirer_name}</div>
                      <div><strong>Email:</strong> {enq.email}</div>
                      <div><strong>Contact Number:</strong> {enq.contact_number}</div>
                      <div><strong>Organisation:</strong> {enq.organisation}</div>
                      <div><strong>Role:</strong> {enq.role}</div>
                      <div><strong>Current Position:</strong> {enq.current_position}</div>

                      {/* Estate Agent */}
                      <div><strong>Second Name:</strong> {enq.estate_agent_name}</div>
                      <div><strong>Second Contact:</strong> {enq.estate_agent_contact_number}</div>
                      <div><strong>Second Email:</strong> {enq.estate_agent_email}</div>

                      {/* Landlord */}
                      <div><strong>Third Name:</strong> {enq.landlord_name}</div>
                      <div><strong>Third Phone:</strong> {enq.landlord_phone}</div>
                      <div><strong>Third Email:</strong> {enq.landlord_email}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
