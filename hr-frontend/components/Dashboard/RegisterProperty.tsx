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
  total_rate_payable_before_relief: number | null;
  post_code: string;
  landlord_Address: string;
  landlord_email: string;
  landlord_no: string;
  rates_multiplier: string;
  start_date_of_lease: Date | null;
  end_date_of_lease: Date | null;
  length_of_lease: number;
  lease_duration_text : string;
  landlord_post_code_address:string;
  property_first_line_address:string;
  property_second_line_address:string;
  property_floor:string;
  property_solely_occupied:boolean;
  property_county:string;
  landlord_county:string;
  donation_due:number | null;
  total_rate_payable_after_relief:number| null;
  landlord_name:string;
  landlord_city:string;
  landlord_first_line_address:string;
  landlord_second_line_address:string;
  landlord_floor_number:string;
  country:string;
  total_rates_payable_before_mandatory_relief:number | null;
  total_rates_payable_before_discretionary_relief:number | null;
  total_rate_payable_after_mandatory_relief:number | null;
  total_rate_payable_after_discretionary_relief:number | null;
}

interface RegisterPropertyProps {
  newProperty: Property;
  setNewProperty: React.Dispatch<React.SetStateAction<Property>>;
  addProperrty: (e?: React.FormEvent<HTMLFormElement>) => void;
  onSuccessAdd: () => void;
}

