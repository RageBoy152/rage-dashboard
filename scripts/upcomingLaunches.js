//          UPCOMING LAUNCHES WIDGET JS          \\




//  FORMATS DATE AND TIME STRINGS FOR LAUNCH CARDS
function formatLaunchDateAndTime(net, netAbbrev) {
    rawTime = net.split("T")[1].split("Z")[0]
    rawDate = net.split("T")[0].split("-")
    ddL = rawDate[2]
    mm = rawDate[1]
    yyyy = rawDate[0]

    dayDate = new Date(net.split("T")[0])
    d = dayDate.getDay()
    d = dayNumToText(d)
    d = d.slice(0,3)

    rawTime = rawTime.split(':')
    fullTime = `${yyyy}-${mm}-${ddL}T${rawTime[0]}:${rawTime[1]}:${rawTime[2]}Z`

    timeClean = `${rawTime[0]}:${rawTime[1]}:${rawTime[2]}`
    if (netAbbrev == "TBD" || netAbbrev == "M") {timeClean = `T-0 TBD`}

    dateAndTime = `${ddL}/${mm}/${yyyy} | ${timeClean}`

    return [fullTime,dateAndTime]
}



//  calls weather update
async function initUpdateLaunches() {
    launchUpdate = await updateLaunches()

    while (launchUpdate!="ok") {
        // issue with updating weather, wait 20s then try update again
        await delay(20000)
        launchUpdate = updateLaunches()
    }
}



//  fetch launches data
async function fetchLaunches() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}launches`)
    }   catch (err) {
        fetchErr = err.toString()
    }

    return [dataRaw,fetchErr]
}



//  UPDATE LAUNCHES
async function updateLaunches() {
    fetchData = await fetchLaunches()
    updateStatus = "err"
    

    $('#scrolling-list')[0].innerHTML = "<div class='err'><h1>Loading...</h1></div>"
    if (!fetchData[1]) {
        const data = await fetchData[0].json()

        if (data.length>0)
            $('#scrolling-list')[0].innerHTML = ''

        for (let i=0;i<data.length;i++) {
            launchDateAndTimeArr = formatLaunchDateAndTime(data[i].net,data[i].status.abbrev)


            $('#scrolling-list')[0].innerHTML += `
                <div class="launchCard">
                    <div class="container">
                        <div class="col stats">
                            <div class="row">
                                <h1>${data[i].name}</h1>
                            </div>
                            <div class="row">
                                <i class="bi bi-clock"></i>
                                <h2 class="launch-tMinus" id="${launchDateAndTimeArr[0]}">...</h2>
                            </div>

                            <div class="space"></div>

                            <div class="row">
                                <i class="bi bi-calendar3"></i>
                                <p>${launchDateAndTimeArr[1]}</p>
                            </div>
                            <div class="row">
                                <i class="bi bi-geo-alt"></i>
                                <p>${data[i].pad}</p>
                            </div>
                            <div class="row">
                                <i class="bi bi-globe"></i>
                                <p>${data[i].location}</p>
                            </div>
                            <div class="row">
                                <i class="bi bi-briefcase"></i>
                                <p>${data[i].lsp_name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        updateStatus = "ok"
    }   else {
        $('#scrolling-list')[0].innerHTML = `<div class="err"><h1>Launch Error...</h1><br><p>${fetchData[1]}</p></div>`
    }

    return updateStatus
}



//  RUNS EVERY HOUR, UPDATES UPCOMING LAUNCHES
window.setInterval(function(){
    initUpdateLaunches()
}, 3600000);
initUpdateLaunches()