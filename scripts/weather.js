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



function initWeather() {
    $('.widget.weather').load('weather.html')
    weatherInit = true
    updateWeather()
}


//  RUNS EVERY 15 MINS, UPDATES WEATHER
async function updateWeather() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}weather`)
    }   catch (err) {
        fetchErr = err.toString()
    }
    


    if (!fetchErr) {
        const data = JSON.parse(await dataRaw.json())


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
    }   else {
        $('.widget.weather')[0].innerHTML = `<h1>Weather Error...</h1><br><p>${fetchErr}</p>`
    }
}


window.setInterval(function(){
    updateWeather()
}, 900000);
initWeather()