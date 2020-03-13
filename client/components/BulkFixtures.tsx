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

interface BulkFixtures {
  title?: string,
  onClose?: any,
  onSave: any
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
      row: [{title: "", home: "", away: "", date: undefined, location: ""}]
    },
    onSubmit: () => {
      alert(formik.values.row)
      props.onSave()
    },
    validateOnBlur: true,
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
            <Col>
              <Form.Control
                name={`row.${index}.title`}
                as="input"
                type="text"
                value={formik.values.row[index].title}
                onChange={formik.handleChange}
                placeholder="Title"
              />
            </Col>
            <Col>
              <Form.Control
                name={`row.${index}.home`}
                as="input"
                type="text"
                value={formik.values.row[index].home}
                onChange={formik.handleChange}
                placeholder="Home Team"
              />
            </Col>
            <Col>
              <Form.Control
                name={`row.${index}.away`}
                as="input"
                type="text"
                value={formik.values.row[index].away}
                onChange={formik.handleChange}
                placeholder="Away Team"
              />
            </Col>
            <Col>
              <Form.Control
                name={`row.${index}.date`}
                as="input"
                type="date"
                value={formik.values.row[index].date}
                onChange={formik.handleChange}
                placeholder="Date"
              />
            </Col>
            <Col>
              <Form.Control
                name={`row.${index}.location`}
                value={formik.values.row[index].location}
                onChange={formik.handleChange}
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
          <h4
            className="mx-auto py-2 mt-2 text-center align-middle"
            style={{ color: club.color }}
          >
            {props.title}
          </h4>
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