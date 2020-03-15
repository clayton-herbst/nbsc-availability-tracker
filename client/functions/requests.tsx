import axios from "axios"


export const requestAllSeasons = (functions: {seasonState: any}) => {
  axios
    .get("/api/seasons")
    .then(res => {
      console.log(res.data)
      functions.seasonState(res.data)
    })
    .catch(err => console.log(err))
}
export const requestCompetitions = (
  meta: { season: string},
  functions: { competitions: any }
) => {
  if (
    typeof meta.season === "undefined" ||
    typeof functions.competitions === "undefined"
  )
    return

  axios
    .get(`/api/season/${meta.season}`)
    .then(res => {
      functions.competitions(res.data.competitions)
    })
    .catch(err => {
      console.log(err)
    })
}

export const requestFixture = (
  param: { competitions: {id: string}, active: string, season: string, player: {id: string} },
  functions: { availability: any, fixtures: any }
) => {
  if (
    typeof param.competitions === "undefined" ||
    typeof param.active !== "string" ||
    typeof param.season === "undefined" ||
    typeof functions.availability === "undefined" ||
    typeof functions.fixtures === "undefined"
  )
    return // DO NOTHING

  axios
    .get(`/api/competition/${param.active}`, {
      params: {
        season: param.season
      }
    })
    .then(res => {
      console.log(res.data)
      functions.fixtures(res.data.fixtures) // set fixtures for competition
      axios
        .get(`/api/fixture/${param.player.id}`, {
          params: {
            season: param.season,
            competition: param.active,
            length: res.data.fixtures.length
          }
        })
        .then(res => {
          console.log(res.data)
          functions.availability(res.data.fixtures)
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
    alert: {success: boolean, error: boolean},
    status?: [string, string, string]
  },
  functions: {alert: any}
) => {
  if (
    typeof meta.competition === "undefined" ||
    typeof meta.player === "undefined" ||
    typeof meta.season === "undefined" ||
    typeof meta.availability === "undefined" ||
    typeof meta.alert === "undefined" ||
    typeof functions.alert === "undefined"
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
      if (typeof resp.data.ok === "undefined") {
        functions.alert({ ...meta.alert, error: true })
      } else if (resp.data.ok === true) {
        functions.alert({ ...meta.alert, success: true })
      } else {
        functions.alert({ ...meta.alert, error: true })
      }
      setTimeout(functions.alert, 2000, { success: false, error: false })
    })
    .catch(err => {
      console.log(err)
      functions.alert({ ...meta.alert, error: true })
    })
}