import axios from 'axios'


const countriesBaseUrl = 'https://restcountries.com/v3.1'
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = process.env.REACT_APP_API_KEY

const getAllCountries = () => {
    const request = axios.get(`${countriesBaseUrl}/all`)
    return request.then(response => response.data)
}

const getWeather = (lat, lon) => {
    const request = axios.get(`${weatherBaseUrl}/?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    return request.then(response => response.data)
}


export default {
    getAllCountries, getWeather
}