const RegisterProperty: React.FC<RegisterPropertyProps> = ({
  newProperty,
  setNewProperty,
  addProperrty,
  onSuccessAdd ,
}) => {
  // State for toggling the second group (existing "extraFields")
  const [showSecondFields, setShowSecondFields] = useState(false);

  // NEW: State for toggling the third group (e.g., "advancedFields")
  const [showThirdFields, setShowThirdFields] = useState(false);

  const [showForthFields , setShowForthFields ] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addProperrty(e);
    onSuccessAdd();  
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
    <div key="property_solely_occupied" className="col-12">
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
            Is The Property Solely Occupied?
        </label>
      </div>
    </div>
    ,
    !newProperty.property_solely_occupied && (
      <div key="property_floor" className="col-12">
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
      <div key="property_county" className="col-12">
        <label  className="form-label">
          County:
        </label>
        <input
          className="form-control"
          placeholder="property_county"
          value={newProperty.property_county}
          onChange={(e) => setNewProperty({ ...newProperty, property_county: e.target.value })}
        />
      </div>,
      <div key="country" className="col-12">
        <label  className="form-label">
          country:
        </label>
        <input
          className="form-control"
          placeholder="Country"
          value={newProperty.country}
          onChange={(e) => setNewProperty({ ...newProperty, country: e.target.value })}
        />
      </div>,

    <div key="post_code" className="col-12">
      <label  className="form-label">
        Postcode:
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
        Rates Payable Before Relief Per Year:
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
    <div key="has_car_park" className="col-12">
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
  <div key="car_park_rates_payable_before_relief"  className="col-12">
    <label  className="form-label">
      Car Park Rates Payable Before Relief Per Year:
    </label>
    <input
      type="number"
      className="form-control"
      placeholder="Rates Before Relief"
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
  <div key="total_rateable_value " className="col-12">
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
  <div key="total_rates_payable_before_mandatory_relief " className="col-12">
    <label  className="form-label">
      Total Rates Payable Mandatory Before Relief:
    </label>
    <input
      type="number"
      className="form-control"
      placeholder=" Total Rates Payable Mandatory Before Relief"
      value={newProperty.total_rates_payable_before_mandatory_relief?? ""}
      onChange={(e) =>
        setNewProperty({
          ...newProperty,
          total_rates_payable_before_mandatory_relief:
            e.target.value === "" ? null : Number(e.target.value),
        })
      }
    />
  </div>,
    <div key="total_rates_payable_before_discretionary_relief " className="col-12">
    <label  className="form-label">
      Total Rates Payable Before Discretionary Relief:
    </label>
    <input
      type="number"
      className="form-control"
      placeholder=" Total Rates Payable Before Discretionary Relief"
      value={newProperty.total_rates_payable_before_discretionary_relief?? ""}
      onChange={(e) =>
        setNewProperty({
          ...newProperty,
          total_rates_payable_before_discretionary_relief:
            e.target.value === "" ? null : Number(e.target.value),
        })
      }
    />
  </div>,
  <div key="total_rate_payable_after_mandatory_relief " className="col-12">
    <label  className="form-label">
      Total Rates Payable After Mandatory Relief:
    </label>
    <input
      type="number"
      className="form-control"
      placeholder="Total Rates Payable After Mandatory Relief"
      value={newProperty.total_rate_payable_after_mandatory_relief?? ""}
      onChange={(e) =>
        setNewProperty({
          ...newProperty,
          total_rate_payable_after_mandatory_relief:
            e.target.value === "" ? null : Number(e.target.value),
        })
      }
    />
  </div>,
  <div key="total_rate_payable_after_discretionary_relief " className="col-12">
    <label  className="form-label">
      Total Rates Payable After Discretionary Relief:
    </label>
    <input
      type="number"
      className="form-control"
      placeholder="Total Rates Payable After Discretionary Relief"
      value={newProperty.total_rate_payable_after_discretionary_relief?? ""}
      onChange={(e) =>
        setNewProperty({
          ...newProperty,
          total_rate_payable_after_discretionary_relief:
            e.target.value === "" ? null : Number(e.target.value),
        })
      }
    />
  </div>,
  <div key="rates_multiplier" className="col-12">
                <label  className="form-label">
                  Rates Multiplier Of The Property :
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
      // this type is number not date
      <div className="col-12" key="donation_due">
        <label  className="form-label">
          Donation Due By Landlord:
        </label>

        <input
          type="number"
          placeholder="Donation Due By Landlord"
          className="form-control"
          value={newProperty.donation_due ?? ""}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              donation_due: e.target.value ?  parseFloat(e.target.value) : null,
            })
          }
        />
      </div>,

      
    
      <div className="col-12" key="start_date_of_lease">
        <label className="form-label">Start Date Of Lease:</label>
        <input
          type="date"
          className="form-control"
          value={
            newProperty.start_date_of_lease &&
            !isNaN(new Date(newProperty.start_date_of_lease).getTime())
            ? new Date(newProperty.start_date_of_lease).toISOString().split('T')[0]
            : ""
          }
          onChange={(e) => {
            const selectedStartDate = e.target.value ? new Date(e.target.value) : null;
            
            setNewProperty(prev => ({
              ...prev,
              start_date_of_lease: selectedStartDate,
              // If user changes start date AFTER setting end date, clear end date if invalid
              end_date_of_lease:
                selectedStartDate && prev.end_date_of_lease && prev.end_date_of_lease < selectedStartDate
                  ? null
                  : prev.end_date_of_lease,
            }));
          }}
        />
      </div>,
    
 
    <div className="col-12" key="end_date_of_lease">
      <label className="form-label">End Date Of Lease:</label>
      <input
        type="date"
        className="form-control"
        min={
          newProperty.start_date_of_lease &&
          !isNaN(new Date(newProperty.start_date_of_lease).getTime())
            ? new Date(newProperty.start_date_of_lease).toISOString().split('T')[0]
            : undefined
        }
        value={
          newProperty.end_date_of_lease &&
          !isNaN(new Date(newProperty.end_date_of_lease).getTime())
            ? new Date(newProperty.end_date_of_lease).toISOString().split('T')[0]
            : ""
        }
        onChange={(e) => {
          const selectedEndDate = e.target.value ? new Date(e.target.value) : null;
          // Validate: End date should not be before start date
          if (
            selectedEndDate &&
            newProperty.start_date_of_lease &&
            selectedEndDate < newProperty.start_date_of_lease
          ) {
            alert("Clear your current date before update! Start with year if you update manually.");
            return;
          }
          setNewProperty(prev => ({
            ...prev,
            end_date_of_lease: selectedEndDate,
          }));
        }}
      />
    </div>,
      
    
      <div className="col-12" key="length_of_lease">
        <label  className="form-label">
          Length of Lease:
        </label> 
        <input
          placeholder=" Length of Lease"
          className="form-control"
          value={newProperty.lease_duration_text}
          //value={newProperty.length_of_lease} (days)
          readOnly
        />
      </div>,
    ];
    
  // 4) New third group: "advancedFields"
  const forthFields = [
      <div key="landlord_name"  className="col-12">
        <label  className="form-label">
          Landlord's Name:
        </label>
        <input
          className="form-control"
          placeholder="Landlord's Name"
          value={newProperty.landlord_name}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_name: e.target.value,
            })
          }
        />
      </div>,

      <div key="landlord_email" className="col-12">
          <label  className="form-label">Landlord's Email:</label>
          <input
            className="form-control"
            placeholder="Landlord Email"
            value={newProperty.landlord_email}
            onChange={(e) => setNewProperty({ ...newProperty, landlord_email: e.target.value })}
          />
      </div>,
      <div key="landlord_no" className="col-12">
         <label  className="form-label">Landlord's Contact Number:</label>
         <input
           className="form-control"
           placeholder="Landlord Contact Number"
           value={newProperty.landlord_no}
           onChange={(e) => setNewProperty({ ...newProperty, landlord_no: e.target.value })}
         />
      </div>,

   


      <div key="andlord_first_line_address"  className="col-12">
        <label  className="form-label">
          Landlord's First Address Line:
        </label>
        <input
          className="form-control"
          placeholder="Landlord's Registered Address"
          value={newProperty.landlord_first_line_address}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_first_line_address: e.target.value,
            })
          }
        />
      </div>,
      <div key="landlord_second_line_address"  className="col-12">
        <label  className="form-label">
          Landlord's Second Address Line:
        </label>
        <input
          className="form-control"
          placeholder="Landlord's Registered Address"
          value={newProperty.landlord_second_line_address}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_second_line_address: e.target.value,
            })
          }
        />
      </div>,
      <div key="landlord_floor_number"  className="col-12">
        <label  className="form-label">
          Landlord's Floor Number:
        </label>
        <input
          className="form-control"
          placeholder="Landlord's Floor Number"
          value={newProperty.landlord_floor_number}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_floor_number: e.target.value,
            })
          }
        />
      </div>,
  
      <div key="landlord_city"  className="col-12">
        <label  className="form-label">
          Landlord's City:
        </label>
        <input
          className="form-control"
          placeholder="Landlord's City"
          value={newProperty.landlord_city}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_city: e.target.value,
            })
          }
        />
      </div>,
      <div key="landlord_county"  className="col-12">
        <label  className="form-label">
          Landlord's County:
        </label>
        <input
          className="form-control"
          placeholder="Landlord's County"
          value={newProperty.landlord_county}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_county: e.target.value,
            })
          }
        />
      </div>,
      <div key="landlord_post_code_address" className="col-12">
        <label  className="form-label">
          Landlord's Postcode
        </label>
        <input
          className="form-control"
          placeholder="Landlord postcode"
          pattern="^[A-Za-z].*"
          title="Postcode must start with a letter"
          value={newProperty.landlord_post_code_address}
          onChange={(e) =>
            setNewProperty({
              ...newProperty,
              landlord_post_code_address: e.target.value.toUpperCase(),
            })
          }
        />
      </div>,

   
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
              {showSecondFields ? "– Minimise" : "+ More"}
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
                  ? "– Minimise"
                  : "+ More"}
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
                  ? "– Minimise"
                  : "+ If Landlord Details Requierd"}
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
