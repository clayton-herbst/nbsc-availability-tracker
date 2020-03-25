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
import ModalForm from "../components/ModalForm"


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
      let alert = {...state.alert, success: true}
      return {...state, alert}
    }
    case "alertError": {
      let alert = {...state.alert, error: true}
      return {...state, alert}
    }
    case "clearAlert": {
      return {...state, alert: {success: false, error: false}}
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
    case "fetchFixtures": {
      let fetch = {...state.fetch, fixtures: !state.fetch.fixtures} // toggle
      return {...state, fetch: fetch}
    }
    case "fetchCompetitions": {
      let fetch = {...state.fetch, competitions: !state.fetch.competitions} // toogle
      return {...state, fetch: fetch}
    }
    case "fetchSeasons": {
      let fetch = {...state.fetch, seasons: !state.fetch.seasons} // toggle
      return {...state, fetch: fetch}
    }
    case "fixtureModal": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: fixtureModal")
      let addFixture = {...state.modal.addFixture, show: action.payload.show, values: action.payload.values}
      let modal = {...state.modal, addFixture: addFixture}
      return {...state, modal: modal}
    }
    case "seasonModal": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: seasonModal")
      let addSeason = {...state.modal.addSeason, show: action.payload.show}
      let modal = {...state.modal, addSeason: addSeason}
      return {...state, modal: modal}
    }
    case "competitionModal": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: competitionModal")
      let addCompetition = {...state.modal.addCompetition, show: action.payload.show}
      let modal = {...state.modal, addCompetition: addCompetition}
      return {...state, modal: modal}
    }
    case "updateAvailability": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: updateAvailability")
      return {...state, availability: action.payload}
    }
    case "setPlayers": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified :: setPlayers")
      return {...state, players: action.payload}
    }
    default: throw new Error("dispatch action error: season reducer. " + action.type)
  }
}

const initState = (values: {season?: string, competition?: string, seasons?: object, competitions?: object, fixtures?: object, pane?: string, players?: object}) => ({
  season: values.season,
  competition: values.competition,
  fixtures: values.fixtures,
  competitions: values.competitions,
  seasons: values.seasons,
  pane: values.pane,
  availability: [],
  alert: {
    success: false,
    error: false
  },
  fetch: {
    seasons: false,
    competitions: false,
    fixtures: false
  },
  modal: {
    addFixture: {
      show: false,
      values: undefined
    },
    addSeason: {
      show: false
    },
    addCompetition: {
      show: false
    }
  },
  players: values.players
})

