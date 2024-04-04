//          WEATHER WIDGET JS          \\




weatherInit = false



//  CONVERTS 12 HOUR TIME TO 24 HOUR TIME
function time12Hourto24Hour(time12hour) {
    time = time12hour.split(" ")[0]
    half = time12hour.split(" ")[1]

    hh = parseInt(time.split(":")[0])
    mm = parseInt(time.split(":")[1])

    if (half=="PM") {hh = hh+12}

    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`
}



//  calls weather update
async function initUpdateWeather() {
    weatherUpdate = await updateWeather()

    while (weatherUpdate!="ok") {
        // issue with updating weather, wait 20s then try update again
        await delay(20000)
        weatherUpdate = updateWeather()
    }
}



function initWeather() {
    $('.widget.weather').load('weather.html')
    weatherInit = true
    initUpdateWeather()
}



async function fetchWeather() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}weather`)
    }   catch (err) {
        fetchErr = err.toString()
    }

    return [dataRaw,fetchErr]
}



//  RUNS EVERY 15 MINS, UPDATES WEATHER
async function updateWeather() {
    fetchData = await fetchWeather()
    updateStatus = "err"

    if (!fetchData[1]) {
        const data = await fetchData[0].json()

        // $('.widget.weather').load('./weather.html')
        $('#current-temp')[0].innerText = `${data.temp}°c`
        $('#humidity')[0].innerText = `${data.humidity}%`
        $('#wind')[0].innerText = `${data.wind}mph`
        $('#sunset')[0].innerText = `${time12Hourto24Hour(data.sunset)}`
        $('#sunrise')[0].innerText = `${time12Hourto24Hour(data.sunrise)}`
        $('#currentIcon')[0].src = `http:${data.currentIcon}`

        
        $('#7hr-forecast-container')[0].innerHTML = ""
        for (let i=0;i<data.hourlyForecast.length;i++) {
            $('#7hr-forecast-container')[0].innerHTML += `
                <div class="col">
                    <p class="time">${data.hourlyForecast[i].time.split(" ")[1]}</p>
                    <img src="https:${data.hourlyForecast[i].condition.icon}">
                    <p>${data.hourlyForecast[i].temp_c}°c</p>
                </div>
            `
        }
        updateStatus = "ok"
    }   else {
        $('.widget.weather')[0].innerHTML = `<h1>Weather Error...</h1><br><p>${fetchData[1]}</p>`
    }
    return updateStatus
}


window.setInterval(async function(){
    initUpdateWeather()
}, 900000);
initWeather()