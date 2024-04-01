const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')

const baseWeatherAPIURL = 'http://api.weatherapi.com/v1/'
const baseCryptoAPIURL = 'http://api.coingecko.com/api/v3/'
const baseLaunchAPIURL = 'https://lldev.thespacedevs.com/2.2.0/'


const app = express()


//  CORS SETUP
const whitelist = ['http://localhost:5500','https://rageboy152.github.io/rage-dashboard','http://127.0.0.1:5500','https://rageboy152.github.io/rage-dashboard/'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS. SRC: ${origin}`))
    }
  }
}
app.use(cors(corsOptions))






//    WEATHER
app.get('/weather',async(req,res)=>{
    rawForecastData = await fetch(`${baseWeatherAPIURL}forecast.json?key=${process.env.WEATHER_API_KEY}&q=airdrie`)
    forecastData = await rawForecastData.json()
    
    hourlyForecast = forecastData.forecast.forecastday[0].hour
    date = new Date()
    currentHour = date.getHours()
    
    
    
    weather = {
        "humidity": forecastData.current.humidity,
        "wind": forecastData.current.wind_mph,
        "temp": forecastData.current.temp_c,
        "currentIcon": forecastData.current.condition.icon,
        "hourlyForecast": hourlyForecast.slice(currentHour+1, currentHour+8),
        "sunrise": forecastData.forecast.forecastday[0].astro.sunrise,
        "sunset": forecastData.forecast.forecastday[0].astro.sunset,
        "conditionText": forecastData.current.condition.text,
        "isDay": forecastData.current.is_day
    }
    res.json(JSON.stringify(weather))
})



//    STONKS
app.get('/stonks',async(req,res)=>{
    rawStonksData = await fetch(`${baseCryptoAPIURL}coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=4&page=1&sparkline=false`)
    stonksData = await rawStonksData.json()    

    res.json(stonksData)
})



//    LAUNCHES
app.get('/launches',async(req,res)=>{
    rawLaunchesData = await fetch(`${baseLaunchAPIURL}launch/upcoming/?format=json&limit=5&mode=list&hide_recent_previous=true&ordering=desc`)
    launchesData = await rawLaunchesData.json()

    res.json(launchesData.results)
})




app.listen(8114,()=>{
    console.log('Server listening at https://rage-dashboard.onrender.com/')
})
