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
    handlePersonRoleClick: (person: Person) => void;
  }


  
  
  const ReportTable: React.FC<ReportTableProps> = ({
    people,
    properties,
    personProperties,
    //handlePersonHeaderClick,
    handlePropertyHeaderClick,
    handleToggle,
    onAddProperty,
    handleSelectPersonToContactForm,
    handlePersonRoleClick,
  }) => {
       

    // 1️⃣ Group people by full name
    const grouped = people.reduce((acc, p) => {
      const fullName = `${p.name} ${p.family}`;
      if (!acc[fullName]) acc[fullName] = [];
      acc[fullName].push(p);
      return acc;
    }, {} as Record<string, Person[]>);

    // 2️⃣ Turn into an array of [fullName, Person[]] so you can .map it
    const groupedEntries = Object.entries(grouped);

    // 3️⃣ (Optional) flatten back out for your <tbody> mapping
    const flatPeople = groupedEntries.flatMap(([, arr]) => arr);

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
         
            <thead>
               {/* — First header row: merged names + single “+” per group — */}
                <tr>
                  <th className="px-3 py-2">Landlord \ Organization</th>
                  <th className="px-3 py-2">Property</th>
                  <th className="px-3 py-2">Add More Property</th>

                  {groupedEntries.map(([fullName, persons]) => (
                    <th
                      key={fullName}
                      className="px-3 py-2 text-center"
                      colSpan={persons.length}
                      style={{ minWidth: `${persons.length * 140}px` }}
                    >
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <span>{fullName}</span>
                        <button
                          className="btn btn-sm btn-outline-primary p-1"
                          style={{ fontSize: 14, lineHeight: 1, padding: '2px 6px' }}
                          onClick={e => {
                            e.stopPropagation()
                            handleSelectPersonToContactForm(persons[0])
                          }}
                        >+</button>
                      </div>
                    </th>
                  ))}
                </tr>

                {/* — Second header row: one column per role, clickable to open details — */}
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>

                  {groupedEntries.flatMap(([, persons]) =>
                    persons.map(person => (
                      <th
                        key={person.id}
                        className="px-3 py-2 small"
                        style={{ cursor: 'pointer' }}
                        //onClick={() => handlePersonHeaderClick(person)}
                        onClick={() => handlePersonRoleClick(person)}
                      >
                        Role: {person.role || 'N/A'}
                      </th>
                    ))
                  )}
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
                        {flatPeople.map((person) => {
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