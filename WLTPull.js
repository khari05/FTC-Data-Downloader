const axios = require("axios")
const fs = require("fs")

var TOAKey = process.env.TOAKEY
var seasonKey = "1920"
var filepath = "./teams.txt"
var teamList
var WLTList = []
var printable = []

// var header = "team number,match number,match ID,randomization,alliance color,total score,auto score,tele score,end score,parking during auto,foundation during auto,skystones during auto,stones during auto,stones on foundation at end of auto auto,stones brought to build site,stones on foundation,stackheight,foundation during endgame,capstone(s) during endgame,parking during endgame,minor penalties,major penalties"
// console.log(header)

const instance = axios.create({
    baseURL: "https://theorangealliance.org/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "X-TOA-Key": TOAKey,
        "X-Application-Origin": "FTC Data Downloader By MrCoderBoy345"
    }
})

fs.readFile(filepath, "utf8", function (err, data) {
    if (err) throw err
    teamList = data.split("\n")
    for (i = 0; i < teamList.length; i++) {
        run(teamList[i])
    }
    while (WLTList.length < teamList.length) {
        WLTList.push(["", "", ""])
    }
})

function run(teamNumber) {
    instance.get("/team/" + teamNumber + "/wlt")
        .then(function (wlt) {
            var position = WLTList[teamList.indexOf(teamNumber)]
            position[0] = wlt.data[0].wins
            position[1] = wlt.data[0].losses
            position[2] = wlt.data[0].ties

            for (i = 0; i < WLTList.length; i++) {
                printable[i] = (WLTList[i].indexOf("") < 0)
            }
            if (printable.indexOf(false) < 0) {
                console.log(arrayToCsv(WLTList))
            }
        })
        .catch(function (error) {
            console.error(error)
        });
}

function arrayToCsv(rows, delimiter) {
    if (typeof delimiter === "undefined" || delimiter === null) {
        delimiter = ","
    }

    return rows.map(function (row) {
        return row.map(escapeCsvValue, delimiter).join(delimiter)
    }).join("\n")
}

function escapeCsvValue(val, delimiter) {
    if (typeof (val) === "undefined" || val === null) {
        return ""
    } else {
        val = String(val)
    }

    val = val.replace(/"/g, '""')

    if (val.search(/("|,|\n)/g) >= 0) {
        val = '"' + val + '"'
    }

    return val
}