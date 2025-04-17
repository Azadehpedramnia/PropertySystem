import React, { useState } from "react";

interface Property {
  id?: number;
  inquirer: string;
  city: string;
  address: string;
  property_type: string;
  building_rateable_value: number | null;
  rates_payable_before_relief: number | null;
  has_car_park: boolean;
  car_park_rateable_value: number | null;
  car_park_rates_payable_before_relief: number | null;
  total_rateable_value: number | null;
  total_rate_payable: number | null;
  donation_due: Date | null;
  post_code: string;
  landlord_Address: string;
  landlord_email: string;
  landlord_no: string;
  rates_multiplier: string;
  start_date_of_lease: Date | null;
  end_date_of_lease: Date | null;
  length_of_lease: number;
  landlord_post_code_address:string;
}

interface RegisterPropertyProps {
  newProperty: Property;
  setNewProperty: React.Dispatch<React.SetStateAction<Property>>;
  addProperrty: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterProperty: React.FC<RegisterPropertyProps> = ({
  newProperty,
  setNewProperty,
  addProperrty,
}) => {
  // State for toggling the second group (existing "extraFields")
  const [showSecondFields, setShowSecondFields] = useState(false);

  // NEW: State for toggling the third group (e.g., "advancedFields")
  const [showThirdFields, setShowThirdFields] = useState(false);

  const [showForthFields , setShowForthFields ] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addProperrty(e);
    // Reset the expansions on submit (optional)
    setShowSecondFields(false);
    setShowThirdFields(false);
    setShowForthFields(false);
  };

  // 1) Basic fields (always visible)
  const basicFields = [
    <div key="inquirer" className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Landlord / Organisation:
      </label>
      <input
        className="form-control"
        placeholder="Landlord / Organisation"
        value={newProperty.inquirer}
        onChange={(e) => setNewProperty({ ...newProperty, inquirer: e.target.value })}
        required
      />
    </div>,
    <div key="address" className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Property Address:
      </label>
      <input
        className="form-control"
        placeholder="Address"
        value={newProperty.address}
        onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
      />
    </div>,
    <div key="post_code" className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Post Code:
      </label>
      <input
        className="form-control"
        placeholder="Post Code"
        value={newProperty.post_code}
        onChange={(e) => setNewProperty({ ...newProperty, post_code: e.target.value })}
      />
    </div>,
    <div key="city" className="d-flex align-items-center mb-3">
        <label className="me-3 mb-0" style={{ width: "160px" }}>
          City:
        </label>
        <input
          className="form-control"
          placeholder="City"
          value={newProperty.city}
          onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
        />
      </div>,
    <div key="property_type" className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Property Type:
      </label>
      <input
        list="property-type-options"
        className="form-control"
        placeholder="Property Type"
        value={newProperty.property_type}
        onChange={(e) =>
          setNewProperty({ ...newProperty, property_type: e.target.value })
        }
      />
      <datalist id="property-type-options">
        <option value="Office" />
        <option value="Retail" />
        <option value="Warehouse" />
      </datalist>
    </div>,
  ];

