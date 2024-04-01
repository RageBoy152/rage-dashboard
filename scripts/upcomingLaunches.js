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



//  UPDATE LAUNCHES FUNCTION
async function updateLaunches() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}launches`)
    }   catch (err) {
        fetchErr = err.toString()
    }
    

    $('#scrolling-list')[0].innerHTML = "<div class='err'><h1>Loading...</h1></div>"
    if (!fetchErr) {
        const data = await dataRaw.json()

        if (data.length>0)
            $('#scrolling-list')[0].innerHTML = ''

        for (let i=0;i<data.length;i++) {
            launchDateAndTimeArr = formatLaunchDateAndTime(data[i].net,data[i].status.abbrev)


            $('#scrolling-list')[0].innerHTML += `
                <div class="launchCard">
                    <div class="row container">
                        <div class="col stats">
                            <div class="row">
                                <h1>${data[i].name}</h1>
                            </div>
                            <div class="row">
                                <i class="bi bi-clock"></i>
                                <h2 class="launch-tMinus" id="${launchDateAndTimeArr[0]}">...</h2>
                            </div>

                            <br>

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
    }   else {
        $('#scrolling-list')[0].innerHTML = `<div class="err"><h1>Launch Error...</h1><br><p>${fetchErr}</p></div>`
    }
}



//  RUNS EVERY HOUR, UPDATES UPCOMING LAUNCHES
window.setInterval(function(){
    updateLaunches()
}, 3600000);
updateLaunches()