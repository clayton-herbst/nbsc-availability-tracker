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
import CompetitionNav from "../components/CompetitionNav"
import { FixtureForm, SeasonForm } from "../components/AdminForms"
import Modal from "react-bootstrap/Modal"


interface Season {
  defaultSeasonId: string
}

export default (props: Season) => {
  //const { id } = useParams()
  //console.log(`${id}`)

  // STATE
  const [id, setSeasonId] = useState(props.defaultSeasonId)
  const [fixtures, setFixtures] = useState(undefined)
  const [availability, setAvailability] = useState(undefined)
  const [fixtureList, setFixtureList] = useState(<p>Please select a season</p>)
  const [saveAlert, setSaveAlert] = useState({ success: false, error: false })
  //const [status, setStatus] = useState(["maybe", "yes", "no"])
  const [competitions, setCompetitions] = useState(undefined)
  const [seasons, setSeasons] = useState(undefined)
  const [active, setActiveCompetition] = useState(undefined)
  const [addFixtureModal, setAddFixtureModal] = useState(false) // add new fixture pop-up
  const [addSeasonModal, setAddSeasonModal] = useState(false) // add new season pop-up
  //const [events, setEvents] = useState(new EventEmitter())

  console.log(`season id: ${id}`)
  console.log(`active: ${active}`)

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
      competition: active,
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
    if (typeof id === "undefined") return

    let meta = { season: id }
    let functions = { competitions: setCompetitions }
    requestCompetitions(meta, functions)
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
      <Header player="Clayton" title={club.name} seasons={seasons} defaultSeasonId={props.defaultSeasonId} onSeasonSelect={(id: string) => {setSeasonId(id)}}/>
      <Tab.Container
        id="season_competitions"
        defaultActiveKey="0"
        activeKey={active}
        onSelect={key => setActiveCompetition(key)}
      >
        <Row>
          <Col sm={3}>
            <CompetitionNav>{competitions}</CompetitionNav>
            <Container className="mt-2 pt-2 border-top d-flex justify-content-center">
              <Button
                className="m-2"
                size="sm"
                variant="outline-primary"
                onClick={() => setAddSeasonModal(true)}
              >
                Add Season
              </Button>
              <Button
                className="m-2"
                size="sm"
                variant="outline-dark"
                onClick={() => alert("Enter add competition and fixtures page state change.")}
              >
                Add Competition
              </Button>
              <Modal
                show={addSeasonModal}
                onHide={() => setAddSeasonModal(false)}
              >
                <Modal.Header closeButton={true}>
                  <Modal.Title
                    className="ml-auto"
                    style={{ color: "maroon", paddingLeft: 50 }}
                  >
                    Add Season
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <SeasonForm onClose={() => setAddSeasonModal(false)} />
                </Modal.Body>
              </Modal>
            </Container>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="5e1fbe36802ef807df29aa61" transition={false} active={"5e1fbe36802ef807df29aa61" == active}>
                <FixtureContainer fixtures={fixtureList}>
                  <Container className="mb-5">
                    <Row
                      hidden={false}
                      className="my-1 d-flex justify-content-sm-center"
                    >
                      <Button
                        className="text-capitalize m-1"
                        variant="outline-success"
                        onClick={save}
                        size="sm"
                      >
                        save
                      </Button>
                    </Row>
                    <Row
                      hidden={false}
                      className="my-1 d-flex justify-content-sm-center"
                    >
                      <Button
                        className="m-1 text-capitalize"
                        variant="outline-warning"
                        size="sm"
                        onClick={() => setAddFixtureModal(true)}
                      >
                        Add Fixture
                      </Button>
                    </Row>
                    <Modal
                      show={addFixtureModal}
                      onHide={() => setAddFixtureModal(false)}
                    >
                      <Modal.Header closeButton={true}>
                        <Modal.Title
                          className="ml-auto"
                          style={{ color: "maroon", paddingLeft: 50 }}
                        >
                          Add Fixture
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <FixtureForm initialValues={{}} onSave={()=>{alert("saved")}} onClose={() => setAddFixtureModal(false)} />
                      </Modal.Body>
                    </Modal>
                  </Container>
                </FixtureContainer>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <div className="position-relative">
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={saveAlert.success}
            onClose={() => setSaveAlert({ ...saveAlert, success: false })}
            dismissible={true}
            variant="success"
          >
            <strong className="text-success">Saved your progress!</strong>
          </Alert>
        </div>
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={saveAlert.error}
            dismissible={true}
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

const requestCompetitions = (
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

const requestFixture = (
  param: { competitions: {id: string}, active: number, season: string },
  functions: { availability: any, fixtures: any }
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
    .get(`/api/competition/${param.active}`, {
      params: {
        season: param.season
      }
    })
    .then(res => {
      console.log(res.data)
      functions.fixtures(res.data.fixtures) // set fixtures for competition
      axios
        .get(`/api/fixture/${player.id}`, {
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

const requestSave = (
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

// -- CONSTANTS --
const status = ["maybe", "yes", "no"]
const availabilityColors: ["warning", "success", "danger"] = ["warning", "success", "danger"]
