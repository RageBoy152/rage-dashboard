//  GET STREAM LINKS ARRAY
streamLinks = []
async function getStreamLinks() {
    links = await (await fetch('streamLinks.json')).json()
    links.forEach(link => {
        streamLinks.push(link)
    })
}
getStreamLinks()



//  INITIALIZE DROPDOWNS
$(document).ready(()=>{
    dropDownElems = $('.dropdown')
    dropDownElems.load('multiview-dropdown-contents.html')
}
)



//  LOAD STREAM FROM TEXT
async function loadStream(linkText, linkElem, manual) {
    videoId = ''
    if (!manual) {
        //  get desired stream video id
        for (let i=0;i<streamLinks.length;i++) {
            if (streamLinks[i].text==linkText) {videoId = streamLinks[i].videoId;break}
        }
    }   else {
        inputText = manual.value
        if (inputText == '' || !inputText.includes('youtube.com/watch?v=')) {
            // invalid input
            manual.classList.add('invalid')
            await delay(2000)
            manual.classList.remove('invalid')
            return
        }   else {
            url = new URL(inputText)
            videoId = url.searchParams.get("v")
        }
    }

    //  change iframe src
    iframe = linkElem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('iframe')
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&autoplay=0&controls=1&rel=0`
    

    //  hide stream ops
    expandStreamOps(linkElem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('i'))
}



//  HANDLES TOGGLING STREAM OPS PANEL
function expandStreamOps(streamOpsTogglerElem) {
    streamOpsPanel = streamOpsTogglerElem.parentNode.lastChild
    streamContainer = streamOpsTogglerElem.parentNode.parentNode
    if (streamOpsPanel.classList.contains('expanded')) {
        streamOpsPanel.classList.remove('expanded')
        streamContainer.classList.remove('expanded')
    }   else {
        streamOpsPanel.classList.add('expanded')
        streamContainer.classList.add('expanded')
    }
}