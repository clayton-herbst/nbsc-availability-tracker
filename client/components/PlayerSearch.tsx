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
  onError: any;
}

const playerSearchSchema = object().shape({
  search: string()
    .max(20, "Maximum of 20 characters")
    .trim()
    .ensure(),
  available: boolean()
})

const reducerSearch = (state, action) => {
  switch(action.type) {
    case "setPlayers": {
      let display = action.payload.forEach(value => { // initial display
        if(value.availability !== 1)
          return {name: value.fullname, availability: value.availability}
      })
      console.log(display)
      return {...state, players:action.payload, display: display}
    }
    case "showUnavailable": {
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
  players: values.players,
  display: []
})

export default (props: PlayerSearch) => {
  const [state, dispatch] = useReducer(reducerSearch, {}, initSearchState)

  useEffect(() => {
    if(typeof props.competition.id === "undefined")
      return 
    
    let meta = {
      competition: props.competition.id,
      index: props.fixture.index
    }

    fetchPlayers(meta)
      .then((data: any) => {
        if(data.ok === true)
          dispatch({type: "setPlayers", payload: data.players})
      })
      .catch((err) => {
        props.onError()
      })
  }, [state.fetch.players, props.competition.id])


  let formik = useFormik({
    initialValues: {
      search: "",
      available: false
    },
    onSubmit: (values) => {
      alert(`${values.search} | ${values.available}`)
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: playerSearchSchema
  })

  let searchBarStyle = {
    maxWidth: 500
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
          <InputGroup className="py-2 mx-auto d-flex justify-content-sm-center" style={searchBarStyle}>
            <Form.Check className="font-italic" name="available" type="checkbox" checked={formik.values.available} label="Show All" onChange={formik.handleChange} isInvalid={formik.errors.available ? true : false}/>
          </InputGroup>
        </Form>
      </Container>
      <Container className="w-75">
        <ListGroup className="p-2">
          <ListGroup.Item className="d-flex">
            <Col xs={9} sm={9}>{typeof state.display[0] !== "undefined" ? state.display[0].name : ""}</Col><Col>No</Col>
          </ListGroup.Item>
          <ListGroup.Item>Result</ListGroup.Item>
          <ListGroup.Item>Result</ListGroup.Item>
          <ListGroup.Item>Result</ListGroup.Item>
          <ListGroup.Item>Result</ListGroup.Item>
          <ListGroup.Item>Result</ListGroup.Item>
        </ListGroup>
      </Container>
    </Container>
  )
}