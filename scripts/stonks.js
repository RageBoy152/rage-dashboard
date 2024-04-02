//          STONKS WIDGET JS          \\




async function fetchStonks() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}stonks`)
    }   catch (err) {
        fetchErr = err.toString()
    }

    return [dataRaw,fetchErr]
}



//  calls stonks update
async function initUpdateStonks() {
    stonksUpdate = await updateStonks()

    if (stonksUpdate!="rate") {
        while (stonksUpdate!="ok") {
            // issue with updating stonks, wait 20s then try update again if the issue isn't rate limit
            await delay(20000);
            stonksUpdate = updateStonks()
        }
    }
}



//  UPDATE STONKS FUNCTION
async function updateStonks() {
    fetchData = await fetchStonks()
    updateStatus = "err"
    const data = await fetchData[0].json()

    // check if rate limited
    if (data.status) {if (data.status.error_code==429) {fetchData[1] = "Rate limit exceeded"}}


    $('#stonks-container')[0].innerHTML = "<h1>Loading...</h1>"
    if (!fetchData[1]) {

        $('#stonks-container')[0].innerHTML = ""
        for (let i=0;i<data.length;i++) {
            changeColor = 'red'
            changePositive = ""
            if (data[i].price_change_percentage_24h.toString()[0]!="-") {
                changeColor = 'green'
                changePositive = "+"
            }
    
            $('#stonks-container')[0].innerHTML += `
                <div class="col exchange">
                    <div class="row">
                        <h2>${data[i].symbol.toUpperCase()}</h2>
                        <p class="text-${changeColor}">${changePositive}${Math.round(data[i].price_change_percentage_24h * 100) / 100}%</p>
                    </div>
                    <p>£${data[i].ath.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
            `
        }
        updateStatus = "ok"
    }   else {
        if (fetchData[1] == "Rate limit exceeded") {
            $('#stonks-container')[0].innerHTML = `<h1>Stonks Error...</h1><br><p>${fetchData[1]}</p>`
            updateStatus = "rate"
        }   else {
            $('#stonks-container')[0].innerHTML = `<h1>Stonks Error...</h1><br><p>${fetchData[1]}</p>`
        }
        
    }
    return updateStatus
}



//  RUNS EVERY 15 MINS, UPDATES STONKS
window.setInterval(function(){
    initUpdateStonks()
}, 900000);
initUpdateStonks()