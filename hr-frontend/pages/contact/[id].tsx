

// pages/dashboard/person/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PersonDetails from '../../components/Dashboard/PersonDetails'
import type {
  Person,
  Property,
  PersonProperty
} from '../dashboard'   // you already export these in pages/dashboard

export default function PersonPage() {
  const { query, isReady } = useRouter()
  const id = Array.isArray(query.id) ? Number(query.id[0]) : Number(query.id)

  // exactly the same bits of state you had in Dashboard
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [personProperties, setPersonProperties] = useState<PersonProperty[]>([])
  const [editPersonMode, setEditPersonMode] = useState(false)
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null)
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({})
  
  

  useEffect(() => {
    if (!isReady || isNaN(id)) return

    // fetch exactly like you do in Dashboard
    fetch(`http://localhost:5000/api/people/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`people/${id} returned ${r.status}`)
        return r.json()
      })
      .then(setSelectedPerson)
      .catch(console.error)

    fetch('http://localhost:5000/api/propertiies')   
      .then((r) => r.json())
      .then(setProperties)
      .catch(console.error)

    fetch('http://localhost:5000/api/person_property')
      .then((r) => r.json())
      .then(setPersonProperties)
      .catch(console.error)
  }, [isReady, id])

  // Loading state exactly as before
  if (!selectedPerson) return <p>Loading…</p>

  return (
    <PersonDetails
      selectedPerson={selectedPerson}
      properties={properties}
      personProperties={personProperties}
      editPersonMode={editPersonMode}
      setSelectedPerson={setSelectedPerson}
      setEditPersonMode={setEditPersonMode}

      // supply fetchers so “Save” buttons re‑reload the right bits
      fetchPeople={() => {}}
      fetchProperties={() =>
        fetch('http://localhost:5000/api/propertiies')
          .then((r) => r.json())
          .then(setProperties)
      }
      fetchPersonProperties={() =>
        fetch('http://localhost:5000/api/person_property')
          .then((r) => r.json())
          .then(setPersonProperties)
      }

      editingPropertyId={editingPropertyId}
      editedProperty={editedProperty}
      setEditedProperty={setEditedProperty}
      setEditingPropertyId={setEditingPropertyId}
    />
  )
}
