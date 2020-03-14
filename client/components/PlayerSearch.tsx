import React from "react"
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

interface PlayerSearch {
  fixtureTitle: string;
  seasonTitle: string;
  competitionTitle: string;

}

const playerSearchSchema = object().shape({
  search: string()
    .max(20, "Maximum of 20 characters")
    .trim()
    .ensure(),
  available: boolean()
})

export default (props: PlayerSearch) => {

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
          <Breadcrumb.Item>{props.seasonTitle}</Breadcrumb.Item>
          <Breadcrumb.Item>{props.competitionTitle}</Breadcrumb.Item>
          <Breadcrumb.Item active={true}>{props.fixtureTitle}</Breadcrumb.Item>
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
            <Form.Check className="font-italic" name="available" type="checkbox" checked={formik.values.available} label="Available Players" onChange={formik.handleChange} isInvalid={formik.errors.available ? true : false}/>
          </InputGroup>
        </Form>
      </Container>
      <Container className="w-75">
        <ListGroup className="p-2">
          <ListGroup.Item className="d-flex">
              <Col xs={9} sm={9}>Result</Col><Col>Input</Col>
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