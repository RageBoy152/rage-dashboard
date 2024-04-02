// const baseAPIURL = 'http://localhost:8114/'
const baseAPIURL = 'https://rage-dashboard.onrender.com/'

// const midScrollSpeed = 40


//  delay function
const delay = ms => new Promise(res => setTimeout(res, ms));



//   DISABLED AUTOSCROLL IT SUCKS LOL




//  RUNS EACH .4s, HANDLES AUTO SCROLL BEHAVIOUR  \\

// init scroll vars
// runningScrollCount = 0
// runningPausedCount = 0
// paused = false

// //  TOGGLE SCROLL ANIM AND CALC ANIM PERCENT
// var showPercent = window.setInterval(function() {

//     // conditionals to update scroll state
//     if (runningScrollCount>=120000 && getComputedStyle($('#scrolling-list')[0]).getPropertyValue('opacity')==1 && !paused) {
//         // pause anim
//         $('#scrolling-list')[0].classList.add('paused')
//         paused = true
//         runningPausedCount = 0
//     }   
//     else if (runningPausedCount>=120000 && paused) {
//         // unpause anim
//         $('#scrolling-list')[0].classList.remove('paused')
//         paused = false
//         runningScrollCount = 0
//     }



//     // inc appropriate counters
//     if (paused) {runningPausedCount+=400}
//     else {
//         runningScrollCount+=400
//     }
// }, 400);




// function setScrollSpeed(speed,elem) {
//     controllerElements = $('.upcominglaunches-speed-icons a')
//     for (let i=0;i<controllerElements.length;i++) {controllerElements[i].classList.remove('active')}

//     elem.classList.add('active')
//     $('.upcomingLaunches')[0].style.animation = `marquee ${midScrollSpeed*speed}s ease-in-out infinite`
// }