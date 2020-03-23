import axios from "axios"


export const requestAllSeasons = (functions: {setSeasons: any}): void => {
  axios
    .get("/api/seasons")
    .then(res => {
      console.log(res.data)
      functions.setSeasons(res.data)
    })
    .catch(err => console.log(err))
}


export const requestCompetitions = (
  meta: { season: string},
  functions: { setCompetitions: any }
) => {
  if (
    typeof meta.season === "undefined" ||
    typeof functions.setCompetitions === "undefined"
  )
    return

  axios
    .get(`/api/season/${meta.season}`)
    .then(res => {
      functions.setCompetitions(res.data.competitions)
    })
    .catch(err => {
      console.log(err)
    })
}

export const requestFixture = (
  param: { competitions: {id: string}, competition: string, season: string, player: {id: string} },
  functions: { setAvailability: any, setFixtures: any }
) => {
  if (
    typeof param.competitions === "undefined" ||
    typeof param.competition !== "string" ||
    typeof param.season === "undefined" ||
    typeof functions.setAvailability === "undefined" ||
    typeof functions.setFixtures === "undefined"
  )
    return // DO NOTHING

  axios
    .get(`/api/competition/${param.competition}`, {
      params: {
        season: param.season
      }
    })
    .then(res => {
      console.log(res.data)
      functions.setFixtures(res.data.fixtures) // set fixtures for competition
      axios
        .get(`/api/fixture/${param.player.id}`, {
          params: {
            season: param.season,
            competition: param.competition,
            length: res.data.fixtures.length
          }
        })
        .then(res => {
          console.log(res.data)
          functions.setAvailability(res.data.fixtures)
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

export const requestSave = (
  meta: {
    player: string,
    season: string,
    competition: string,
    availability: number[],
    status?: [string, string, string]
  },
  functions: {success: any, error: any, reset: any}
) => {
  if (
    typeof meta.competition === "undefined" ||
    typeof meta.player === "undefined" ||
    typeof meta.season === "undefined" ||
    typeof meta.availability === "undefined" ||
    typeof functions.success === "undefined" ||
    typeof functions.error === "undefined" ||
    typeof functions.reset === "undefined"
  ) {
    console.log(meta)
    return // DO NOTHING
  }

  console.log("made request")
  axios
    .post(`/api/fixture/${meta.player}`, {
      fixtures: meta.availability,
      season: meta.season,
      competition: meta.competition,
      status: meta.status
    })
    .then(resp => {
      if (resp.data.ok === true && resp.data.change === true) {
        functions.success()
      } else {
        functions.error()
      }
      setTimeout(functions.reset, 2000)
    })
    .catch(err => {
      console.log(err)
      functions.error()
    })
}