const axios = require("axios")
const fs = require("fs")
const path = require("path")
const config = require("./config.json")

function getFixedDate() {
    return new Date().getDate() + "-" + (Number(new Date().getMonth()) +1) + "-" + new Date().getFullYear() + " " + new Date().getHours() + "-" + new Date().getMinutes()
}

function downloadPlaceFrame(name) {
    const filename = name + "   " + getFixedDate() + ".png"
    const dir = path.resolve(__dirname, "frames", filename);

    axios.get("https://www.gommehd.net/place/api/image/", {
        responseType: "stream"
    }).then(function(response) {
        response.data.pipe(fs.createWriteStream(dir));
        response.data.on("end", () => {
            console.log("\x1b[32m[r/place]\x1b[0m Frame saved - path:", filename);
        });
    }).catch(function(error) {
        console.log("Request failed. Error: ", error)
        return
    })
}

function getCurrentFrameId() {
    let amount = 0
    fs.readdirSync("./frames/").forEach(file => {
        amount = amount + 1
    })
    return amount
}

console.log("\x1b[47m\x1b[30m[INFO]\x1b[0m", "running gommehd.net_r/place_capturer@v1.1" + "\n" +
            "\x1b[47m\x1b[30m[INFO]\x1b[0m", "------------------------------", "\n" + 
            "\x1b[47m\x1b[30m[INFO]\x1b[0m", "Using Configuration:", "\n" +
            "\x1b[47m\x1b[30m[INFO]\x1b[0m", "   Capture delay: " + config.capture_delay, "seconds\n" +
            "\x1b[47m\x1b[30m[INFO]\x1b[0m", "------------------------------"  
)


function saveCurrentFrame() {
    if(new Date().getHours() == 0 || new Date().getHours() >= 14) {
        downloadPlaceFrame("FRAME-" + String(getCurrentFrameId() + 1));
    } else {
        console.log("\x1b[43m[r/place]\x1b[0m Frame not saved since r/place is closed. Frames will start capturing again between 2:00 PM and 1:00 AM.")
    }
}

saveCurrentFrame()

setInterval(() => {
    saveCurrentFrame()
}, config.capture_delay*1000);