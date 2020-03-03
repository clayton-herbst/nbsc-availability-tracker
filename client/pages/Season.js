import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Header from "../components/Header"
import FixtureContainer from "../components/FixtureContainer"
import FixtureCard from "../components/FixtureCard"
import Button from "react-bootstrap/Button"
import { club, player } from "../constants"
import { useParams } from "react-router-dom"
import axios from "axios"
import Alert from "react-bootstrap/Alert"
import Tab from "react-bootstrap/Tab"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import EventEmitter from "events"
import CompetitionNav from "../components/CompetitionNav"

export default props => {
  const { id } = useParams()
  console.log(`${id}`)

  // STATE
  const [fixtures, setFixtures] = useState(undefined)
  const [availability, setAvailability] = useState(undefined)
  const [fixtureList, setFixtureList] = useState(<p>Please select a season</p>)
  const [saveAlert, setSaveAlert] = useState({ success: false, error: false })
  //const [status, setStatus] = useState(["maybe", "yes", "no"])
  const [competitions, setCompetitions] = useState(undefined)
  const [seasons, setSeasons] = useState(undefined)
  const [active, setActive] = useState(undefined)
  //const [events, setEvents] = useState(new EventEmitter())

  const save = () => {
    if (typeof competitions === "undefined" || typeof active === "undefined")
      return

    console.log("save function meta:")
    console.log("competitions:" + competitions)
    console.log(`active: ${active}`)

    // SAVE EVENT
    let meta = {
      player: player.id,
      season: id,
      competition: competitions[active].id,
      availability: availability,
      alert: saveAlert
    }

    let functions = { alert: setSaveAlert }

    requestSave(meta, functions)
  }

  // MUTATOR METHODS
  // NOT IDEAL AS RERENDER MAKES EXTRA CALLS
  useEffect(() => {
    axios
      .get("/api/seasons")
      .then(res => {
        console.log(res.data)
        setSeasons(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    // DYNAMICALLY UPDATE LIST OF COMPETITIONS FOR A PARTICULAR SEASON

    let meta = { season: id }
    let functions = { competitions: setCompetitions }
    requestSeasons(meta, functions)
  }, [id])

  useEffect(() => {
    // RETRIEVE SELECTED COMPETITION FIXTURE DATA AND PLAYER AVAILABILITY

    let info = { competitions: competitions, active: active, season: id }
    let functions = { fixtures: setFixtures, availability: setAvailability }
    requestFixture(info, functions) // update fixtures
  }, [id, active, competitions])

  // IMPROVEMENT: USE CALLBACK INSTEAD ?? & useEffect once
  useEffect(() => {
    if (typeof fixtures === "undefined") return

    setFixtureList(
      fixtures.map((item, index) => {
        const date = new Date(item.date)
        const dateOptions = {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "2-digit"
        }
        const dateString = `${date.toLocaleDateString(undefined, dateOptions)}`
        console.log("fixture item:")
        console.log(item)
        return (
          <div key={item._id}>
            <FixtureCard
              key={item._id}
              round={index + 1}
              location={item.location}
              date={dateString}
              title={item.title}
              color={availabilityColors[availability[index]]}
            >
              <div className="d-flex justify-content-around">
                <Button
                  className="text-capitalize"
                  variant={availabilityColors[availability[index]]}
                  onClick={() => {
                    availability[index] = (availability[index] + 1) % 3
                    setAvailability([...availability])
                    console.log(availability)
                  }}
                >
                  {status[availability[index]]}
                </Button>
              </div>
            </FixtureCard>
          </div>
        )
      })
    )
  }, [availability, competitions])

  return (
    <div>
      <Header player="Clayton" title={club.name} seasons={seasons} />
      <Tab.Container
        id="season-comps"
        defaultActiveKey="0"
        onSelect={key => setActive(key)}
      >
        <Row>
          <Col sm={3}>
            <CompetitionNav>{competitions}</CompetitionNav>
          </Col>
          <Col sm={9}>
            <FixtureContainer save={save}>{fixtureList}</FixtureContainer>
          </Col>
        </Row>
      </Tab.Container>
      <div className="position-relative">
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={saveAlert.success}
            onClose={() => setSaveAlert({ ...saveAlert, success: false })}
            dismissible="true"
            variant="success"
          >
            <strong className="text-success">Saved your progress!</strong>
          </Alert>
        </div>
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={saveAlert.error}
            dismissible="true"
            onClose={() => setSaveAlert({ ...saveAlert, error: false })}
            variant="danger"
          >
            <strong className="text-danger">Error saving progress!</strong>
          </Alert>
        </div>
      </div>
    </div>
  )
}

/*
<FixturePane season={id} competitions={competitions} active={active}>
  </FixturePane>

  */

const requestSeasons = (
  meta = { season: undefined },
  functions = { competitions: undefined }
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

const requestFixture = (
  param = { competitions: undefined, active: undefined, season: undefined },
  functions = { availability: undefined, fixtures: undefined }
) => {
  if (
    typeof param.competitions === "undefined" ||
    typeof param.active === "undefined" ||
    typeof param.season === "undefined" ||
    typeof functions.availability === "undefined" ||
    typeof functions.fixtures === "undefined"
  )
    return // DO NOTHING

  axios
    .get(`/api/competition/${param.competitions[param.active].id}`, {
      params: {
        season: param.season
      }
    })
    .then(res => {
      console.log(res.data)
      functions.fixtures(res.data.fixtures)
      axios
        .get(`/api/fixture/${player.id}`, {
          params: {
            season: param.season,
            competition: param.competitions[param.active].id,
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

const requestSave = (
  meta = {
    player: undefined,
    season: undefined,
    competition: undefined,
    availability: undefined,
    alert: undefined,
    status: ["maybe", "yes", "no"]
  },
  functions = { alert: undefined }
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

const status = ["maybe", "yes", "no"]
const availabilityColors = ["warning", "success", "danger"]
