import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import { Formik, FieldArray } from "formik"
import Button from "react-bootstrap/Button"
import { useFormik } from "formik"
import { object, string, date, array } from "yup"
import { club } from "../constants"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Loading from "./Loading"
import Badge from "react-bootstrap/Badge"
import axios from "axios"
import Title from "./Title"

interface BulkFixtures {
  title?: string; // display default title formating
  onError: any; // alert state management
  onSave: any; // alert & visibility state management
  competition: string
}

const fixtureSchema = object().shape({
  title: string().required("Field required"),
  home: string().required("Field required"),
  away: string().required("Field required"),
  date: date() // date
    .required("Field required"),
  location: string().required("Field required"),
})

const bulkFixturesSchema = object().shape({
  row: array().of(fixtureSchema)
})

export default (props: BulkFixtures) => {

  let [entries, addEntry] = useState([{title: "", home: "", away: "", date: undefined, location: ""}])
  let [formRows, setFormRows] = useState(undefined)
  
  let formik = useFormik({
    initialValues: {
      row: [{title: "", home: "", away: "", date: "", location: ""}]
    },
    onSubmit: (values) => {
      requestAddBulkFixtures({competition: props.competition, fixtures: values.row})
        .then(resp => {
          if (typeof resp.data.ok === "undefined") {
            props.onError()
          } else if (resp.data.ok === true) {
            props.onSave()
          } else {
            props.onError()
          }
        })
        .catch(() => {
          props.onError()
        })
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: bulkFixturesSchema
  })

  // VALIDATION NOT WORKING !

  useEffect(() => {

    setFormRows(
      entries.map((item, index) => {
        return (
          <Form.Row className="py-2" key={index}>
            <div className="my-auto">
              <Badge className="align-middle" variant="secondary">{index+1}</Badge>
            </div>
            <Col sm="3">
              <Form.Control
                className="my-1"
                name={`row.${index}.title`}
                as="input"
                type="text"
                value={formik.values.row[index].title}
                size="sm"
                onChange={formik.handleChange}
                placeholder="Title"
              />
            </Col>
            <Col sm="2">
              <Form.Control
                className="my-1"
                name={`row.${index}.home`}
                as="input"
                type="text"
                size="sm"
                value={formik.values.row[index].home}
                onChange={formik.handleChange}
                placeholder="Home Team"
              />
            </Col>
            <Col sm="2">
              <Form.Control
                className="my-1"
                name={`row.${index}.away`}
                as="input"
                type="text"
                size="sm"
                value={formik.values.row[index].away}
                onChange={formik.handleChange}
                placeholder="Away Team"
              />
            </Col>
            <Col sm="2">
              <Form.Control
                className="my-1"
                name={`row.${index}.date`}
                as="input"
                type="date"
                size="sm"
                value={formik.values.row[index].date}
                onChange={formik.handleChange}
                placeholder="Date"
              />
            </Col>
            <Col sm="2">
              <Form.Control
                className="my-1"
                name={`row.${index}.location`}
                value={formik.values.row[index].location}
                onChange={formik.handleChange}
                size="sm"
                placeholder="Location"
              />
            </Col>
          </Form.Row>
        )
      })
    )
  }, [formik.values, entries])

  return (
    <Container>
      {props.title ? (
        <Container>
          <Title style={{ color: club.color }} title="Add Bulk Fixtures" size="sm"/>
        </Container>
      ) : (
        ""
      )}
      <Form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
        <Container>
          {formRows}
          <Form.Row className="py-2">
            <div className="my-auto">
              <Badge className="align-middle" variant="secondary" onClick={() => {
                addEntry([... entries, {title: "", home: "", away: "", date: "", location: ""}])
                formik.values.row.push({title: "", home: "", away: "", date: "", location: ""})
              }}> + </Badge>
            </div>
          </Form.Row>
        </Container>
        <Container>
          <Container className="d-flex justify-content-around my-2">
            <Button type="submit" variant="outline-success" font-weight-bold="text-center">Save</Button>
          </Container>
        </Container>
      </Form>
    </Container>
  )
}

const requestAddBulkFixtures = (meta: {competition: string, fixtures: object[]}) => {
  return (
    axios
      .post("/api/admin/addBulkFixtures", {
        competition: meta.competition,
        fixtures: meta.fixtures
      })
  )
}