export default (props: Season) => {

  // STATE
  const [state, dispatch] = useReducer(reducerSeason, {season: props.defaultSeasonId}, initState)
  const [fixtureList, setFixtureList] = useState(undefined)
  
  console.log(`season id: ${state.season}`)
  console.log(`active: ${state.competition}`)

  const saveAvailability = () => {
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
      availability: state.availability,
      alert: {success: state.alert.success, error: state.alert.error}
    }

    let functions = {success: () => dispatch({type: "alertSuccess"}), error: () => dispatch({type: "alertError"}), reset: () => dispatch({type: "clearAlert"})} // replace with reducer state

    requestSave(meta, functions)
  }

  // MUTATOR METHODS
  // NOT IDEAL AS RERENDER MAKES EXTRA CALLS
  useEffect(() => {
    requestAllSeasons({setSeasons: (payload: object) => dispatch({type: "updateSeasons", payload: payload})})
  }, [state.fetch.seasons])

  useEffect(() => {
    // DYNAMICALLY UPDATE LIST OF COMPETITIONS FOR A PARTICULAR SEASON
    if (typeof state.season === "undefined")
      return // noop

    let meta = { season: state.season }
    let functions = {setCompetitions: (payload: object) => dispatch({type: "updateCompetitions", payload: payload})}
    requestCompetitions(meta, functions)
  }, [state.season, state.fetch.competitions])

  useEffect(() => {
    // RETRIEVE SELECTED COMPETITION FIXTURE DATA AND PLAYER AVAILABILITY

    let info = { competitions: state.competitions, competition: state.competition, season: state.season, player: player }
    let functions = {setFixtures: (payload: object) => dispatch({type: "updateFixtures", payload: payload}), setAvailability: (payload) => dispatch({type: "updateAvailability", payload: payload})}
    requestFixture(info, functions) // update fixtures
  }, [state.competition, state.fetch.fixtures])

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
          <div key={index}>
            <FixtureCard
              key={item._id}
              round={index + 1}
              location={item.location}
              date={dateString}
              title={item.title}
              color={meta.availabilityColors[meta.availability[index]]}
              onSearch={() => functions.onSearch(index)}
              onEdit={() => functions.onEdit({
                index: index,
                title: item.title,
                home: item.home.title,
                away: item.away.title,
                date: item.date,
                location: item.location
              })}
              onChange={() => {
                meta.availability[index] = (meta.availability[index] + 1) % 3
                functions.setAvailability([...meta.availability])
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
    if(typeof state.fixtures === "undefined" || typeof state.availability === "undefined")
      return
    
    console.log(state.availability)

    let meta = {
      fixtures: state.fixtures,
      availability: state.availability,
      availabilityColors: availabilityColors
    }
    let functions = {
      setFixtureList: setFixtureList,
      setAvailability: (payload) => dispatch({type: "updateAvailability", payload: payload}),
      onSearch: (index) => {
        fetchPlayers({competition: state.competition, index: index}, {setPlayers: (payload) => dispatch({type: "setPlayers", payload: payload})})
        dispatch({type: "view", payload: "search"})
        
      },
      onEdit: (values) => dispatch({type: "fixtureModal", payload: {show: true, values: values}})
    }

    createFixtureComponent(meta, functions) // dynamically render new fixtures based on fetched fixtures
  }, [state.availability, state.fixtures])

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
          //dispatch({type: "setCompetition", payload: "-1"}) // don't pre-select :: => action.type: competitionPage?
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
                <Dropdown.Item eventKey={state.competition} onClick={() => dispatch({type: "competitionModal", payload: {show: true}})}>Add Competition</Dropdown.Item>
                <Dropdown.Item eventKey={state.competition} onClick={() => dispatch({type: "fixtureModal", payload: {show: true}})}>Add Fixture</Dropdown.Item>
                <Dropdown.Item eventKey={state.competition} onClick={() => dispatch({type: "seasonModal", payload: {show: true}})}>Add Season</Dropdown.Item>
              </DropdownButton>
            </Container>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="0">
                <CompetitionSelectStatic />
              </Tab.Pane>
              <Tab.Pane eventKey={state.competition} active={state.pane === "search"}>
                <PlayerSearch show={state.pane === "search"} players={state.players} fixture={{title:"fixtures", index: 0}} season={{title: "season"}} competition={{title: "competition", id: state.competition}} onError={() => {dispatch({type: "alertError"}); setTimeout(() => dispatch({type: "clearAlert"}), 2000)}} />
              </Tab.Pane>
              <Tab.Pane eventKey={state.competition} active={state.pane === "fixtures"}>
                <FixtureContainer admin={true} fixtures={fixtureList} onAvailabilitySave={saveAvailability} competition={state.competition} onClose={() => dispatch({type: "fetchFixtures"})} reset={() => dispatch({type: "clearAlert"})} success={() => dispatch({type: "alertSuccess"})} error={() => dispatch({type: "alertError"})} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <ModalForm
        show={state.modal.addFixture.show}
        onHide={() => dispatch({type: "fixtureModal", payload: {show: false}})}
        title="Add Fixture"
        component={
          <div>
            <FixtureForm competition={state.competition}
              initialValues={state.modal.addFixture.values}
              onSave={() => {
                dispatch({type: "alertSuccess"})
                setTimeout(() => dispatch({type: "clearAlert"}), 2000)
                dispatch({type: "fixtureModal", payload: {show: false}})
              }}
              onClose={() => dispatch({type: "fetchFixtures"})}
              onError={() => {
                dispatch({type: "alertError"})
                setTimeout(() => dispatch({type: "clearAlert"}), 2000)
              }}
            />
          </div>
        }  
      />
      <ModalForm
        show={state.modal.addSeason.show}
        onHide={() => dispatch({type: "seasonModal", payload: {show: false}})}
        title="Add Season"
        component={
          <div>
            <SeasonForm
              onSave={() => {
                dispatch({type: "alertSuccess"})
                setTimeout(() => dispatch({type: "clearAlert"}), 2000)
                dispatch({type: "seasonModal", payload: {show: false}})
              }}
              onClose={() => dispatch({type: "fetchSeasons"})}
              onError={() => {
                dispatch({type: "alertError"})
                setTimeout(() => dispatch({type: "clearAlert"}), 2000)
              }}
            />
          </div>
        }
      />
      <ModalForm
        show={state.modal.addCompetition.show}
        onHide={() => dispatch({type: "competitionModal", payload: {show: false}})}
        title="Add Competition"
        component={
          <div>
            <CompetitionForm season={state.season} 
              onSave={() => {
                dispatch({type: "alertSuccess"})
                setTimeout(() => dispatch({type: "clearAlert"}), 2000)
                dispatch({type: "competitionModal", payload: {show: false}})
              }}
              onClose={() => dispatch({type: "fetchCompetitions"})}
              onError={() => {
                dispatch({type: "alertError"})
                setTimeout(() => dispatch({type: "clearAlert"}), 2000)
              }}
            />
          </div>
        }
      />
      <div className="position-relative">
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={state.alert.success}
            onClose={() => dispatch({type: "clearAlert"})}
            dismissible={true}
            variant="success"
          >
            <strong className="text-success">Saved your progress!</strong>
          </Alert>
        </div>
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={state.alert.error}
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

const fetchPlayers = (meta: {competition: string, index: number}, functions: {setPlayers: any}) => {
  axios
    .post("/api/admin/fixturePlayers", {
      competition: meta.competition,
      index: meta.index
    })
    .then((resp: any) => {
      functions.setPlayers(resp.data.players)
    })
    .catch((err) => console.log(err))
}