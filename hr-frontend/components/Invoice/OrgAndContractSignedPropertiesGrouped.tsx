import { useEffect, useState } from "react";
import EmailInvoiceButton from "./EmailInvoiceButton";

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
  landlord_name: string;
  landlord_floor_number: string;
  landlord_first_line_address: string;
  landlord_second_line_address: string;
  landlord_city: string;
  landlord_county: string;
  landlord_post_code_address: string;
  donation_due:string;
  start_date_of_lease:Date;
  inquirer:string;
};

type GroupedData = {
  [organisation: string]: {
    [inquirer: string]: PersonWithContractSignedProperty[];
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
          const landlord = item.inquirer || "Unknown Landlord";

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

///invoice
const [loadingIdx, setLoadingIdx] = useState<string | null>(null);
const [downloadLinks, setDownloadLinks] = useState<{ [key: string]: string }>({});



const handleCreateInvoice = async (prop: PersonWithContractSignedProperty, idx: number) => {
  setLoadingIdx(`${prop.person_id}-${prop.property_id}`);
  setDownloadLinks((links) => ({ ...links, [`${prop.person_id}-${prop.property_id}`]: "" }));

  // Construct invoice data for backend

const invoiceData = {
  landlord_name: prop.landlord_name,
  landlord_floor_number: prop.landlord_floor_number,
  landlord_first_line_address: prop.landlord_first_line_address,
  landlord_second_line_address: prop.landlord_second_line_address,
  landlord_city: prop.landlord_city,
  landlord_county: prop.landlord_county,
  landlord_post_code_address: prop.landlord_post_code_address,
  property_floor: prop.property_floor,
  property_first_line_address: prop.property_first_line_address,
  property_second_line_address: prop.property_second_line_address,
  city: prop.city,
  property_county: prop.property_county,
  country: prop.country,
  post_code: prop.post_code,
  rent_period: "July 2025", // or dynamic
  landlord_contribution: (Number(prop.donation_due) + 1).toFixed(2),
  donation_due: prop.donation_due,
  total: (2 * Number(prop.donation_due) + 1).toFixed(2),
  property_id: prop.property_id,
  //remit_date: "27th January 2025"
};

//fetch URL
  try {
    const response = await fetch("http://localhost:5000/api/invoices/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData)
    });
    if (!response.ok) throw new Error("Failed to generate invoice.");
    const data = await response.json();
    setDownloadLinks((links) => ({
      ...links,
      [`${prop.person_id}-${prop.property_id}`]: `http://localhost:5000/public/invoices/${data.fileName}`
    }));
  } catch (error) {
    alert("Invoice creation failed");
  }
  setLoadingIdx(null);
};



///end of invoice things
  return (
    <div style={{ padding: 20 }}>
      <h1>Invoice</h1>
       <p>you can create invoice file for each property in this page</p>
      {Object.entries(grouped).map(([org, landlords]) => (
        <details key={org} style={{ marginBottom: 10 }}>
          <summary>
            <strong>{org}</strong>
          </summary>
          <EmailInvoiceButton organisation={org} />
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
                        <strong>Property Address:</strong>{" "}
                        {prop.property_floor}, {prop.property_first_line_address},{" "}
                        {prop.property_second_line_address}, {prop.city},{" "}
                        {prop.post_code}, {prop.country}
                      </p>
                      {/* 
                
                      {/* Create Invoice Button */}
                        <button
                            className="btn btn-primary"
                            disabled={loadingIdx === `${prop.person_id}-${prop.property_id}`}
                            onClick={() => handleCreateInvoice(prop, idx)}
                          >
                            {loadingIdx === `${prop.person_id}-${prop.property_id}` ? "Creating..." : "Create Invoice"}
                          </button>
                          {downloadLinks[`${prop.person_id}-${prop.property_id}`] && (
                            <a
                              href={downloadLinks[`${prop.person_id}-${prop.property_id}`]}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginLeft: 10 }}
                              download
                            >
                              Download Invoice PDF
                            </a>
                            
                          )}
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
