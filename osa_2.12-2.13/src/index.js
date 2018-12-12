import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countries: [],
            currentSearch: '',
            selectedCountry: ''
        }
    }

    handleSearch = (event) => {
        this.setState({currentSearch: event.target.value, selectedCountry: ''})
    }

    handleCountryClick = (event) => {
        let selectedCountry = this.state.countries.find(country => country.name === event.target.textContent)
        this.setState({ selectedCountry})
    }

    componentDidMount() {
        console.log('did mount')
        axios
          .get('https://restcountries.eu/rest/v2/all')
          .then(response => {
            console.log('promise fulfilled')
            this.setState({ countries: response.data })
          })
      }

    render() {
        return (
            <div>
                <div>
                    find countries: <input value={this.state.currentSearch} onChange={this.handleSearch} />
                </div>
                <Countries countries={this.state.countries} filter={this.state.currentSearch} selectedCountry={this.state.selectedCountry} clickHandler={this.handleCountryClick} />
            </div>
        )
    }
}

const Countries = ({ countries, filter, selectedCountry, clickHandler }) => {
    if (selectedCountry) {
        return <Country country={selectedCountry} />
    }

    const matchingCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
    if (matchingCountries.length > 10) {
        return <div> too many matches, specify another filter </div>
    } else if (matchingCountries.length > 1) {
        return matchingCountries.map(country => <div key={country.name} onClick={clickHandler}>{country.name}</div>)
    } else if (matchingCountries.length === 1) {
        return <Country country={matchingCountries[0]} />       
    } else {
        return null
    }
}

const Country = ({ country }) => {
    return (
        <div>
            <h2>{country.name} {country.nativeName}</h2>
            <div>capital: {country.capital}</div> 
            <br />
            <div>population: {country.population}</div>
            <br />
            <img src={country.flag} alt={"country flag"} style={{width: 320, height: 160}} />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)

export default App