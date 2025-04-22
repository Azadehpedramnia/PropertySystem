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
  property_first_line_address:string;
  property_second_line_address:string;
  property_floor:string;
  property_solely_occupied:boolean;
}

interface RegisterPropertyProps {
  newProperty: Property;
  setNewProperty: React.Dispatch<React.SetStateAction<Property>>;
  addProperrty: (e?: React.FormEvent<HTMLFormElement>) => void;
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
    <div key="inquirer" className="col-12">
      <label  className="form-label">
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
    <div className="col-12">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="solelyOccupied"
          checked={newProperty.property_solely_occupied}
          onChange={(e) =>
            setNewProperty({ ...newProperty, property_solely_occupied: e.target.checked })
          }
        />
        <label className="form-check-label" htmlFor="solelyOccupied">
            Is the property solely occupied?
        </label>
      </div>
    </div>
    ,
    !newProperty.property_solely_occupied && (
      <div key="property_floor"className="col-12">
          <label  className="form-label">
            Floor Number:
          </label>
          <input
            className="form-control"
            placeholder="Floor Number"
            value={newProperty.property_floor}
            onChange={(e) => setNewProperty({ ...newProperty, property_floor: e.target.value })}
          />
      </div>
    ),
    <div key="property_first_line_address" className="col-12">
          <label  className="form-label">
            Property Fisrt Line Address:
          </label>
          <input
            className="form-control"
            placeholder="Fisrt Line Address"
            value={newProperty.property_first_line_address}
            onChange={(e) => setNewProperty({ ...newProperty, property_first_line_address: e.target.value })}
          />
    </div>,
    <div key="property_second_line_address" className="col-12">
            <label className="form-label">
              Property Second Line Address:
            </label>
            <input
              className="form-control"
              placeholder="Second Line Address"
              value={newProperty.property_second_line_address}
              onChange={(e) => setNewProperty({ ...newProperty, property_second_line_address: e.target.value })}
            />
    </div>,
    <div key="city" className="col-12">
        <label  className="form-label">
          City:
        </label>
        <input
          className="form-control"
          placeholder="City"
          value={newProperty.city}
          onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
        />
    </div>,
    <div key="post_code" className="col-12">
      <label  className="form-label">
        Post Code:
      </label>
      <input
        className="form-control"
        placeholder="Post Code"
        value={newProperty.post_code}
        onChange={(e) => setNewProperty({ ...newProperty, post_code: e.target.value })}
      />
    </div>,
    <div key="property_type" className="col-12">
      <label  className="form-label">
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
    <div key="building_rateable_value" className="col-12">
      <label  className="form-label">
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
    <div key="rates_payable_before_relief" className="col-12">
      <label  className="form-label">
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
    <div className="col-12">
     <label className="form-label">
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
    <div key="car_park_rateable_value" className="col-12">
      <label  className="form-label">
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
  <div className="col-12">
    <label  className="form-label">
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
  <div className="col-12">
    <label  className="form-label">
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
  <div className="col-12">
    <label  className="form-label">
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
  <div className="col-12">
                <label  className="form-label">
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
      <div className="col-12" key="donation_due">
        <label  className="form-label">
          Donation Due:
        </label>
        <input
          type="date"
          className="form-control"
          value={
            newProperty.donation_due &&
            !isNaN(new Date(newProperty.donation_due as any).getTime())
              ? new Date(newProperty.donation_due as any).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              donation_due: e.target.value ? new Date(e.target.value) : null,
            })
          }
        />
      </div>,
    
      <div className="col-12" key="start_date_of_lease">
        <label  className="form-label">
          Start Date of Lease:
        </label>
        <input
          type="date"
          className="form-control"
          value={
            newProperty.start_date_of_lease &&
            !isNaN(new Date(newProperty.start_date_of_lease as any).getTime())
              ? new Date(newProperty.start_date_of_lease as any).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              start_date_of_lease: e.target.value ? new Date(e.target.value) : null,
            })
          }
        />
      </div>,
    
      <div className="col-12" key="end_date_of_lease">
        <label  className="form-label">
          End Date of Lease:
        </label>
        <input
          type="date"
          className="form-control"
          value={
            newProperty.end_date_of_lease &&
            !isNaN(new Date(newProperty.end_date_of_lease as any).getTime())
              ? new Date(newProperty.end_date_of_lease as any).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              end_date_of_lease: e.target.value ? new Date(e.target.value) : null,
            })
          }
        />
      </div>,
    
      <div className="col-12" key="length_of_lease">
        <label  className="form-label">
          Length of Lease (days):
        </label>
        <input
          className="form-control"
          value={newProperty.length_of_lease}
          readOnly
        />
      </div>,
    ];
    
  // 4) New third group: "advancedFields"
  const forthFields = [
      <div className="col-12">
      <label  className="form-label">
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
      <div className="col-12">
      <label  className="form-label">
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
      <div className="col-12">
      <label  className="form-label">Landlord Email:</label>
      <input
        className="form-control"
        placeholder="Landlord Email"
        value={newProperty.landlord_email}
        onChange={(e) => setNewProperty({ ...newProperty, landlord_email: e.target.value })}
      />
    </div>,
    <div className="col-12">
    <label  className="form-label">Landlord Contact Number:</label>
    <input
      className="form-control"
      placeholder="Landlord Contact Number"
      value={newProperty.landlord_no}
      onChange={(e) => setNewProperty({ ...newProperty, landlord_no: e.target.value })}
    />
    </div>
  ];

  return (
 
      <form onSubmit={handleFormSubmit}>
        <div className="row g-3">
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
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary px-4 py-2">
            Add Property
          </button>
        </div>
      </form>

  );
};

export default RegisterProperty;
