{/*import { useEffect, useState } from "react";
import { Accordion, Card, ListGroup } from "react-bootstrap";
import { Button, Spinner } from "react-bootstrap";

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
    <div className="container mt-4">
      <h2 className="mb-4">Invoice</h2>
       <p>you can create invoice file for each property in this page</p>
      <Accordion defaultActiveKey="0">
        {Object.entries(grouped).map(([org, landlords], orgIdx) => (
          <Accordion.Item eventKey={String(orgIdx)} key={org}>
            <Accordion.Header>{org}</Accordion.Header>
            <Accordion.Body>
              <Accordion alwaysOpen>
                {Object.entries(landlords).map(([landlord, properties], landlordIdx) => (
                  <Accordion.Item
                    eventKey={`${orgIdx}-${landlordIdx}`}
                    key={`${org}-${landlord}`}
                  >
                    <Accordion.Header>
                      Landlord: {landlord}
                    </Accordion.Header>
                    <Accordion.Body>
                      {properties.map((prop, idx) => (
                        <Card className="mb-3" key={idx}>
                          <Card.Header>
                            <strong>Employee:</strong> {prop.name} ({prop.role})
                          </Card.Header>
                          <Card.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>
                                <strong>Email:</strong> {prop.email}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <strong>Contact Number:</strong> {prop.contact_number}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <strong>Organisation Email:</strong> {prop.organisation_email}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <strong>Property Address:</strong> {prop.property_floor}, {prop.property_first_line_address}, {prop.property_second_line_address}, {prop.city}, {prop.post_code}, {prop.country}

                          

                               {/*here i want to add create invoice for creatinf invoice (saving data, abolity to download and email invoice) 
                            

                              </ListGroup.Item>
                              <ListGroup.Item>
                                <strong>Landlord Address:</strong> {prop.landlord_floor_number}, {prop.landlord_first_line_address}, {prop.landlord_second_line_address}, {prop.landlord_city}, {prop.landlord_post_code_address}
                              </ListGroup.Item>
                            </ListGroup>
                          </Card.Body>
                        </Card>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
 */}

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
  landlord_name: string;
  landlord_floor_number: string;
  landlord_first_line_address: string;
  landlord_second_line_address: string;
  landlord_city: string;
  landlord_county: string;
  landlord_post_code_address: string;
};

type GroupedData = {
  [organisation: string]: {
    [landlord_name: string]: PersonWithContractSignedProperty[];
  };
};

export default function PeopleWithSignedPropertiesGrouped() {
  const [grouped, setGrouped] = useState<GroupedData>({});

  //Download invoice
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  

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
                      <p>
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
                      {/* Create Invoice Button */}
                      {downloadLink ? (
                        <p>
                          ✅ Invoice ready:{" "}
                          <a
                            href={`http://localhost:5000/invoices/${downloadLink}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Invoice
                          </a>
                        </p>
                      ) : (
                        <button
                          onClick={async () => {
                            setLoading(true);

                            const propertyAddress = `${prop.property_floor}, ${prop.property_first_line_address}, ${prop.property_second_line_address}, ${prop.city}, ${prop.post_code}, ${prop.country}`;

                            const response = await fetch("http://localhost:5000/api/invoices/create", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                organisation_name: prop.organisation,
                                organisation_email: prop.organisation_email,
                                landlord_name: prop.landlord_name,
                                property_address: propertyAddress,
                                total_amount: 2838.72, // Replace with dynamic value if needed
                              }),
                            });

                            const data = await response.json();
                            setDownloadLink(data.fileName);
                            setLoading(false);
                          }}
                          disabled={loading}
                        >
                          {loading ? "Creating..." : "Create Invoice"}
                        </button>
                      )}

                      {/**/}

                      {downloadLink ? (
                        <p>
                          ✅ <a href={`http://localhost:5000/invoices/${downloadLink}`} target="_blank" download>Download Invoice</a>
                        </p>
                      ) : (
                        <button
                          disabled={loading}
                          onClick={async () => {
                            setLoading(true);
                            const propertyAddress = `${prop.property_floor}, ${prop.property_first_line_address}, ${prop.property_second_line_address}, ${prop.city}, ${prop.post_code}, ${prop.country}`;

                            try {
                              const response = await fetch("http://localhost:5000/api/invoices/create", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  organisation_name: prop.organisation,
                                  organisation_email: prop.organisation_email,
                                  landlord_name: prop.landlord_name,
                                  property_address: propertyAddress,
                                  total_amount: 2838.72, // Update with real amount if you have it
                                }),
                              });

                              const data = await response.json();
                              if (data.fileName) {
                                setDownloadLink(data.fileName);
                              }
                            } catch (err) {
                              console.error("Failed to create invoice:", err);
                              alert("Invoice generation failed");
                            }

                            setLoading(false);
                          }}
                        >
                          {loading ? "Creating Invoice..." : "Create Invoice"}
                        </button>
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
