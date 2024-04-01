//          STONKS WIDGET JS          \\




//  UPDATE STONKS FUNCTION
async function updateStonks() {
    let dataRaw;
    let fetchErr;
    try {
        dataRaw = await fetch(`${baseAPIURL}stonks`)
    }   catch (err) {
        fetchErr = err.toString()
    }
    
    


    $('#stonks-container')[0].innerHTML = "<h1>Loading...</h1>"
    if (!fetchErr) {
        const data = await dataRaw.json()
        
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
    }   else {
        $('#stonks-container')[0].innerHTML = `<h1>Stonks Error...</h1><br><p>${fetchErr}</p>`
    }
    
}



//  RUNS EVERY 15 MINS, UPDATES STONKS
window.setInterval(function(){
    updateStonks()
}, 900000);
updateStonks()