import React from "react";
import type { Property } from "../../pages/dashboard";

interface Props {
  selectedProperty: Property;
}

const PropertySummary: React.FC<Props> = ({ selectedProperty }) => {
  return (
    <>
{/*
      <div className="container py-4">
        {/* Property Information 
        <div className="card mb-4">
          <div className="card-header bg-dark text-white">🏠 Property Information</div>
          <div className="card-body row">
            <div className="col-md-6"><strong>Landlord/Organisation:</strong> {selectedProperty.inquirer}</div>
            <div className="col-md-6"><strong>Solely Occupied:</strong> {selectedProperty.property_solely_occupied ? 'Yes' : 'No'}</div>
            <div className="col-md-6"><strong>Floor Number:</strong> {selectedProperty.property_floor}</div>
            <div className="col-md-6"><strong>First Address Line:</strong> {selectedProperty.property_first_line_address}</div>
            <div className="col-md-6"><strong>Second Address Line:</strong> {selectedProperty.property_second_line_address}</div>
            <div className="col-md-6"><strong>City:</strong> {selectedProperty.city}</div>
            <div className="col-md-6"><strong>County:</strong> {selectedProperty.property_county}</div>
            <div className="col-md-6"><strong>Country:</strong> {selectedProperty.country}</div>
            <div className="col-md-6"><strong>Postcode:</strong> {selectedProperty.post_code}</div>
            <div className="col-md-6"><strong>Property Type:</strong> {selectedProperty.property_type}</div>
          </div>
        </div>

        {/* Rates and Financial Info 
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">💰 Rates & Financial Information</div>
          <div className="card-body row">
            <div className="col-md-6"><strong>Property Rateable Value:</strong> {selectedProperty.building_rateable_value}</div>
            <div className="col-md-6"><strong>Rates Payable Before Relief (Yearly):</strong> {selectedProperty.rates_payable_before_relief}</div>
            <div className="col-md-6"><strong>Has Car Park:</strong> {selectedProperty.has_car_park ? 'Yes' : 'No'}</div>
            <div className="col-md-6"><strong>Car Park Rateable Value:</strong> {selectedProperty.car_park_rateable_value}</div>
            <div className="col-md-6"><strong>Car Park Rates Before Relief:</strong> {selectedProperty.car_park_rates_payable_before_relief}</div>
            <div className="col-md-6"><strong>Total Rateable Value:</strong> {selectedProperty.total_rateable_value}</div>
            <div className="col-md-6"><strong>Total Rates Before Mandatory Relief:</strong> {selectedProperty.total_rates_payable_before_mandatory_relief}</div>
            <div className="col-md-6"><strong>Total Rates Before Discretionary Relief:</strong> {selectedProperty.total_rates_payable_before_discretionary_relief}</div>
            <div className="col-md-6"><strong>Total Rates After Mandatory Relief:</strong> {selectedProperty.total_rate_payable_after_mandatory_relief}</div>
            <div className="col-md-6"><strong>Total Rates After Discretionary Relief:</strong> {selectedProperty.total_rate_payable_after_discretionary_relief}</div>
            <div className="col-md-6"><strong>Rates Multiplier:</strong> {selectedProperty.rates_multiplier}</div>
         
          </div>
        </div>

        {/* Lease Details 
        <div className="card mb-4">
          <div className="card-header bg-dark text-white">📅 Lease Details</div>
          <div className="card-body row">
            <div className="col-md-6">
              <strong>Start Date of Lease:</strong>{' '}
              {selectedProperty.start_date_of_lease
                ? new Date(selectedProperty.start_date_of_lease).toISOString().split('T')[0]
                : 'N/A'}
            </div>
            <div className="col-md-6">
              <strong>End Date of Lease:</strong>{' '}
              {selectedProperty.end_date_of_lease
                ? new Date(selectedProperty.end_date_of_lease).toISOString().split('T')[0]
                : 'N/A'}
            </div>
            <div className="col-md-6">
              <strong>Donation Due By Landlord:</strong> 
              {selectedProperty.donation_due !== null && selectedProperty.donation_due !== undefined
                ? ` £${selectedProperty.donation_due}`
                : ' N/A'}
            </div>
            <div className="col-md-6"><strong>Length of Lease:</strong> {selectedProperty.length_of_lease}</div>
          </div>
        </div>

        {/* Landlord Details */}
   {/*     <div className="card mb-4">
          <div className="card-header bg-secondary text-white">👤 Landlord Information</div>
          <div className="card-body row">
            <div className="col-md-6"><strong>Name:</strong> {selectedProperty.landlord_name}</div>
            <div className="col-md-6"><strong>Email:</strong> {selectedProperty.landlord_email}</div>
            <div className="col-md-6"><strong>Contact Number:</strong> {selectedProperty.landlord_no}</div>
            <div className="col-md-6"><strong>First Address Line:</strong> {selectedProperty.landlord_first_line_address}</div>
            <div className="col-md-6"><strong>Second Address Line:</strong> {selectedProperty.landlord_second_line_address}</div>
            <div className="col-md-6"><strong>Floor Number:</strong> {selectedProperty.landlord_floor_number}</div>
            <div className="col-md-6"><strong>City:</strong> {selectedProperty.landlord_city}</div>
            <div className="col-md-6"><strong>County:</strong> {selectedProperty.landlord_county}</div>
            <div className="col-md-6"><strong>Postcode:</strong> {selectedProperty.landlord_post_code_address}</div>
          </div>
        </div>
      </div>
*/}

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
