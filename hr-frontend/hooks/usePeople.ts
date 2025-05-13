import { useEffect, useState } from 'react';

export interface Person {
  id: number;
  name: string;
  organisation: string;
  role: string;
  email: string;
  contact_number: string;
  family: string;
  your_curren_position: string;
  property_address_for_enquiry: string;
  total_rateable_value_of_the_property: string;
  estate_agents_name: string;
  estate_agent_contact_number: string;
  estate_agent_email: string;
  poc_email: string;
  poc_contact_numbe: string;
  poc_leases: string;
}

export const usePeople = () => {
  const [people, setPeople] = useState<Person[]>([]);

  const fetchPeople = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/people');
      const data = await res.json();
      setPeople(data);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return { people, setPeople, fetchPeople };
};
