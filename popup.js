let timer = document.getElementById('timer');
let msgEle = document.getElementById('message');
document.getElementById('tick').onclick = tick;
document.getElementById('override').onclick = override;

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

var messages = [
    "Go finish your to-do list first",
    "Work, addition, rejection",
    "Distraction economy: You evolved to crave information",
    "Go on a walk instead",
    "Take a nap",
    "Have you run your daily checklist yet?",
    "You'll hate yourself afterwards",
    "What EXACTLY are you looking for? Just browsing?",
    "Really? Why do you NEED this?"
]

originalUrl = findGetParameter("url");
console.log(originalUrl);

remaining = 30;
lastTick = 0;
tick();

function tick() {
    if (Date.now() - lastTick < 1000) {
        return;
    }
    lastTick = Date.now();
    timer.innerText = remaining;
    if (remaining % 5 == 4) {
        msgEle.innerText = messages[Math.floor(Math.random() * messages.length)];
    }
    if (!document.hidden) {
        remaining--;
    }
    if (remaining == 0) {
        override();
    }
}

function override() {
    chrome.runtime.sendMessage({
        timeLimit: Date.now() + 5 * 60 * 1000,
    }, (resp) => {
        window.location.replace(originalUrl);
    });
    return;
}
