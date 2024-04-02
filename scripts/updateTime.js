//          TIME HANDLING JS          \\




//  INIT TIME VARS FOR GLOBAL USE
hour = 0
mins = 0
secs = 0
dd = 0



//  CONVERTS 24HOUR TIME BETWEEN TIMEZONES
function adjustHour(hour, offset) {
    hourAdjusted = hour+offset
    if (hourAdjusted<0) {hourAdjusted=24+hourAdjusted}
    if (hourAdjusted==24) {hourAdjusted=0}
    return hourAdjusted.toString().padStart(2, '0')
}



//  CALCULATES LOCAL OFFSET FROM UTC
function setLocalOffset() {
    date = new Date()
    offsetMinutes = date.getTimezoneOffset()

    sign = (offsetMinutes < 0) ? '+' : '-'
    offsetHours = Math.abs(Math.floor(offsetMinutes / 60))

    $('#local-utc-offset')[0].innerText = `UTC${sign}${offsetHours}`
}
setLocalOffset()



//  CONVERTS A NUMBER OF DAY TO TEXT
function dayNumToText(num) {
    num = parseInt(num)
    switch (num) {
        case 0:
            return "sunday"
        case 1:
            return "monday"
        case 2:
            return "tuesday"
        case 3:
            return "wednesday"
        case 4:
            return "thursday"
        case 5:
            return "friday"
        case 6:
            return "saturday"
    }
}



//  CALCS T-DAYS:HOURS:MINS:SECS FROM TIMEDIFF GIVEN IN MS
function getTMinus(timeDiff) {
    let timeDiffInSeconds = Math.floor(timeDiff / 1000)

    let days = Math.floor(timeDiffInSeconds / (24 * 3600))
    let remainingSeconds = timeDiffInSeconds % (24 * 3600)

    let hours = Math.floor(remainingSeconds / 3600)
    remainingSeconds %= 3600

    let minutes = Math.floor(remainingSeconds / 60)

    let seconds = remainingSeconds % 60;

    return [days.toString().padStart(2, '0'),hours.toString().padStart(2, '0'),minutes.toString().padStart(2, '0'),seconds.toString().padStart(2, '0')]
}



//  RUNS EACH SECOND, UPDATES CLOCKS  \\

window.setInterval(function(){
    // update time
    date = new Date()

    hour = date.getUTCHours()
    mins = date.getUTCMinutes().toString().padStart(2, '0')
    secs = date.getUTCSeconds().toString().padStart(2, '0')

    dd = date.getDate().toString().padStart(2, '0')
    mm = (date.getMonth()+1).toString().padStart(2, '0')
    yy = date.getFullYear().toString().padStart(2, '0')
    day = date.getDay().toString().padStart(2, '0')
    

    
    $('#date')[0].innerHTML = `${dd} / ${mm} / ${yy}`
    $('#day-text')[0].innerHTML = `${dayNumToText(day)}`



    //  update world clocks
    timezones = $('.timezone')

    for (let i=0;i<timezones.length;i++) {
        hrOffset = hour
        tzOffset = timezones[i].id.split('_')[1]
        
        // offset hour if offset isn't "l" (local). if its local use getHours() for local time
        if (tzOffset == 'l') {hrOffset=date.getHours()}
        else {hrOffset = adjustHour(hour, parseInt(tzOffset))}
        
        timezones[i].innerHTML = `${hrOffset.toString().padStart(2, '0')} <span>:</span> ${mins} <span>:</span> ${secs}`
    }



    //  update t-0 on upcoming launches
    times = $('.launch-tMinus')
    for (let i=0;i<times.length;i++) {
        timeDiff = new Date(times[i].id).getTime()-date

        tMinus = getTMinus(timeDiff)


        if (tMinus[0] == '00') {
            // launching today, countdown hh,min,sec
            times[i].innerText = `${tMinus[1]}:${tMinus[2]}:${tMinus[3]}`
        }   else if (tMinus[0] == '01') {
            // launching in the next 48hrs, countdown days and hours
            times[i].innerText = `${parseInt(tMinus[0])}d ${parseInt(tMinus[1])}h`
        }   else if (timeDiff<0) {
            // launch already happened
            times[i].innerText = `${tMinus[2]*-1}mins ago.`
        }   else {
            // launching in over 48hrs, countdown days
            times[i].innerText = `${parseInt(tMinus[0])} days`
        }
    }




}, 1000);