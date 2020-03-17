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
import { FixtureForm, SeasonForm, CompetitionForm } from "../components/AdminForms"
import Modal from "react-bootstrap/Modal"
import CompetitionSelectStatic from "../components/CompetitionSelectStatic"
import SeasonSelectStatic from "../components/SeasonSelectStatic"
import BulkFixtures from "../components/BulkFixtures"
import DropdownButton from "react-bootstrap/DropdownButton"
import Dropdown from "react-bootstrap/Dropdown"
import PlayerSearch from "../components/PlayerSearch"
import { requestAllSeasons, requestFixture, requestCompetitions, requestSave } from "../functions/requests"


interface Season {
  defaultSeasonId: string;
}

export default (props: Season) => {
  //const { id } = useParams()
  //console.log(`${id}`)

  // STATE
  const [id, setSeasonId] = useState(props.defaultSeasonId)
  const [fetchSeasons, toggleFetchSeasons] = useState(true)
  const [fixtures, setFixtures] = useState(undefined)
  const [availability, setAvailability] = useState(undefined)
  const [fixtureList, setFixtureList] = useState(undefined)
  const [saveAlert, setSaveAlert] = useState({ success: false, error: false })
  //const [status, setStatus] = useState(["maybe", "yes", "no"])
  const [competitions, setCompetitions] = useState(undefined)
  const [seasons, setSeasons] = useState(undefined)
  const [active, setActiveCompetition] = useState(undefined) // active competition
  const [fetchCompetitions, toggleFetchCompetitions] = useState(true)
  const [fetchFixtures, toggleFetchFixtures] = useState(true)
  const [addFixtureModal, setAddFixtureModal] = useState(false) // add new fixture pop-up
  const [addSeasonModal, setAddSeasonModal] = useState(false) // add new season pop-up
  const [addCompetitionModal, setAddCompetitionModal] = useState(false)
  const [paneType, setPaneType] = useState("fixtures")
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
    requestAllSeasons({seasonState: setSeasons})
  }, [fetchSeasons])

  useEffect(() => {
    // DYNAMICALLY UPDATE LIST OF COMPETITIONS FOR A PARTICULAR SEASON
    if (typeof id === "undefined")
      return

    let meta = { season: id }
    let functions = { competitions: setCompetitions }
    requestCompetitions(meta, functions)
  }, [id, fetchCompetitions])

  useEffect(() => {
    // RETRIEVE SELECTED COMPETITION FIXTURE DATA AND PLAYER AVAILABILITY

    let info = { competitions: competitions, active: active, season: id, player: player }
    let functions = { fixtures: setFixtures, availability: setAvailability }
    requestFixture(info, functions) // update fixtures
  }, [active, fetchFixtures])

  const createFixtureComponent = (meta: {fixtures: any, availability: number[], availabilityColors: string[]}, functions: {fixtureState: any, availabilityState: any, onSearch: any, onEdit: any}): void => {
    if (typeof meta.fixtures === "undefined")
      return

    functions.fixtureState(
      meta.fixtures.map((item, index) => {
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
              color={meta.availabilityColors[meta.availability[index]]}
              onSearch={functions.onSearch}
              onEdit={functions.onEdit}
              onChange={() => {
                meta.availability[index] = (meta.availability[index] + 1) % 3
                functions.availabilityState([...availability])
              }}
              availability={meta.availability[index]}
            />
          </div>
        )
      })
    )
  }

  // IMPROVEMENT: USE CALLBACK INSTEAD ?? & useEffect once
  useEffect(() => {
    if(typeof fixtures === "undefined" || typeof availability === "undefined")
      return
    
    let meta = {
      fixtures: fixtures,
      availability: availability,
      availabilityColors: availabilityColors
    }
    let functions = {
      fixtureState: setFixtureList,
      availabilityState: setAvailability,
      onSearch: () => setPaneType("search"),
      onEdit: () => alert("edit")
    }

    createFixtureComponent(meta, functions) // dynamically render new fixtures based on fetched fixtures
  }, [availability, fixtures])

  if(typeof id === "undefined" || id === "") {
    return (
      <div>
        <Header player="Clayton" title={club.name} seasons={seasons} onHome={() => setSeasonId("")} defaultSeasonId={props.defaultSeasonId} onSeasonSelect={(id: string) => {setSeasonId(id)}}/>
        <Container>
          <SeasonSelectStatic />
        </Container>
      </div>
    )
  } else
  return (
    <div>
      <Header player="Clayton" title={club.name} seasons={seasons} onHome={() => setSeasonId("")} defaultSeasonId={props.defaultSeasonId}
        onSeasonSelect={(id: string) => {
          setSeasonId(id)
          setActiveCompetition("0")
          setPaneType("")
        }}
      />
      <Tab.Container
        id="season_competitions"
        defaultActiveKey="0"
        activeKey={active}
        onSelect={key => {
          setActiveCompetition(key)
          setPaneType("fixtures")
        }}
      >
        <Row>
          <Col sm={3}>
            <CompetitionNav competitions={competitions} />
            <Container className="mt-2 pt-2 d-flex justify-content-center">
              <DropdownButton className="m-1 p-1" drop="down" variant="outline-secondary" title="Admin" id="admin_options">
                <Dropdown.Item eventKey={active} onClick={() => setAddCompetitionModal(true)}>Add Competition</Dropdown.Item>
                <Dropdown.Item eventKey={active} onClick={() => setAddFixtureModal(true)}>Add Fixture</Dropdown.Item>
                <Dropdown.Item eventKey={active} onClick={() => setAddSeasonModal(true)}>Add Season</Dropdown.Item>
              </DropdownButton>
            </Container>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="0">
                <CompetitionSelectStatic />
              </Tab.Pane>
              <Container hidden={paneType !== "search"}>
                <PlayerSearch fixtureTitle="fixture" seasonTitle="season" competitionTitle="competition" />
              </Container>
              <Container hidden={paneType !== "fixtures"}>
                <FixtureContainer admin={true} fixtures={fixtureList} onAvailabilitySave={save} competition={active} onClose={() => toggleFetchFixtures(!fetchFixtures)} alert={(param:{success: boolean, error: boolean}) => setSaveAlert({...saveAlert, success: param.success, error: param.error})} />
              </Container>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
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
          <FixtureForm competition={active}
            onSave={() => {
              setSaveAlert({...saveAlert, success: true})
              setTimeout(setSaveAlert, 2000, { success: false, error: false })
              setAddFixtureModal(false)
            }}
            onClose={() => toggleFetchFixtures(!fetchFixtures)}
            onError={() => {
              setSaveAlert({...saveAlert, error: true})
              setTimeout(setSaveAlert, 2000, { success: false, error: false })
            }}
          />
        </Modal.Body>
      </Modal>
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
          <SeasonForm
            onSave={() => {
              setSaveAlert({...saveAlert, success: true})
              setTimeout(setSaveAlert, 2000, { success: false, error: false })
              setAddSeasonModal(false)
            }}
            onClose={() => toggleFetchSeasons(!fetchSeasons)}
            onError={() => {
              setSaveAlert({...saveAlert, error: true})
              setTimeout(setSaveAlert, 2000, { success: false, error: false })
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={addCompetitionModal}
        onHide={() => setAddCompetitionModal(false)}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title
            className="ml-auto"
            style={{ color: "maroon", paddingLeft: 50 }}
          >
            Add Competition
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompetitionForm season={id} 
            onSave={() => {
              setSaveAlert({...saveAlert, success: true})
              setTimeout(setSaveAlert, 2000, { success: false, error: false })
              setAddCompetitionModal(false)
            }}
            onClose={() => toggleFetchCompetitions(!fetchCompetitions)}
            onError={() => {
              setSaveAlert({...saveAlert, error: true})
              setTimeout(setSaveAlert, 2000, { success: false, error: false })
            }}
          />
        </Modal.Body>
      </Modal>
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

// -- CONSTANTS --
const status = ["maybe", "yes", "no"]
const availabilityColors: ["warning", "success", "danger"] = ["warning", "success", "danger"]
