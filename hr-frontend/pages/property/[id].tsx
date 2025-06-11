import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PropertyDetails from '../../components/Dashboard/PropertyDetails'
import type {
  Property,
  Person,
  PersonProperty
} from '../dashboard'    // you export these types in pages/dashboard.tsx

export default function PropertyPage() {
    const { query, isReady } = useRouter()
    const id = Array.isArray(query.id) ? Number(query.id[0]) : Number(query.id)
  
    // Mirror your Dashboard’s state:
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [people, setPeople] = useState<Person[]>([])
    const [personProperties, setPersonProperties] = useState<PersonProperty[]>([])
    const [editPropertyMode, setEditPropertyMode] = useState(false)
    const [editingPersonIdForProperty, setEditingPersonIdForProperty] = useState<number | null>(null)
    const [editedPersonForProperty, setEditedPersonForProperty] = useState<Partial<Person>>({})
  
    useEffect(() => {
      if (!isReady || isNaN(id)) return
  
      // Fetch the one property
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/propertiies/${id}`)
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then((prop) => setSelectedProperty(prop))
        .catch(console.error)
  
      // Fetch people & relationships
      Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/people`).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/person_property`).then(r => r.json())
      ]).then(([peopleList, rels]) => {
        setPeople(peopleList)
        setPersonProperties(rels)
      }).catch(console.error)
    }, [isReady, id])
  
    if (!selectedProperty) return <p>Loading…</p>
  
    return (
      <PropertyDetails
        selectedPropety={selectedProperty}
        people={people}
        personProperties={personProperties}
        editPropertyMode={editPropertyMode}
        fetchPeople={() =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/people`)
            .then(r => r.json())
            .then(setPeople)
        }
        fetchProperties={() =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/propertiies`)
            .then(r => r.json())
           // .then((plist) => {/* you can update a list if needed */})
        }
        fetchPersonProperties={() =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/person_property`)
            .then(r => r.json())
            .then(setPersonProperties)
        }
        setSelectedProperty={setSelectedProperty}
        setEditPropertyMode={setEditPropertyMode}
        //setSelectedPerson={(p) => {
          /* if inside PropertyDetails you click a person, you can handle it here */
          //console.log("Selected person", p);
        //}}
        setEditingPersonIdForProperty={setEditingPersonIdForProperty}
        editingPersonIdForProperty={editingPersonIdForProperty}
        editedPersonForProperty={editedPersonForProperty}
        setEditedPersonForProperty={setEditedPersonForProperty}
      />
    )
  }