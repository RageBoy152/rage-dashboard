const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')

const baseWeatherAPIURL = 'http://api.weatherapi.com/v1/'
const baseCryptoAPIURL = 'http://api.coingecko.com/api/v3/'
const baseLaunchAPIURL = 'https://ll.thespacedevs.com/2.2.0/'
// const baseLaunchAPIURL = 'https://lldev.thespacedevs.com/2.2.0/'
const baseClosuresTFRAPIURL = 'https://starbase.nerdpg.live/api/json/'


launchesRate = 15


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


    fs.writeFile("./data/weatherData.json", JSON.stringify(weather), (err) => err && console.error(err));
}





//    LAUNCHES
app.get('/launches',async(req,res)=>{
    data = require('./data/launchData.json')

    if (data.details) {launchesRate = 21}
    else {launchesRate = 15}


    res.json(data.results)
})


async function getLaunchData() {
    rawLaunchesData = await fetch(`${baseLaunchAPIURL}launch/upcoming/?format=json&limit=5&mode=list&hide_recent_previous=true&ordering=desc`)
    launchesData = await rawLaunchesData.json()


    fs.writeFile("./data/launchData.json", JSON.stringify(launchesData), (err) => err && console.error(err));
}





//    CLOSURES
app.get('/closures',async(req,res)=>{
    closuresData = require('./data/closures.json')
    roadStatus = require('./data/roadStatus.json')
    tfrData = require('./data/tfrData.json')

    console.log("client fetching closures, roadStatus and TFR data.")

    data = [closuresData,roadStatus,tfrData]
    res.json(data)
})


async function getBocaStats() {
    rawClosuresData = await fetch(`${baseClosuresTFRAPIURL}roadClosures`)
    closuresData = await rawClosuresData.json()

    rawStatusData = await fetch(`${baseClosuresTFRAPIURL}current`)
    statusData = await rawStatusData.json()
    roadStatus = statusData.testing.stateOfRoad

    console.log("updating closure.json and roadStatus.json")
    console.log(closuresData)

    fs.writeFile("./data/closures.json", JSON.stringify(closuresData), (err) => err && console.error(err));
    fs.writeFile("./data/roadStatus.json", JSON.stringify(roadStatus), (err) => err && console.error(err));
    // fs.writeFile("data/tfrData.json", JSON.stringify(closuresData), (err) => err && console.error(err));
}





tTotal = 0
//  RUNS EVERY MIN, HANDLES MAIN LOOP FUNC
setInterval(function(){
    tTotal += 1

    if (tTotal%2 == 0) {
        // every 2 mins
        getBocaStats()
    }   else if (tTotal%15 == 0) {
        // every 15 mins
        getWeatherData()
    }   else if (tTotal%60 == 0) {
        // every hour
    }   else if (tTotal%launchesRate == 0) {
        // every whatever the rate for launches is - prevents rate limit blocks
        getLaunchData()
    }
}, 60000);


//  INIT DATA
getBocaStats()
getLaunchData()
getWeatherData()



app.listen(8114,()=>{
    console.log('Server listening at https://rage-dashboard.onrender.com/')
})
