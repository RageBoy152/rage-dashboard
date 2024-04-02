//          CLOSURES WIDGET JS          \\




async function fetchClosures() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}closures`)
    }   catch (err) {
        fetchErr = err.toString()
    }

    return [dataRaw,fetchErr]
}



//  calls closures update
async function initUpdateClosures() {
    closuresUpdate = await updateClosures()

    while (closuresUpdate!="ok") {
        // issue with updating closures, wait 20s then try update again if the issue isn't rate limit
        await delay(20000);
        closuresUpdate = updateClosures()
    }
}



//  UPDATE closures FUNCTION
async function updateClosures() {
    fetchData = await fetchClosures()
    updateStatus = "err"
    data = await fetchData[0].json()
    closureData = data[0]
    roadStatus = data[1]
    tfrData = data[2]


    console.log(data)



    $('#closures-container')[0].innerHTML = "<h1>Loading...</h1>"
    if (!fetchData[1]) {

        // road status
        roadStatusFormat = ["Unkown","Road Status Unkown"]
        if (roadStatus=='CLOSED') {roadStatusFormat = ["Red","Road Closed"]}
        else if (roadStatus=='OPEN') {roadStatusFormat = ["Green","Road Open"]}
        $('#closures-container')[0].innerHTML = `<div class="status status${roadStatusFormat[0]}"><h1>${roadStatusFormat[1]}</h1></div>`



        // add closures
        for (let i=0;i<closureData.length;i++) {
            $('#closures-container')[0].innerHTML += `
            <div class="col data">
                <div class="row"><i class="bigI bi bi-calendar3"></i> <h2>${closureData[i].date}</h2></div>
                <div class="row"><i class="bigI bi bi-clock"></i> <h2>${closureData[i].time}</h2></div>
                <div class="hr"></div>
                <div class="row"><i class="bi bi-tag"></i> <p>${closureData[i].type}</p></div>
                <div class="row"><i class="bi bi-info-square"></i> <p>${closureData[i].status}</p></div>
            </div>
            `
        }


        // add tfrs
        $('#tfr-container')[0].innerHTML = `<div class="status"><h1>TFRs</h1></div>`
        for (let i=0;i<tfrData.length;i++) {
            $('#tfr-container')[0].innerHTML += `
            <div class="col data">
                <div class="row"><i class="bigI bi bi-layers"></i> <h2>${tfrData[i].lowerAltitude} - ${tfrData[i].upperAltitude} ${tfrData[i].units}</h2></div>
                <div class="hr"></div>
                <div class="row"><i class="bi bi-calendar3"></i> <p>${tfrData[i].dateStart} - ${tfrData[i].dateEnd}</p></div>
                <div class="row"><i class="bi bi-info-square"></i> <a target="_blank" href="${tfrData[i].link}">More Info</a></div>
            </div>
            `
        }


        // no listings text
        if (!(closureData.length > 0)) {
            $('#closures-container')[0].innerHTML += `<div class="noData"><h1>No closures.</h1></div>`
        }
        if (!(tfrData.length > 0)) {
            $('#tfr-container')[0].innerHTML += `<div class="noData"><h1>No TFRs.</h1></div>`
        }

        updateStatus = "ok"
    }   else {
        if (fetchData[1]) {
            $('#closures-container')[0].innerHTML = `<h1>Closures Error...</h1><br><p>${fetchData[1]}</p>`
        }
    }
    return updateStatus
}



//  RUNS EVERY 2 MINS, UPDATES CLOSURES
window.setInterval(function(){
    initUpdateClosures()
}, 120000);
initUpdateClosures()