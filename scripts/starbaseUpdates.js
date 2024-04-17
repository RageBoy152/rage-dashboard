//          STARBASE UPDATES WIDGET JS          \\





//  calls weather update
async function initUpdateStarbaseUpdate() {
    suFeedUpdate = await refreshUpdates()

    while (suFeedUpdate != "ok") {
        // issue with updating weather, wait 20s then try update again
        await delay(20000)
        suFeedUpdate = refreshUpdates()
    }
}



//  fetch launches data
async function fetchUpdates() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}starbase-updates`)
    }   catch (err) {
        fetchErr = err.toString()
    }

    return [dataRaw,fetchErr]
}



//  UPDATE LAUNCHES
async function refreshUpdates() {
    fetchData = await fetchUpdates()
    updateStatus = "err"
    
    
    if (!fetchData[1]) {
        data = await fetchData[0].json()

        $('#starbase-updates')[0].innerHTML = ''
        for (let i=0;i<data.length;i++) {

            $('#starbase-updates')[0].innerHTML += `
            <div class="update">
                <h3>${data[i].body}</h3>

                <div class="col">
                    <div class="row">
                        <i class="bi bi-clock"></i>
                        <p>${data[i].userTimestamp.replace('T',' | ')} (CT)</p>
                    </div>
                    <div class="row">
                        <i class="bi bi-rocket-takeoff"></i>
                        <p>${data[i].vehicle}</p>
                    </div>
                    <div class="row">
                        <i class="bi bi-geo-alt"></i>
                        <p>${data[i].location}</p>
                    </div>
                    <div class="row">
                        <i class="bi bi-person"></i>
                        <p>@${data[i].userName}</p>
                    </div>
                </div>
            </div>
            `
        }
        updateStatus = "ok"
    }   else {
        $('#starbase-updates')[0].innerHTML = `<div class="err"><h1>Launch Error...</h1><br><p>${fetchData[1]}</p></div>`
    }

    return updateStatus
}



//  RUNS EVERY MIN, UPDATES STARBASE UPDATES FEED
window.setInterval(function(){
    initUpdateStarbaseUpdate()
}, 60000);
initUpdateStarbaseUpdate()
