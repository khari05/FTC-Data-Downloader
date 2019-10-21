var axios = require("axios")

var TOAKey = process.env.TOAKEY
var seasonKey = "1920"
var teamNumber = process.argv[2]
var call1 = "/team/" + teamNumber + "/matches/"+ seasonKey
var matchlist = []
var matchKey = []

var autoList = []
var teleList = []
var endList = []
var totalList = []

const instance = axios.create({
    baseURL: "https://theorangealliance.org/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "X-TOA-Key": TOAKey,
        "X-Application-Origin": "FTC Data Downloader"
    }
});

instance.get(call1)
    .then(function (matches) {
        matchlist = matches.data
        while (totalList.length < matchlist.length){
            autoList.push("")
            teleList.push("")
            endList.push("")
            totalList.push("")
        }
        for (i=0; i<matchlist.length; i++){
            matchKey.push(matchlist[i].match_key)
            instance.get("/match/" + matchlist[i].match_key)
            .then(function (match){
                AddToScore(match.data, matchlist[matchKey.indexOf(match.data[0].match_key)].station)
            })
            .catch(function(error) {
                console.error(error)
            })
        }
    })
    .catch( function(error) {
        console.error(error)
    });

function AddToScore(match, team) {
    if(team < 20){
        autoList[matchKey.indexOf(match[0].match_key)] = match[0].red_auto_score
        teleList[matchKey.indexOf(match[0].match_key)] = match[0].red_tele_score
        endList[matchKey.indexOf(match[0].match_key)] = match[0].red_end_score
        totalList[matchKey.indexOf(match[0].match_key)] = match[0].red_score
    }else if(team > 20){
        autoList[matchKey.indexOf(match[0].match_key)] = match[0].blue_auto_score
        autoList[matchKey.indexOf(match[0].match_key)] = match[0].blue_tele_score
        autoList[matchKey.indexOf(match[0].match_key)] = match[0].blue_end_score
        totalList[matchKey.indexOf(match[0].match_key)] = match[0].blue_score
    }
    if(totalList.indexOf("") === -1 /*&& autoList.indexOf("") === -1 && teleList.indexOf("") === -1 && endList.indexOf("") === -1*/){
        // console.log("total autonomous scores: " + autoList.toString())
        // console.log("total teleop scores: " + teleList.toString())
        // console.log("total end game scores: " + endList.toString())
        console.log("total scores: " + totalList.toString())
    }
}