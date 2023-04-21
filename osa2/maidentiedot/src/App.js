import { useState, useEffect } from 'react'
import dataTransfer from './services/DataTransfer'


const DisplayedList = ({ countries, handleClick }) => {
  //console.log("countries", countries)

  if (countries.length === 1) {
    return null
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify your search</p>
  }

  const listToShow = countries.map(country => {
    return <p key={country}>- {country} <button onClick={() => handleClick(country)}>show</button></p>
  })
  console.log("listToShow", listToShow)

  return listToShow
}

const DisplayCountry = ({ name, capital, area, languages, flag, temperature, icon, wind }) => {
  if (name === '') {
    //console.log("not displaying single country")
    return null
  }
  //console.log("displaying country", name)

  const list = Object.values(languages).map(language => <li key={language}>{language}</li>)
  const tempCelsius = (temperature - 273.15).toFixed(1)
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div>
      <h1>{name}</h1>
      <p>Capital: {capital} <br></br>
        Area: {area} m^2</p>
      <h3>Languages:</h3>
      <ul>
        {list}
      </ul>
      <p><img src={flag} /></p>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {tempCelsius} C</p>
      <p><img src={iconUrl} /></p>
      <p>Wind: {wind} m/s</p>
    </div>
  )
}


function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryObject, setCountryObject] = useState({
    name: '',
    capital: '',
    area: '',
    languages: [],
    flag: ''
  })
  const [weatherData, setWeatherData] = useState([])
  const [latLon, setLatLon] = useState([0, 0])


  useEffect(() => {
    dataTransfer
      .getAllCountries()
      .then(data => {
        setCountries(data)
      })
  }, [])

  useEffect(() => {
    dataTransfer
      .getWeather(latLon[0], latLon[1])
      .then(data => {
        setWeatherData(data)
      })
  }, [countryObject])


  const handleChange = (event) => {
    const filterTerm = event.target.value
    console.log(filterTerm)
    setSearchTerm(filterTerm)

    const filteredList = countries.filter(country =>
      country.name.common.toLowerCase().includes(filterTerm))
    setFilteredCountries(filteredList)
    console.log("filteredList", filteredList)

    if (filteredList.length === 1) {
      setLatLon([filteredList[0].capitalInfo.latlng[0], filteredList[0].capitalInfo.latlng[1]])
      console.log("setCountryObject", filteredList[0].name.common)
      setCountryObject({
        name: filteredList[0].name.common,
        capital: filteredList[0].capital,
        area: filteredList[0].area,
        languages: filteredList[0].languages,
        flag: filteredList[0].flags.png
      })
      //console.log("setLatLon", filteredList[0].capitalInfo.latlng[0], filteredList[0].capitalInfo.latlng[1])
    }
    else {
      console.log("setCountryObject empty")
      setCountryObject({
        name: '',
        capital: '',
        area: 0,
        languages: [],
        flag: ''
      })
    }
  }

  const handleClick = (countryName) => {
    //console.log("handleClick countryName", countryName)

    const country = filteredCountries.filter(country =>
      country.name.common === countryName
    )
    //console.log("handleClick country", country)

    if (country[0]) {
      setLatLon([country[0].capitalInfo.latlng[0], country[0].capitalInfo.latlng[1]])
      setCountryObject({
        name: country[0].name.common,
        capital: country[0].capital,
        area: country[0].area,
        languages: country[0].languages,
        flag: country[0].flags.png
      })
      setFilteredCountries([])
    }
    else {
      console.log("error: no country set")
    }
  }

  if (countries.length === 0) {
    console.log("country data not yet fetched")
    return null
  }

  console.log("countryObject", countryObject)

  return (
    <div>
      <p>Find countries: <input value={searchTerm} onChange={handleChange} /> </p>
      <DisplayedList countries={filteredCountries.map(country => country.name.common)}
        handleClick={handleClick} />
      <DisplayCountry name={countryObject.name} capital={countryObject.capital}
        area={countryObject.area} languages={countryObject.languages} flag={countryObject.flag}
        lat={countryObject.lat} lon={countryObject.lon} temperature={weatherData.main.temp}
        icon={weatherData.weather[0].icon} wind={weatherData.wind.speed} />
    </div>
  )
}


export default App