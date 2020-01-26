const axios = require("axios")
const fs = require("fs")

var TOAKey = process.env.TOAKEY
var seasonKey = "1920"
var filepath = "./teams.txt"
var teamList
var teamNameList = []

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
    while (teamNameList.length < teamList.length) {
        teamNameList.push("")
    }
})

function run(teamNumber) {
    instance.get("/team/" + teamNumber)
        .then(function (team) {
            teamNameList[teamList.indexOf(teamNumber)] = team.data[0].team_name_short
            if (teamList.length > teamList.indexOf(teamNumber) + 1) {
                setTimeout(run, 2000, teamList[teamList.indexOf(teamNumber) + 1])
            }
            if (teamNameList.indexOf("") < 0) {
                for (i = 0; i < teamNameList.length; i++) {
                    console.log(teamNameList[i])
                }
            }
        })
        .catch(function (error) {
            console.error(error)
        })
}