
import { useEffect, useState } from "react";

type PersonWithContractSignedProperty = {
  person_id: number;
  name: string;
  role: string;
  email: string;
  contact_number: string;
  organisation: string;
  organisation_email: string;
  property_id: number;
  property_floor: string;
  property_first_line_address: string;
  property_second_line_address: string;
  city: string;
  property_county: string;
  country: string;
  post_code: string;
  landlord_name:string;
  landlord_floor_number:string;
  landlord_first_line_address:string;
  landlord_second_line_address:string;
  landlord_city:string;
  landlord_county:string;
  landlord_post_code_address:string;
};

type GroupedData = {
  [organisation: string]: {
    [landlord_name: string]: PersonWithContractSignedProperty[];
  };
};

export default function PeopleWithSignedPropertiesGrouped() {
  const [grouped, setGrouped] = useState<GroupedData>({});

  useEffect(() => {
    fetch("http://localhost:5000/api/people-with-signed-properties")
      .then((res) => res.json())
      .then((data: PersonWithContractSignedProperty[]) => {
        const groupedData: GroupedData = {};

        data.forEach((item) => {
          const org = item.organisation || "Unknown Organisation";
          const landlord = item.landlord_name || "Unknown Landlord";

          if (!groupedData[org]) {
            groupedData[org] = {};
          }

          if (!groupedData[org][landlord]) {
            groupedData[org][landlord] = [];
          }

          groupedData[org][landlord].push(item);
        });

        setGrouped(groupedData);
      })
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Invoice</h1>
      <p>you can create invoice file for each property in this page</p>


      {Object.entries(grouped).map(([org, landlords]) => (
        <details key={org} style={{ marginBottom: 10 }}>
          <summary>
            <strong>{org}</strong>
          </summary>
          <div style={{ marginLeft: 20, marginTop: 5 }}>
            {Object.entries(landlords).map(([landlord, properties]) => (
              <details key={landlord} style={{ marginBottom: 5 }}>
                <summary>
                  <strong>Landlord:</strong> {landlord}
                </summary>
                <div style={{ marginLeft: 20, marginTop: 5 }}>
                  {properties.map((prop, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #ddd",
                        padding: 10,
                        marginBottom: 8,
                        borderRadius: 5,
                      }}
                    >
                      <p>
                        <strong>Employee:</strong> {prop.name} ({prop.role}) -{" "}
                        {prop.email}
                      </p>
                      <p>{/*create invoice for this property i have to save the data in invoice  in database,and download as pdf  , email to organisation_email,it is need to save on server rack too for search in future what is you idea*/}
                        <strong>Property Address:</strong>{" "}
                        {prop.property_floor}, {prop.property_first_line_address},{" "}
                        {prop.property_second_line_address}, {prop.city},{" "}
                        {prop.post_code}, {prop.country}
                      </p>
                      <p>
                        <strong>Landlord Address:</strong>{" "}
                        {prop.landlord_floor_number},{" "}
                        {prop.landlord_first_line_address},{" "}
                        {prop.landlord_second_line_address},{" "}
                        {prop.landlord_city}, {prop.landlord_post_code_address}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
