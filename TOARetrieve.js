const axios = require("axios")
const fs = require("fs")

var TOAKey = process.env.TOAKEY
var seasonKey = "1920"
var filepath = "./teams.txt"
var teamList
var matchList = []
var LTList = []
var matchKey = []
var masterList = []
var printable = []

var header = "team number,match number,match ID,randomization,alliance color,total score,auto score,tele score,end score,parking during auto,foundation during auto,skystones during auto,stones during auto,stones on foundation at end of auto auto,stones brought to build site,stones on foundation,stackheight,foundation during endgame,capstone(s) during endgame,parking during endgame,minor penalties,major penalties"
console.log(header)

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
    run(teamList[0])
})

function run(teamNumber){
    instance.get("/team/" + teamNumber + "/matches/"+ seasonKey)
        .then(function (matches) {
            for (i=0; i<matches.data.length; i++) {
                if (matches.data[i].match_key.charAt(10) == "L" && matches.data[i].match_key.charAt(11) == "T"){
                    LTList.push(matches.data[i])
                } else{
                    matchList.push(matches.data[i])
                }
            }
            while (matchList.length + LTList.length > 10){
                if (matchList.length > 0){
                    matchList.shift()
                } else{
                    LTList.shift()
                }
            }
            while (masterList.length < matchList.length + LTList.length){
                masterList.push([])
                for (i=0;i<21; i++){
                    masterList[masterList.length-1].push("")
                }
            }
            for (i=0; i<matchList.length; i++){
                matchKey.push(matchList[i].match_key)
                instance.get("/match/" + matchList[i].match_key + "/details")
                    .then(function (match){
                        addToData(match.data, matchList[matchKey.indexOf(match.data[0].match_key)].station, teamNumber)
                    })
                    .catch(function(error) {
                        console.error(error)
                    })
                instance.get("/match/" + matchList[i].match_key)
                    .then(function (match){
                        addToScore(match.data, matchList[matchKey.indexOf(match.data[0].match_key)].station)
                    })
                    .catch(function(error) {
                        console.error(error)
                    })
            }
            for (i=0; i<LTList.length; i++){
                matchKey.push(LTList[i].match_key)
                instance.get("/match/" + LTList[i].match_key + "/details")
                    .then(function (match){
                        addToData(match.data, LTList[matchKey.indexOf(match.data[0].match_key)].station, teamNumber)
                    })
                    .catch(function(error) {
                        console.error(error)
                    })
                instance.get("/match/" + LTList[i].match_key)
                    .then(function (match){
                        addToScore(match.data, LTList[matchKey.indexOf(match.data[0].match_key)].station)
                    })
                    .catch(function(error) {
                        console.error(error)
                    })

            }
        })
        .catch( function(error) {
            console.error(error)
        });
}

function addToScore(match, team, teamNumber) {
    var position = masterList[matchKey.indexOf(match[0].match_key)]
    if(team < 20){
        position[4] = "red"
        position[5] = match[0].red_score
        position[6] = match[0].red_auto_score
        position[7] = match[0].red_tele_score
        position[8] = match[0].red_end_score
    }else if(team > 20){
        position[4] = "blue"
        position[5] = match[0].blue_score
        position[6] = match[0].blue_auto_score
        position[7] = match[0].blue_tele_score
        position[8] = match[0].blue_end_score
    }
    for (i=0; i<masterList.length; i++){
        printable[i] = (masterList[i].indexOf("") < 0)
    }
    if (printable.indexOf(false) < 0){
        console.log(arrayToCsv(masterList))
        printable = []
        matchKey = []
        masterList = []
        matchlist = []
        LTList = []
        if (teamList.length > teamList.indexOf(teamNumber) + 1) {
            setTimeout(run, 30000, teamList[teamList.indexOf(teamNumber) + 1])
        }
    }
}

function addToData(match, team, teamNumber) {
    var position = masterList[matchKey.indexOf(match[0].match_key)]
    position[0] = teamNumber
    position[1] = matchKey.indexOf(match[0].match_key) + 1
    position[2] = match[0].match_key
    position[3] = match[0].randomization
    if(team < 20){
        position[9] = (match[0].red.nav_points)/5
        position[10] = match[0].red.foundation_repositioned
        position[11] = match[0].red.auto_delivered_skystones
        position[12] = match[0].red.auto_delivered_stones
        position[13] = match[0].red.auto_placed
        position[14] = match[0].red.tele_delivered
        position[15] = match[0].red.tele_placed
        position[16] = match[0].red.tower_bonus
        position[17] = match[0].red.foundation_moved
        position[18] = match[0].red.tower_capping_bonus
        position[19] = match[0].red.end_robots_parked
        position[20] = match[0].blue_min_pen
        position[21] = match[0].blue_maj_pen
    }else if(team > 20){
        position[9] = (match[0].blue.nav_points)/5
        position[10] = match[0].blue.foundation_repositioned
        position[11] = match[0].blue.auto_delivered_skystones
        position[12] = match[0].blue.auto_delivered_stones
        position[13] = match[0].blue.auto_placed
        position[14] = match[0].blue.tele_delivered
        position[15] = match[0].blue.tele_placed
        position[16] = match[0].blue.tower_bonus
        position[17] = match[0].blue.foundation_moved
        position[18] = match[0].blue.tower_capping_bonus
        position[19] = match[0].blue.end_robots_parked
        position[20] = match[0].red_min_pen
        position[21] = match[0].red_maj_pen
    }
    for (i=0; i<masterList.length; i++){
        printable[i] = (masterList[i].indexOf("") < 0)
    }
    if (printable.indexOf(false) < 0){
        console.log(arrayToCsv(masterList))
        printable = []
        matchKey = []
        masterList = []
        matchlist = []
        LTList = []
        if (teamList.length > teamList.indexOf(teamNumber) + 1) {
            setTimeout(run, 30000, teamList[teamList.indexOf(teamNumber) + 1])
        }
    }
}

function arrayToCsv(rows, delimiter) {
    if (typeof delimiter === "undefined" || delimiter === null) {
        delimiter = ","
    }

    return rows.map(function(row) {
        return row.map(escapeCsvValue, delimiter).join(delimiter)
    }).join("\n")
}

function escapeCsvValue(val, delimiter) {
    if (typeof(val) === "undefined" || val === null) {
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