import React from 'react';
import type { Property, Person, PersonProperty } from '../../pages/dashboard';





interface ReportTableProps {
    people: Person[];
    properties: Property[];
    personProperties: PersonProperty[];
    handlePersonHeaderClick: (person: Person) => void;
    handlePropertyHeaderClick: (property: Property) => void;
    handleToggle: (personId: number, propertyId: number) => void;
    onAddProperty: (property: Property, type: 'floor'|'neighbor'|'template') => void;
    handleSelectPersonToContactForm: (person: Person) => void;
  }


  
  
  const ReportTable: React.FC<ReportTableProps> = ({
    people,
    properties,
    personProperties,
    handlePersonHeaderClick,
    handlePropertyHeaderClick,
    handleToggle,
    onAddProperty,
    handleSelectPersonToContactForm,
  }) => {
       
    //group properties by landloard
    const groupedProperties = properties.reduce((groups: { [key: string]: Property[] }, property) => {
      const landlord = property.inquirer || 'Unknown Landlord';
      if (!groups[landlord]) {
        groups[landlord] = [];
      }
      groups[landlord].push(property);
      return groups;
    }, {});
    
    //Expand/Collapse properties of landlord
    const [expandedLandlords, setExpandedLandlords] = React.useState<{ [landlord: string]: boolean }>({});
    const toggleLandlord = (landlord: string) => {
      setExpandedLandlords(prev => ({
        ...prev,
        [landlord]: !prev[landlord]
      }));
    };
    

    return (
    <div className="table-responsive" style={{ overflowX: "auto" }}>
      <table className="table table-bordered table-hover text-center align-middle" 
       style={{ tableLayout: "auto", width: "auto", whiteSpace: "nowrap" }}>
            <thead className="table-light">
            
              <tr>
                {/* New column for Landlord/Organization */}
                <th className="px-3 py-2">
                  Landlord \ Organization
                </th>

                {/* Existing column: "Property \ Person" */}
                <th className="px-3 py-2">
                  Property
                </th>

                {/* ← new header */}
                <th className="px-3 py-2">
                  Add More Property
                </th>

                {/**/}
                {people.map((person) => (
                  <th
                    key={person.id}
                    className="px-3 py-2"
                    style={{ cursor: 'pointer', minWidth: "140px" }}
                  >
                    {/* Name + Family + Plus Button all on one line */}
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span onClick={() => handlePersonHeaderClick(person)}>
                        {(person.name || 'Name') + ' ' + (person.family || '-last name')}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-primary p-1"
                        onClick={(e) => {
                          e.stopPropagation(); // Don't trigger header click
                          handleSelectPersonToContactForm(person);
                        }}
                        style={{ fontSize: "14px", lineHeight: "1", padding: "2px 6px" }}
                      >
                        +
                      </button>
                    </div>

                    {/* Role shown underneath */}
                    <div className="mt-1 small text-muted">
                      <span onClick={() => handlePersonHeaderClick(person)}>
                        Role: {person.role || 'N/A'}
                      </span>
                    </div>
                  </th>
                ))}

                {/* */}
                
                {/* */}
              </tr>
            </thead>

            <tbody>

              {Object.entries(groupedProperties).map(([landlord, landlordProperties]) => (
                  <React.Fragment key={landlord}>
                  {/* Landlord Header Row */}
                  <tr className="table-primary"
                    onClick={() => toggleLandlord(landlord)}
                    style={{ cursor: 'pointer' }}>
                    <td colSpan={3 + people.length} className="text-start fw-bold">
                    👤 {landlord} {expandedLandlords[landlord] ? '▲' : '▼'}
                    </td>
                  </tr>

                   {/* Property Rows - show only if expanded */}
                   {expandedLandlords[landlord] && landlordProperties.map((property) => (
                      <tr key={property.id} className="text-center">
                        {/* Empty landlord column since we already showed it */}
                        <td></td>

                        {/* Property first line address + floor */}
                        <td
                          className="px-3 py-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePropertyHeaderClick(property)}
                        >
                          {(property.property_first_line_address || 'Address') + 
                          (property.property_floor ? ` _ ${property.property_floor}` : '')}
                        </td>

                        {/* Add More Property buttons */}
                        <td className="px-3 py-2">
                          <div className="d-flex gap-2 justify-content-center">
                            {(['floor','neighbor','template'] as const).map(type => (
                              <button
                                key={type}
                                className="btn btn-sm btn-primary"
                                onClick={() => onAddProperty(property, type)}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Checklist for each person */}
                        {people.map((person) => {
                          const relation = personProperties.find(
                            (pp) => pp.property_id === property.id && pp.person_id === person.id
                          );
                          const isRelated = relation?.is_related ?? false;

                          return (
                            <td
                              key={person.id}
                              className="px-3 py-2"
                              onClick={() => handleToggle(person.id, property.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {isRelated ? '✔️' : ''}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>


              ))}         
            </tbody>
          </table>
        </div>
    );
  };
  
  export default ReportTable;