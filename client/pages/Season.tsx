import React, { useState, useEffect, useReducer } from "react"
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


const reducerSeason = (state, action) => {
  switch(action.type) {
    case "setSeason": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified!: seasonSelect")
      return {...state, season: action.payload}
    }
    case "setCompetition": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified!: competitionSelect")
      return {...state, competition: action.payload}
    }
    case "alertSuccess": {
      return {...state, success: true}
    }
    case "alertError": {
      return {...state, error: true}
    }
    case "clearAlert": {
      return {...state, success: false, error: false}
    }
    case "view": {
      // set what pane is visible
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified! :: view")
      return {...state, pane: action.payload}
    }
    case "updateSeasons": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: updateSeasons")
      return {...state, seasons: action.payload}
    }
    case "updateCompetitions": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: updateCompetitionss")
      return {...state, competitions: action.payload}
    }
    case "updateFixtures": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: updateFixtures")
      return {...state, fixtures: action.payload}
    }
    case "reset": {
      return initState(action.payload)
    }
    default: throw new Error("dispatch action error: season reducer. " + action.type)
  }
}

const initState = (values: {season?: string, competition?: string, seasons?: object, competitions?: object, fixtures?: object, pane?: string}) => {
  return {
    season: values.season,
    competition: values.competition,
    fixtures: values.fixtures,
    competitions: values.competitions,
    seasons: values.seasons,
    pane: values.pane,
    success: false,
    error: false
  }
}

