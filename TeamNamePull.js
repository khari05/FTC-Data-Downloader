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
    for (i = 0; i < teamList.length; i++) {
        run(teamList[i])
    }
    while (teamNameList.length < teamList.length) {
        teamNameList.push("")
    }
})

function run(teamNumber) {
    instance.get("/team/" + teamNumber)
        .then(function (team) {
            teamNameList[teamList.indexOf(teamNumber)] = team.data[0].team_name_short

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