  // 2) Extra fields (shown/hidden by showExtraFields)
  const secondFields = [
    <div key="building_rateable_value" className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Property Rateable Value:
      </label>
      <input
        type="number"
        className="form-control"
        placeholder="Building Rateable Value"
        value={newProperty.building_rateable_value ?? ""}
        onChange={(e) =>
          setNewProperty({
            ...newProperty,
            building_rateable_value:
              e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
    </div>,
    <div key="rates_payable_before_relief" className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Rates Payable Before Relief per year:
      </label>
      <input
        type="number"
        className="form-control"
        placeholder="Rates payable before relief"
        value={newProperty.rates_payable_before_relief ?? ""}
        onChange={(e) =>
          setNewProperty({
            ...newProperty,
            rates_payable_before_relief:
              e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
    </div>,
     <div className="d-flex align-items-center mb-3">
     <label className="me-3 mb-0" style={{ width: "160px" }}>
       Has Car Park?
     </label>
     <input
       type="checkbox"
       checked={newProperty.has_car_park}
       onChange={(e) =>
         setNewProperty({ ...newProperty, has_car_park: e.target.checked })
       }
     />
   </div>,
 newProperty.has_car_park && (
  <div key="car_park_rateable_value" className="d-flex align-items-center mb-3">
    <label className="me-3 mb-0" style={{ width: "160px" }}>
      Car Park Rateable Value:
    </label>
    <input
      type="number"
      className="form-control"
      placeholder="Car park rateable value"
      value={newProperty.car_park_rateable_value ?? ""}
      onChange={(e) =>
        setNewProperty({
          ...newProperty,
          car_park_rateable_value:
            e.target.value === "" ? null : Number(e.target.value),
        })
      }
    />
  </div>
),
newProperty.has_car_park && (
  <div className="d-flex align-items-center mb-3">
  <label className="me-3 mb-0" style={{ width: "160px" }}>
    Car Park Rates Payable Before Relief per year:
  </label>
  <input
    type="number"
    className="form-control"
    placeholder="Rates before relief"
    value={newProperty.car_park_rates_payable_before_relief ?? ""}
    onChange={(e) =>
      setNewProperty({
        ...newProperty,
        car_park_rates_payable_before_relief:
          e.target.value === "" ? null : Number(e.target.value),
      })
    }
  />
</div>),
 <div className="d-flex align-items-center mb-3">
 <label className="me-3 mb-0" style={{ width: "160px" }}>
   Total Rateable Value:
 </label>
 <input
   type="number"
   className="form-control"
   placeholder="Total rateable value"
   value={newProperty.total_rateable_value ?? ""}
   onChange={(e) =>
     setNewProperty({
       ...newProperty,
       total_rateable_value:
         e.target.value === "" ? null : Number(e.target.value),
     })
   }
 />
</div>,
 <div className="d-flex align-items-center mb-3">
 <label className="me-3 mb-0" style={{ width: "160px" }}>
   Total Rate Payable:
 </label>
 <input
   type="number"
   className="form-control"
   placeholder="Total Rate Payable"
   value={newProperty.total_rate_payable ?? ""}
   onChange={(e) =>
     setNewProperty({
       ...newProperty,
       total_rate_payable:
         e.target.value === "" ? null : Number(e.target.value),
     })
   }
 />
</div>,
<div className="d-flex align-items-center mb-3">
                <label className="me-3 mb-0" style={{ width: "160px" }}>
                  Rates Multiplier applicable for the property :
                </label>
                <input
                  className="form-control"
                  placeholder=" Rates Multiplier applicable "
                  value={newProperty.rates_multiplier}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      rates_multiplier: e.target.value,
                    })
                  }
                />
  </div>

  ];

    // 3) New third group: "advancedFields"
    const thirdFields = [
      <div className="d-flex align-items-center mb-4">
            <label className="me-3 mb-0" style={{ width: "160px" }}>
              Donation Due:
            </label>
            <input
              type="date"
              className="form-control"
              value={
                newProperty.donation_due
                  ? newProperty.donation_due.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  donation_due: e.target.value
                    ? new Date(e.target.value)
                    : null,
                })
              }
            />
          </div>,
    <div className="d-flex align-items-center mb-4">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        start date of lease::
      </label>
      <input
        type="date"
        className="form-control"
        value={
          newProperty.start_date_of_lease
            ? newProperty.start_date_of_lease.toISOString().split("T")[0]
            : ""
        }
        onChange={(e) =>
          setNewProperty({
            ...newProperty,
            start_date_of_lease: e.target.value
              ? new Date(e.target.value)
              : null,
          })
        }
      />
    </div>,
    <div className="d-flex align-items-center mb-4">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        End date of lease::
      </label>
      <input
        type="date"
        className="form-control"
        value={
          newProperty.end_date_of_lease
            ? newProperty.end_date_of_lease.toISOString().split("T")[0]
            : ""
        }
        onChange={(e) =>
          setNewProperty({
            ...newProperty,
            end_date_of_lease: e.target.value
              ? new Date(e.target.value)
              : null,
          })
        }
      />
    </div>,
    <div className="d-flex align-items-center mb-3">
        <label className="me-3 mb-0" style={{ width: "160px" }}>
          Length of Lease (days):
        </label>
        <input
          className="form-control"
          value={newProperty.length_of_lease}
          readOnly
        />
    </div>
   
    ];

  // 4) New third group: "advancedFields"
  const forthFields = [
      <div className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Landlord register Adress:
      </label>
      <input
        className="form-control"
        placeholder="Landlord register Address"
        value={newProperty.landlord_Address}
        onChange={(e) =>
          setNewProperty({
            ...newProperty,
            landlord_Address: e.target.value,
          })
        }
      />
      </div>,
      <div className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: "160px" }}>
        Landlord Postcode
      </label>
      <input
        className="form-control"
        placeholder="Landlord postcode"
        value={newProperty.landlord_post_code_address}
        onChange={(e) =>
          setNewProperty({
            ...newProperty,
            landlord_post_code_address: e.target.value,
          })
        }
      />
      </div>,
      <div className="d-flex align-items-center mb-3">
      <label className="me-3 mb-0" style={{ width: '160px' }}>Landlord Email:</label>
      <input
        className="form-control"
        placeholder="Landlord Email"
        value={newProperty.landlord_email}
        onChange={(e) => setNewProperty({ ...newProperty, landlord_email: e.target.value })}
      />
    </div>,
    <div className="d-flex align-items-center mb-3">
    <label className="me-3 mb-0" style={{ width: '160px' }}>Landlord Contact Number:</label>
    <input
      className="form-control"
      placeholder="Landlord Contact Number"
      value={newProperty.landlord_no}
      onChange={(e) => setNewProperty({ ...newProperty, landlord_no: e.target.value })}
    />
    </div>
  ];

  return (
    <div className="col-md-6 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Register Property</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="g-3">
          {/* 1) Always visible basic fields */}
          {basicFields}

          {/* Toggle button for the second group (existing extraFields) */}
          <div className="text-center my-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowSecondFields((prev) => !prev)}
            >
              {showSecondFields ? "– Collapse" : "+ more"}
            </button>
          </div>

          {/* Conditionally render the second group */}
          {showSecondFields && secondFields}

          {/* Toggle button for the new third group (advancedFields) */}
          {showSecondFields && (
            <div className="text-center my-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowThirdFields((prev) => !prev)}
              >
                {showThirdFields
                  ? "– Collapse"
                  : "+ more"}
              </button>
            </div>
          )}

          {/* Conditionally render the third group */}
          {showThirdFields && thirdFields}

          {/* Toggle button for the new third group (advancedFields) */}
          {showThirdFields && (
            <div className="text-center my-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForthFields((prev) => !prev)}
              >
                {showForthFields
                  ? "– Collapse"
                  : "+ if landlord details requierd"}
              </button>
            </div>
          )}

          {/* Conditionally render the third group */}
          {showForthFields && forthFields}
        </div>



        {/* Submit Button */}
        <div className="text-end">
          <button type="submit" className="btn btn-primary px-4 py-2">
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterProperty;