export default (props: Season) => {

  // STATE
  const [state, dispatch] = useReducer(reducerSeason, {}, initState)
  const [fetchSeasons, toggleFetchSeasons] = useState(true)
  const [availability, setAvailability] = useState(undefined)
  const [fixtureList, setFixtureList] = useState(undefined)
  const [fetchCompetitions, toggleFetchCompetitions] = useState(true)
  const [fetchFixtures, toggleFetchFixtures] = useState(true)
  const [addFixtureModal, setAddFixtureModal] = useState(false) // add new fixture pop-up
  const [addSeasonModal, setAddSeasonModal] = useState(false) // add new season pop-up
  const [addCompetitionModal, setAddCompetitionModal] = useState(false)

  console.log(`season id: ${state.season}`)
  console.log(`active: ${state.competition}`)

  const save = () => {
    if (typeof state.competitions === "undefined" || typeof state.competition === "undefined")
      return

    console.log("save function meta:")
    console.log("competitions:" + state.competitions)
    console.log(`active: ${state.competition}`)

    // SAVE EVENT
    let meta = {
      player: player.id,
      season: state.season,
      competition: state.competition,
      availability: availability,
      alert: {success: state.success, error: state.error}
    }

    let functions = {success: () => dispatch({type: "alertSuccess"}), error: () => dispatch({type: "alertError"}), reset: () => dispatch({type: "clearAlert"})} // replace with reducer state

    requestSave(meta, functions)
  }

  // MUTATOR METHODS
  // NOT IDEAL AS RERENDER MAKES EXTRA CALLS
  useEffect(() => {
    requestAllSeasons({setSeasons: (payload: object) => dispatch({type: "updateSeasons", payload: payload})})
  }, [fetchSeasons])

  useEffect(() => {
    // DYNAMICALLY UPDATE LIST OF COMPETITIONS FOR A PARTICULAR SEASON
    if (typeof state.season === "undefined")
      return // noop

    let meta = { season: state.season }
    let functions = {setCompetitions: (payload: object) => dispatch({type: "updateCompetitions", payload: payload})}
    requestCompetitions(meta, functions)
  }, [state.season, fetchCompetitions])

  useEffect(() => {
    // RETRIEVE SELECTED COMPETITION FIXTURE DATA AND PLAYER AVAILABILITY

    let info = { competitions: state.competitions, competition: state.competition, season: state.season, player: player }
    let functions = {setFixtures: (payload: object) => dispatch({type: "updateFixtures", payload: payload}), setAvailability: setAvailability }
    requestFixture(info, functions) // update fixtures
  }, [state.competition, fetchFixtures])

  const createFixtureComponent = (meta: {fixtures: any, availability: number[], availabilityColors: string[]}, functions: {setFixtureList: any, setAvailability: any, onSearch: any, onEdit: any}): void => {
    if (typeof meta.fixtures === "undefined")
      return

    functions.setFixtureList(
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
                functions.setAvailability([...availability])
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
    if(typeof state.fixtures === "undefined" || typeof availability === "undefined")
      return
    
    let meta = {
      fixtures: state.fixtures,
      availability: availability,
      availabilityColors: availabilityColors
    }
    let functions = {
      setFixtureList: setFixtureList,
      setAvailability: setAvailability,
      onSearch: () => dispatch({type: "view", payload: "search"}),
      onEdit: () => alert("edit")
    }

    createFixtureComponent(meta, functions) // dynamically render new fixtures based on fetched fixtures
  }, [availability, state.fixtures])

  if(typeof state.season === "undefined" || state.season === "") {
    return (
      <div>
        <Header player="Clayton" title={club.name} seasons={state.seasons} onHome={() => dispatch({type: "reset", payload: {seasons: state.seasons}})} defaultSeasonId={props.defaultSeasonId} onSeasonSelect={(id: string) => dispatch({type: "setSeason", payload: id})}/>
        <Container>
          <SeasonSelectStatic />
        </Container>
      </div>
    )
  } else
  return (
    <div>
      <Header player="Clayton" title={club.name} seasons={state.seasons} onHome={() => dispatch({type: "reset", payload: {seasons: state.seasons}})} defaultSeasonId={props.defaultSeasonId}
        onSeasonSelect={(id: string) => {
          dispatch({type: "setSeason", payload: id})
          dispatch({type: "setCompetition", payload: "0"}) // don't pre-select :: => action.type: competitionPage?
          dispatch({type: "view", payload: "none"})
        }}
      />
      <Tab.Container
        id="season_competitions"
        defaultActiveKey="0"
        activeKey={state.competition}
        onSelect={key => {
          dispatch({type: "setCompetition", payload: key})
          dispatch({type: "view", payload: "fixtures"})
        }}
      >
        <Row>
          <Col sm={3}>
            <CompetitionNav competitions={state.competitions} />
            <Container className="mt-2 pt-2 d-flex justify-content-center">
              <DropdownButton className="m-1 p-1" drop="down" variant="outline-secondary" title="Admin" id="admin_options">
                <Dropdown.Item eventKey={state.competition} onClick={() => setAddCompetitionModal(true)}>Add Competition</Dropdown.Item>
                <Dropdown.Item eventKey={state.competition} onClick={() => setAddFixtureModal(true)}>Add Fixture</Dropdown.Item>
                <Dropdown.Item eventKey={state.competition} onClick={() => setAddSeasonModal(true)}>Add Season</Dropdown.Item>
              </DropdownButton>
            </Container>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="0">
                <CompetitionSelectStatic />
              </Tab.Pane>
              <Container hidden={state.pane !== "search"}>
                <PlayerSearch fixtureTitle="fixture" seasonTitle="season" competitionTitle="competition" />
              </Container>
              <Container hidden={state.pane !== "fixtures"}>
                <FixtureContainer admin={true} fixtures={fixtureList} onAvailabilitySave={save} competition={state.competition} onClose={() => toggleFetchFixtures(!fetchFixtures)} reset={() => dispatch({type: "clearAlert"})} success={() => dispatch({type: "alertSuccess"})} error={() => dispatch({type: "alertError"})} />
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
          <FixtureForm competition={state.competition}
            onSave={() => {
              dispatch({type: "alertSuccess"})
              setTimeout(() => dispatch({type: "clearAlert"}), 2000)
              setAddFixtureModal(false)
            }}
            onClose={() => toggleFetchFixtures(!fetchFixtures)}
            onError={() => {
              dispatch({type: "alertError"})
              setTimeout(() => dispatch({type: "clearAlert"}), 2000)
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
              dispatch({type: "alertSuccess"})
              setTimeout(() => dispatch({type: "clearAlert"}), 2000)
              setAddSeasonModal(false)
            }}
            onClose={() => toggleFetchSeasons(!fetchSeasons)}
            onError={() => {
              dispatch({type: "alertError"})
              setTimeout(() => dispatch({type: "clearAlert"}), 2000)
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
          <CompetitionForm season={state.season} 
            onSave={() => {
              dispatch({type: "alertSuccess"})
              setTimeout(() => dispatch({type: "clearAlert"}), 2000)
              setAddCompetitionModal(false)
            }}
            onClose={() => toggleFetchCompetitions(!fetchCompetitions)}
            onError={() => {
              dispatch({type: "alertError"})
              setTimeout(() => dispatch({type: "clearAlert"}), 2000)
            }}
          />
        </Modal.Body>
      </Modal>
      <div className="position-relative">
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={state.success}
            onClose={() => dispatch({type: "clearAlert"})}
            dismissible={true}
            variant="success"
          >
            <strong className="text-success">Saved your progress!</strong>
          </Alert>
        </div>
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={state.error}
            dismissible={true}
            onClose={() => dispatch({type: "clearAlert"})}
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
