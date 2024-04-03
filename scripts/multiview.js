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
    feed = linkElem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('iframe.feed')
    chat = linkElem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('iframe.chat')
    feed.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&autoplay=0&controls=1&rel=0`
    chat.src = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=rageboy152.github.io`
    

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
        streamOpsTogglerElem.classList.remove('active')
    }   else {
        streamOpsPanel.classList.add('expanded')
        streamContainer.classList.add('expanded')
        streamOpsTogglerElem.classList.add('active')
    }
}



//  HANDLES TOGGLING CHAT ON FEED
function toggleChat(togglerElem) {
    feed = togglerElem.parentNode.querySelector('iframe.feed')
    chat = togglerElem.parentNode.querySelector('iframe.chat')


    if (togglerElem.classList.contains('active')) {
        togglerElem.classList.remove('active')
        feed.classList.add('active')
        chat.classList.remove('active')
    }   else {
        togglerElem.classList.add('active')
        feed.classList.remove('active')
        chat.classList.add('active')
    }
}



//  COPIES CREDIT TEXT FOR THE FEED TO USERS CLIPBOARD
async function copyCredit(copyBtnElem) {
    copyBtnElem.classList.add('active')
    feedSRC = copyBtnElem.parentNode.querySelector('iframe.feed').src
    linkVideoId = feedSRC.split('?')[0].split('embed/')[1]
    feedName = ''


    for (let i=0;i<streamLinks.length;i++) {
        if (streamLinks[i].videoId==linkVideoId) {feedName=streamLinks[i].creditName;break}
    }

    copyText = `[ Credit: [${feedName}](<https://www.youtube.com/watch?v=${linkVideoId}>) ]`
    navigator.clipboard.writeText(copyText)

    await delay(1500)
    copyBtnElem.classList.remove('active')
}