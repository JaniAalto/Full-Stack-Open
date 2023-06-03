import { useState, useEffect } from 'react'
import dataTransfer from './services/DataTransfer'


const Filter = ({ filter, handleFilterChange, setFilter }) => {
  return <p>Filter: <input value={filter} onChange={handleFilterChange} />
    <button onClick={() => setFilter("")}>x</button></p>
}

const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>Name: <input value={newName} onChange={handleNameChange} /></div>
      <div>Number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div><button type="submit">Add</button> </div>
    </form>
  )
}

const DisplayedList = ({ names, numbers, ids, filterString, removeNumber }) => {
  //console.log("names, numbers, ids", names, numbers, ids)

  let index = 0
  const objectList = names.map(person => {
    const nameObject = {
      name: person,
      number: numbers[index],
      id: ids[index]
    }
    //console.log("added", nameObject)
    index++
    return nameObject
  })
  //console.log("objectList", objectList)

  const filteredList = objectList.filter(person => person.name.toLowerCase().startsWith(filterString))
  //console.log("filteredList", filteredList)

  const listToShow = filteredList.map(person => {
    return (<p key={person.id}>{person.name} {person.number}
      <button onClick={() => removeNumber(person.name, person.id)}>delete</button></p>)
  })
  //console.log("listToShow", listToShow)

  return listToShow
}

const Notification = ({ message, error }) => {
  const messageStyle = {
    color: 'green',
    fontStyle: 'bold',
    background: 'lightgrey',
    fontSize: 20,
    borderColor: 'green',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {
    color: 'red',
    fontStyle: 'bold',
    background: 'lightgrey',
    fontSize: 20,
    borderColor: 'red',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  if (error) {
    return (
      <div className="error" style={errorStyle}>
        {message}
      </div>
    )
  }
  return (
    <div className="message" style={messageStyle}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [messageText, setMessageText] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    dataTransfer
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])
  //console.log('persons', persons)


  const addName = (event) => {
    event.preventDefault()

    const foundPerson = persons.find(person => person.name === newName)

    if (foundPerson) {
      //console.log("found name", foundPerson.name)
      if (window.confirm(`${foundPerson.name} is already in the phonebook. Replace old number with new one?`)) {
        const changedObject = { ...foundPerson, number: newNumber }

        dataTransfer
          .update(foundPerson.id, changedObject)
          .then(response => {
            if (response) {
              console.log("response", response)
              setPersons(persons.map(person => person.id !== foundPerson.id ? person : response))
              setNewName('')
              setNewNumber('')
              setIsError(false)
              setMessageText(`Updated the number of ${foundPerson.name}`)
              setTimeout(() => {
                setMessageText(null)
              }, 5000)
            }
            else {
              setIsError(true)
              setMessageText(`${foundPerson.name} has already been deleted from the server`)
              setTimeout(() => {
                setMessageText(null)
              }, 5000)
            }
          })
          .catch(response => {
            setIsError(true)
            setMessageText(`${response.response.data.error}`)
            setTimeout(() => {
              setMessageText(null)
            }, 5000)
          })
      }
    }
    else {  // if name was not already in the phonebook
      const nameObject = {
        name: newName,
        number: newNumber
      }
      //console.log("creating", nameObject)

      dataTransfer
        .create(nameObject)
        .then(returnedName => {
          setPersons(persons.concat(returnedName))
          //console.log("added", returnedName)
          setNewName('')
          setNewNumber('')
          setIsError(false)
          setMessageText(`Added ${returnedName.name}`)
          setTimeout(() => {
            setMessageText(null)
          }, 5000)
        })
        .catch(response => {
          setIsError(true)
          setMessageText(`${response.response.data.error}`)
          setTimeout(() => {
            setMessageText(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setFilter(event.target.value)
  }

  const removeNumber = (name, id) => {
    //console.log(`trying to delete ${id}`)
    if (window.confirm(`Delete ${name}?`)) {
      dataTransfer
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setIsError(false)
          setMessageText(`Deleted ${name}`)
          setTimeout(() => {
            setMessageText(null)
          }, 5000)
        })
      console.log(`deleted ${id}`)
    }
  }


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={messageText} error={isError} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} setFilter={setFilter} />

      <h2>Add new</h2>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <DisplayedList names={persons.map(person => person.name)} numbers={persons.map(person => person.number)}
        ids={persons.map(person => person.id)} filterString={filter} removeNumber={removeNumber} />
    </div>
  )
}


export default App