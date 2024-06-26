function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// To address those who want the "root domain," use this function:
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

timeLimit = null;

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
    if (req.timeLimit) {
        timeLimit = req.timeLimit;
        sendResp({timeLimit: timeLimit});
    }
});

blockList = [
    "youtube",
    "facebook",
    "stackexchange",
    "xkcd",
    "reddit",
    "linkedin",
    "smbc-comics",
    "curbed",
    "twitter",
    "x",
]

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (timeLimit != null && timeLimit > Date.now()) {
            return;
        }
        for (let blocked of blockList) {
            if ((!details.initiator || extractRootDomain(details.initiator).includes(blocked)) && extractRootDomain(details.url).includes(blocked)) {
                let redirect = chrome.extension.getURL("popup.html");
                return {
                    redirectUrl: `${redirect}?url=${encodeURIComponent(details.url)}`,
                }
            }
        }
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]
);
