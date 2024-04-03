const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')

const baseWeatherAPIURL = 'http://api.weatherapi.com/v1/'
const baseCryptoAPIURL = 'http://api.coingecko.com/api/v3/'
const baseLaunchAPIURL = 'https://ll.thespacedevs.com/2.2.0/'
// const baseLaunchAPIURL = 'https://lldev.thespacedevs.com/2.2.0/'
const baseClosuresTFRAPIURL = 'https://starbase.nerdpg.live/api/json/'


const app = express()


//  CORS SETUP
const whitelist = ['http://localhost:5500','https://rageboy152.github.io','http://127.0.0.1:5500', undefined];

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
    data = require('./data/weatherData.json')

    res.json(data)
})


async function getWeatherData() {
    rawForecastData = await fetch(`${baseWeatherAPIURL}forecast.json?key=${process.env.WEATHER_API_KEY}&q=${process.env.LOCATION}`)
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


    fs.writeFile("data/weatherData.json", JSON.stringify(weather), (err) => err && console.error(err));
}

//  RUNS EVERY 15 MINS, UPDATES WEATHER DATA
setInterval(function(){
    getWeatherData()
}, 900000);
getWeatherData()





//    STONKS
app.get('/stonks',async(req,res)=>{
    data = require('./data/stonksData.json')

    res.json(data)
})


async function getStonksData() {
    rawStonksData = await fetch(`${baseCryptoAPIURL}coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=4&page=1&sparkline=false`)
    stonksData = await rawStonksData.json()   


    fs.writeFile("data/stonksData.json", JSON.stringify(stonksData), (err) => err && console.error(err));
}

//  RUNS EVERY 15 MINS, UPDATES STONKS DATA
setInterval(function(){
    getStonksData()
}, 900000);
getStonksData()





//    LAUNCHES
app.get('/launches',async(req,res)=>{
    data = require('./data/launchData.json')

    res.json(data.results)
})


async function getLaunchData() {
    rawLaunchesData = await fetch(`${baseLaunchAPIURL}launch/upcoming/?format=json&limit=5&mode=list&hide_recent_previous=true&ordering=desc`)
    launchesData = await rawLaunchesData.json()


    fs.writeFile("data/launchData.json", JSON.stringify(launchesData), (err) => err && console.error(err));
}

//  RUNS EVERY HOUR, UPDATES UPCOMING LAUNCHES JSON FILE
setInterval(function(){
    getLaunchData()
}, 3600000);
getLaunchData()





//    CLOSURES
app.get('/closures',async(req,res)=>{
    closuresData = require('./data/closures.json')
    roadStatus = require('./data/roadStatus.json')
    tfrData = require('./data/tfrData.json')


    data = [closuresData,roadStatus,tfrData]
    res.json(data)
})


async function getBocaStats() {
    rawClosuresData = await fetch(`${baseClosuresTFRAPIURL}roadClosures`)
    closuresData = await rawClosuresData.json()

    rawStatusData = await fetch(`${baseClosuresTFRAPIURL}current`)
    statusData = await rawStatusData.json()
    roadStatus = statusData.testing.stateOfRoad


    fs.writeFile("data/closures.json", JSON.stringify(closuresData), (err) => err && console.error(err));
    fs.writeFile("data/roadStatus.json", JSON.stringify(roadStatus), (err) => err && console.error(err));
    // fs.writeFile("data/tfrData.json", JSON.stringify(closuresData), (err) => err && console.error(err));
}

//  RUNS EVERY 2 MINS, UPDATES ALL BOCA STATUS DATA
setInterval(function(){
    getBocaStats()
}, 120000
);
getBocaStats()





app.listen(8114,()=>{
    console.log('Server listening at https://rage-dashboard.onrender.com/')
})