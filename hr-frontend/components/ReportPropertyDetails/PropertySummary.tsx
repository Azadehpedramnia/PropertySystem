import React from "react";
import type { Property } from "../../pages/dashboard";

interface Props {
  selectedProperty: Property;
}

const PropertySummary: React.FC<Props> = ({ selectedProperty }) => {
  return (
    <>
      <p><strong>Landlord/Organisation:</strong> {selectedProperty.inquirer}</p>
      <p><strong>Is The Property Solely Occupied?:</strong> {selectedProperty.property_solely_occupied ? 'Yes' : 'No'}</p>
      <p><strong>Floor Number:</strong> {selectedProperty.property_floor}</p>
      <p><strong>Property First Line Address:</strong> {selectedProperty.property_first_line_address}</p>
      <p><strong>Property Second Line Address:</strong> {selectedProperty.property_second_line_address}</p>
      <p><strong>City:</strong> {selectedProperty.city}</p>
      <p><strong>County:</strong> {selectedProperty.property_county}</p>
      <p><strong>Country:</strong> {selectedProperty.country}</p>
      <p><strong>Postcode:</strong> {selectedProperty.post_code}</p>
      <p><strong>Property Type:</strong> {selectedProperty.property_type}</p>

      <p><strong>Property Rateable Value:</strong> {selectedProperty.building_rateable_value}</p>
      <p><strong>Rates Payable Before Relief Per Year:</strong> {selectedProperty.rates_payable_before_relief}</p>
      <p><strong>Has Car Park:</strong> {selectedProperty.has_car_park ? 'Yes' : 'No'}</p>
      <p><strong>Car Park Rateable Value:</strong> {selectedProperty.car_park_rateable_value}</p>
      <p><strong>Car Park Rates Payable Before Relief Per Year:</strong> {selectedProperty.car_park_rates_payable_before_relief}</p>
      <p><strong>Total Rateable Value:</strong> {selectedProperty.total_rateable_value}</p>
      <p><strong>Total Rates Payable Before Mandatory Relief:</strong> {selectedProperty.total_rates_payable_before_mandatory_relief}</p>
      <p><strong>Total Rates Payable Before Discretionary Relief:</strong> {selectedProperty.total_rates_payable_before_discretionary_relief}</p>
      <p><strong>Total Rates Payable After Mandatory Relief:</strong> {selectedProperty.total_rate_payable_after_mandatory_relief}</p>
      <p><strong>Total Rates Payable After Discretionary Relief:</strong> {selectedProperty.total_rate_payable_after_discretionary_relief}</p>
      <p><strong>Rates Multiplier Of The Property:</strong> {selectedProperty.rates_multiplier}</p>

      <p><strong>Donation Due By Landlord:</strong>
        {selectedProperty.donation_due !== null && selectedProperty.donation_due !== undefined
          ? `£${selectedProperty.donation_due}`
          : 'N/A'}
      </p>

      <p><strong>Start Date of Lease:</strong>
        {selectedProperty.start_date_of_lease
          ? new Date(selectedProperty.start_date_of_lease).toISOString().split('T')[0]
          : 'N/A'}
      </p>

      <p><strong>End Date of Lease:</strong>
        {selectedProperty.end_date_of_lease
          ? new Date(selectedProperty.end_date_of_lease).toISOString().split('T')[0]
          : 'N/A'}
      </p>

      <p><strong>Length Of Lease:</strong> {selectedProperty.length_of_lease}</p>

      <p><strong>Landlord's Name:</strong> {selectedProperty.landlord_name}</p>
      <p><strong>Landlord's Email:</strong> {selectedProperty.landlord_email}</p>
      <p><strong>Landlord's Contact Number:</strong> {selectedProperty.landlord_no}</p>

      <p><strong>Landlord's First Address Line:</strong> {selectedProperty.landlord_first_line_address}</p>
      <p><strong>Landlord's Second Address Line:</strong> {selectedProperty.landlord_second_line_address}</p>
      <p><strong>Landlord's Floor Number:</strong> {selectedProperty.landlord_floor_number}</p>
      <p><strong>Landlord's City:</strong> {selectedProperty.landlord_city}</p>
      <p><strong>Landlord's County:</strong> {selectedProperty.landlord_county}</p>
      <p><strong>Landlord's Postcode:</strong> {selectedProperty.landlord_post_code_address}</p>
    </>
  );
};

export default PropertySummary;
