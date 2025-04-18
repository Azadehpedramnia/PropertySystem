import React from 'react';
import type { Property, Person, PersonProperty } from '../../pages/dashboard';
import Link from 'next/link';





interface ReportTableProps {
    people: Person[];
    properties: Property[];
    personProperties: PersonProperty[];
    handlePersonHeaderClick: (person: Person) => void;
    handlePropertyHeaderClick: (property: Property) => void;
    handleToggle: (personId: number, propertyId: number) => void;
  }
  
  const ReportTable: React.FC<ReportTableProps> = ({
    people,
    properties,
    personProperties,
    handlePersonHeaderClick,
    handlePropertyHeaderClick,
    handleToggle,
  }) => (
    <table className="min-w-full border-collapse border border-gray-300 cursor-pointer">
          <thead>
            <tr className="bg-gray-200">
              {/* New column for Landlord/Organization */}
              <th className="border min-w-[150px] min-h-[50px] p-2 text-center">
                Landlord \ Organization
              </th>

              {/* Existing column: "Property \ Person" */}
              <th className="border min-w-[150px] min-h-[50px] p-2 text-center">
                Property \ Person
              </th>

              {/* Columns for each person’s name */}
              {people.map((person) => (
                <th
                  key={person.id}
                  className="border min-w-[100px] min-h-[50px] p-2 text-center"
                  onClick={() =>handlePersonHeaderClick(person) }
                  //
                  // window.open(`/contact/${person.id}`, '_blank'
                >
                  {person.name || 'Name'}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="text-center">
                {/*
                  1. New TD to show landlord 
                    (assuming property.inquirer 
                    contains the landlord's data)
                */}
                <td className="border min-w-[150px] min-h-[50px] p-2 text-left">
                  {property.inquirer || 'No Landlord'}
                </td>

                {/* 2. Existing "Address" column */}
                <td
                  className="border min-w-[150px] min-h-[50px] p-2 text-left"
                  onClick={() => handlePropertyHeaderClick(property)}
                >
                  {property.address || 'Address'}
                </td>

                {/* 3. Continue your "checklist" columns for each person */}
                {people.map((person) => {
                  const relation = personProperties.find(
                    (pp) =>
                      pp.property_id === property.id && pp.person_id === person.id
                  );
                  const isRelated = relation?.is_related ?? false;

                  return (
                    <td
                      key={person.id}
                      className="border min-w-[100px] min-h-[50px] p-2 cursor-pointer text-center align-middle"
                      onClick={() => handleToggle(person.id, property.id)}
                    >
                      {isRelated ? '✔️' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
  );
  
  export default ReportTable;