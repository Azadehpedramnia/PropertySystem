import React from "react";
import type { Property } from "../../pages/dashboard";

interface Props {
  selectedPropety: Property;
  setSelectedProperty: (p: Property) => void;
}

const PropertyForm: React.FC<Props> = ({ selectedPropety, setSelectedProperty }) => {
  return (
    <>
    <p> 
              <label><strong>Landlord/Organisation:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.inquirer}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, inquirer: e.target.value })
                }
              />
            </p>
            <p>
              <label className="form-label d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedPropety.property_solely_occupied ?? false}
                  onChange={(e) =>
                    setSelectedProperty({ ...selectedPropety, property_solely_occupied: e.target.checked })
                  }
                />
                <span><strong>Is The Property Solely Occupied?</strong></span>
              </label>
            </p>

            <p> 
              <label><strong>Floor Number:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.property_floor}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, property_floor: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Property Fisrt Line Address:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_first_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_first_line_address : e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Property Second Line Address:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_second_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_second_line_address : e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>City:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.city}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, city: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>County:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.property_county}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, property_county: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Country:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.country}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, country: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Postcode:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.post_code}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, post_code: e.target.value.toUpperCase(), })
                }
              />
            </p>
            <p> 
                <label><strong>Property Type:</strong></label> 
                <select
                  className="border p-2 w-full my-1"
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
            </p>

            <p> 
            <label><strong>Property Rateable Value:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.building_rateable_value ?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  building_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
            <p> 
            <label><strong>Rates Payable Before Relief Per Year:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.rates_payable_before_relief ?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
            <label className="inline-flex items-center space-x-2 my-1">
              <input
                type="checkbox"
                checked={selectedPropety.has_car_park}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    has_car_park: e.target.checked, // ✅ checkbox gives true/false
                  })
                }
              />
              <span><strong>Has Car Park?</strong></span>
            </label>
            <p> 
            <label><strong>Car Park Rateable Value:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.car_park_rateable_value ?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  car_park_rateable_value: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
              <p> 
              <label><strong>Car Park Rates Payable Before Relief Per Year:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.car_park_rates_payable_before_relief ?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  car_park_rates_payable_before_relief: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
              <p> 
              <label><strong>Total Rateable Value:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.total_rateable_value ?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  total_rateable_value : e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
            <p> 
              <label><strong>Total Rates Payable Before Mandatory Relief :</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.total_rates_payable_before_mandatory_relief?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    total_rates_payable_before_mandatory_relief : e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
              <p> 
              <label><strong>Total Rates Payable Before Discertionary Relief :</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.total_rates_payable_before_discretionary_relief?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    total_rates_payable_before_discretionary_relief : e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
            <p> 
            <label><strong>Total Rates Payable After Mandatory Relief:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.total_rate_payable_after_mandatory_relief?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  total_rate_payable_after_mandatory_relief : e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
             <p> 
            <label><strong>Total Rates Payable After Discertionary Relief:</strong></label> 
            <input
              className="border p-2 w-full my-1"
              type="number"
              value={selectedPropety.total_rate_payable_after_discretionary_relief?? ''}
              onChange={(e) =>
                setSelectedProperty({
                  ...selectedPropety,
                  total_rate_payable_after_discretionary_relief : e.target.value === '' ? null : Number(e.target.value),
                })
              }
            /></p>
             <p> 
              <label><strong>Rates Multiplier Of The Property :</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.rates_multiplier}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, rates_multiplier: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Donation Due By Landlord:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                type="number"
                value={selectedPropety.donation_due?? ''}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    donation_due : e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              /></p>
            <p>
            <label className="form-label"><strong>Start Date of Lease:</strong></label>
              <input
                type="date"
                className="form-control"
                value={
                  selectedPropety.start_date_of_lease
                    ? new Date(selectedPropety.start_date_of_lease).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    start_date_of_lease: new Date(e.target.value), // 🔁 convert string to Date
                  })
                }
              />
            </p>

            <p>
            <label className="form-label"><strong>End Date Of Lease:</strong></label>
              <input
                type="date"
                className="form-control"
                value={
                  selectedPropety.end_date_of_lease
                    ? new Date(selectedPropety.end_date_of_lease).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    end_date_of_lease: new Date(e.target.value), // 🔁 convert string to Date
                  })
                }
              />
            </p>
            <p>
            <label className="form-label"><strong>Length of Lease:</strong></label>
              <input
                type="number"
                placeholder="Length of Lease (in days)"
                className="border p-2 w-full my-1"
                value={selectedPropety.length_of_lease}
                onChange={(e) =>
                  setSelectedProperty({
                    ...selectedPropety,
                    length_of_lease: Number(e.target.value) || 0, // fallback to 0 if empty
                  })
                }
              />
            </p>
            <p> 
              <label><strong>County:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.property_county}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, property_county: e.target.value })
                }
              />
            </p>
             <p> 
              <label><strong>Country:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.country}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, country: e.target.value })
                }
              />
            </p>
            <p> 
              <label><strong>Landlord's Name::</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_name}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_name: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Email:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_email}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_email: e.target.value })
                }
              /></p>
            <p> 
            <label><strong>Landlord's Contact Number:</strong></label> 
            <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_no}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_no: e.target.value })
                }
              /></p>
            <p> 
              <label><strong>Landlord's First Address Line:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_first_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_first_line_address: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Second Address Line:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_second_line_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_second_line_address: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Floor Number:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_floor_number}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_floor_number: e.target.value })
                }
              /></p>
              <p> 
              <label><strong>Landlord's City:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_city}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_city: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's County:</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_county}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_county: e.target.value })
                }
              /></p>
                   <p> 
              <label><strong>Landlord's Postcode</strong></label> 
              <input
                className="border p-2 w-full my-1"
                value={selectedPropety.landlord_post_code_address}
                onChange={(e) =>
                  setSelectedProperty({ ...selectedPropety, landlord_post_code_address: e.target.value.toUpperCase(), })
                }
              /></p>
    </>
  );
};

export default PropertyForm;
