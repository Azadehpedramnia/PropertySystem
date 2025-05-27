import { useEffect, useState } from "react";
import { Accordion, Card, ListGroup } from "react-bootstrap";

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
