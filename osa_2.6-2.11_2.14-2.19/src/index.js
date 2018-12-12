import React from 'react';
import ReactDOM from 'react-dom'
import personService from './services/persons'
import './index.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            filter: '',
            notification: null
        }
    }

    handleNameAdd = (event) => {
        this.setState({ newName: event.target.value })
    }

    handleNumberAdd = (event) => {
        this.setState({ newNumber: event.target.value })
    }

    handleFilter = (event) => {
        this.setState({ filter: event.target.value.toLowerCase() })
    }

    addName = (event) => {
        event.preventDefault()

        const existingPerson = this.state.persons.find(person => person.name === this.state.newName)
        if (existingPerson) {
            const changedPerson = { ...existingPerson, number: this.state.newNumber}            
            const message = changedPerson.name + " on jo luettelossa, korvataanko vanha numero uudella?"
            if (window.confirm(message)) {
                 // Update number              
                personService
                    .update(changedPerson)
                    .then(() => personService.getAll())
                    .then(response => {
                        this.setState({ 
                            persons: response.data ,
                            notification: `päivitettiin ${this.state.newName}`,
                            newName: '',
                            newNumber: ''
                        })
                        setTimeout(() => {
                            this.setState({notification: null})
                          }, 3000)
                    })
                    .catch(error => {
                        console.log(error.message)
                        alert(`henkilön '${changedPerson.name}' tiedot on jo poistettu palvelimelta`)
                        this.setState({ persons: this.state.persons.filter(person => person.id !== changedPerson.id) })
                    })
            }
            return
        }

        // Create new contact
        const newPerson = {
            name: this.state.newName,
            number: this.state.newNumber
        }

        personService
            .create(newPerson)
            .then(response => {
                console.log("Person added: ", response) 
                this.setState({
                    persons: this.state.persons.concat(response.data),
                    notification: `lisättiin ${newPerson.name}`,                    
                    newName: '',
                    newNumber: ''
                })
                setTimeout(() => {
                    this.setState({notification: null})
                }, 3000)
            })
            .catch(error => {
                this.setState({notification: "Tietoja puuttuu, anna sekä nimi että numero"})
                setTimeout(() => {
                    this.setState({notification: null})
                }, 3000)
            })
    }

    deleteName = (person) => {
        return () => {
            const message = "poistetaanko " + person.name + "?"
            if (window.confirm(message)) {
                personService
                    .remove(person.id)
                    .then(() => personService.getAll())
                    .then(response => {
                        this.setState({ 
                            persons: response.data ,
                            notification: `poistettiin ${person.name}`
                        })
                        setTimeout(() => {
                            this.setState({notification: null})
                          }, 3000)
                    })
            }
        }
    }

    componentDidMount() {
        console.log('did mount')
        personService
          .getAll()
          .then(response => {
            console.log('promise fulfilled')
            this.setState({ persons: response.data })
          })
      }

    render() {
        return (
            <div>
                <h2>Puhelinluettelo</h2>
                <Notification message={this.state.notification} />
                <FilterForm filter={this.state.filter} handleFilter={this.handleFilter} />
                <h2>Lisää uusi / muuta olemassaolevaa numeroa</h2>
                <AddPersonForm state={this.state} namehandler={this.handleNameAdd} numberhandler={this.handleNumberAdd} submit={this.addName}/>
                <h2>Numerot</h2>
                <Numbers persons={this.state.persons} filter={this.state.filter} deletehandler={this.deleteName} />
            </div>
        )
    }
}

const Person = ({ person, deletehandler }) => {
    return (
        <tr> 
            <td>{person.name}</td>
            <td>{person.number}</td>
            <td>
                <button onClick={deletehandler}>poista</button>
            </td>
        </tr>
    )
}

const FilterForm = ({ filter, handleFilter }) => {
    return (
        <div>
            rajaa näytettäviä <input value={filter} onChange={handleFilter} />
        </div>
    )
}

const AddPersonForm = ({ state, namehandler, numberhandler, submit }) => {
    return (
        <form onSubmit={submit}>
            <div>
                nimi: <input value={state.newName} onChange={namehandler} />
            </div>
            <div>
                numero: <input value={state.newNumber} onChange={numberhandler} />
            </div>
            <div>
                <button type="submit">lisää</button>
            </div>
        </form>
    )
}

const Numbers = ({ persons, filter, deletehandler }) => {
    return (
        <table>
            <tbody>
                {persons
                    .filter(person => person.name.toLowerCase().includes(filter))
                    .map(person => <Person key={person.name} person={person} deletehandler={deletehandler(person)} />)}
            </tbody>
        </table>
    )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className="notification">
            {message}
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
  )

export default App