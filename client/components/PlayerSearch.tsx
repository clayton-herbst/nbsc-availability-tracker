import React, { useEffect, useReducer } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Button from "react-bootstrap/Button"
import { useFormik } from "formik"
import { object, string, required, boolean } from "yup"
import ListGroup from "react-bootstrap/ListGroup"
import axios from "axios"
import ToggleButton from "react-bootstrap/ToggleButton"

interface PlayerSearch {
  fixture: {
    index: number,
    id?: string,
    title: string
  };
  season: {
    title: string
  };
  competition: {
    id: string,
    title: string
  };
  players: any,
  onError: any;
  show: boolean
}

const playerSearchSchema = object().shape({
  search: string()
    .max(20, "Maximum of 20 characters")
    .trim()
    .ensure()
})

const reducerSearch = (state, action) => {
  switch(action.type) {
    /*case "setPlayers": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified!: setPlayers")

      let display = action.payload.forEach(value => { // initial display
        console.log(value)
        if(value.availability !== 1)
          return {name: value.fullname, availability: value.availability}
      })
      console.log("------------")
      console.log(display)
      return {...state, players: action.payload, display: display}
    }*/
    case "setDisplay": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified!: setDisplay")
      
      let display = action.payload.filter(value => value.availability !== 1)
      
      return {...state, display: display}
    }
    case "showUnavailable": {
      if(typeof action.payload === "undefined")
        throw new Error("No action payload specified!: showUnavailable")
      let display = action.payload.forEach(value => { // initial display
        if(value.availability !== 1) // unavailable and maybe only
          return {name: value.fullname, availability: value.availability}
      })
      return {...state, display: display}
    }
    case "showAll": {
      let display = action.payload.forEach(value => { // initial display
        return {name: value.fullname, availability: value.availability}
      })
      return {...state, display: display}
    }
    case "updateList": {
      if(typeof action.payload === "undefined" || action.payload.length === 0)
        return {...state, list: undefined}
      
      let list = action.payload.filter((value) => typeof value !== "undefined")
        return {...state, list: list}
    }
    default: throw new Error("dispatch action error: season reducer. " + action.type)
  }
}

const fetchPlayers = (meta: {competition: string, index: number}) => {
  return axios.post("/api/admin/fixturePlayers", {
    competition: meta.competition,
    index: meta.index
  })
}

const initSearchState = (values: {players?: object}) => ({
  fetch: {
    players: false
  },
  display: [],
  list: undefined
})

export default (props: PlayerSearch) => {
  const [state, dispatch] = useReducer(reducerSearch, {}, initSearchState)

  console.log(state)

  useEffect(() => {
    if(typeof props.players === "undefined" || props.players.length <= 0)
      return 
    console.log(props.players)
    
    dispatch({type: "setDisplay", payload: props.players})
  }, [props.players, props.show])
  //state.fetch.players, props.competition.id

  useEffect(() => {
    console.log(state.display)
    if(typeof state.display === "undefined" || state.display.length === 0)
      return dispatch({type: "updateList", payload: undefined})
    
    let list = state.display.map((value, index) => {
      return (
        <ListGroup.Item key={index} className="d-flex">
          <Col xs={9} sm={9} className="align-middle"><p className="text-capitalize font-weight-bold">{value.fullname}</p></Col>
          <Col className="text-capitalize text-center">
            <Button variant="info" disabled={true} block={true} size="sm" className="text-capitalize">
              {availabilityString[value.availability]}
            </Button>
          </Col>
        </ListGroup.Item>
      )
    })

    dispatch({type: "updateList", payload: list})
  }, [state.display])


  let formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      alert(`${values.search}`)
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: playerSearchSchema
  })

  let searchBarStyle = {
    maxWidth: 400
  }

  return (
    <Container>
      <Container className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item>{props.season.title}</Breadcrumb.Item>
          <Breadcrumb.Item>{props.competition.title}</Breadcrumb.Item>
          <Breadcrumb.Item active={true}>{props.fixture.title}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>
      <Container>
        <Form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
          <InputGroup className="py-2 mx-auto" style={searchBarStyle}>
            <Form.Control name="search" value={formik.values.search} onChange={formik.handleChange} isInvalid={formik.errors.search ? true : false}/>
            <InputGroup.Append>
              <Button size="sm" type="submit" variant="outline-secondary">Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Container>
      <Container className="d-flex justify-content-center">
        <input className="font-italic m-2" id="showAll" type="checkbox" checked={true} value="Available Change" onChange={() => alert("change")} />
        <span>Available Players</span>
      </Container>
      <Container style={{maxWidth: 500}}>
        {typeof state.list === "undefined" ? (
          <Container className="my-2 p-1 text-center">No Results</Container>
        ) : (
          <ListGroup variant="flush" className="p-2">
            {state.list}
          </ListGroup>
        )}
        
      </Container>
    </Container>
  )
}

const availabilityString = ["maybe", "yes", "no"]