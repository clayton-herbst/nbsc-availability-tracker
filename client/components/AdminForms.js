/**
 * Contains the components that facilitate the necessary data to be collected within a modal and submitted to the cloud.
 * State of surrounding components should be capable of updated as well.
 */

import React from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useFormik } from "formik"
import { object, string, date } from "yup"
import { club } from "../constants"

const fixtureSchema = object({
  title: string().required("Field required"),
  home: string().required("Field required"),
  away: string().required("Field required"),
  date: date() // date
    .required("Field required"),
  location: string().required("Field required"),
  description: string().notRequired()
})

export const FixtureForm = props => {
  // Handles the collection of data for a new fixture

  let formik = useFormik({
    initialValues: {
      title: "",
      home: "",
      away: "",
      date: "",
      location: "",
      description: ""
    },
    onSubmit: () => {
      alert("submitted fixture")
    },
    validationSchema: fixtureSchema,
    validateOnBlur: true
  })

  let style = { maxWidth: 300 }

  return (
    <Container style={style}>
      {props.title ? (
        <Container>
          <h4
            className="mx-auto pt-2 text-center align-middle"
            style={{ color: club.color }}
          >
            Add Fixture
          </h4>
        </Container>
      ) : (
        ""
      )}
      <Form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
        <Form.Group className="">
          <Form.Row className="my-2 px-2">
            <Form.Control
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              isInvalid={formik.errors.title}
              placeholder="Title"
            />
            {formik.errors.title ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.title}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
          <Form.Row className="my-2 px-2">
            <Form.Control
              name="home"
              value={formik.values.home}
              onChange={formik.handleChange}
              isInvalid={formik.errors.home}
              placeholder="Home Team"
            />
            {formik.errors.home ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.home}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
          <Form.Row className="my-2 px-2">
            <Form.Control
              name="away"
              value={formik.values.away}
              onChange={formik.handleChange}
              isInvalid={formik.errors.away}
              placeholder="Away Team"
            />
            {formik.errors.away ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.away}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
          <Form.Row className="my-2 px-2">
            <Form.Control
              name="date"
              as="input"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              isInvalid={formik.errors.date}
              placeholder="Date"
            />
            {formik.errors.date ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.date}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
          <Form.Row className="my-2 px-2">
            <Form.Control
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              isInvalid={formik.errors.location}
              placeholder="Location"
            />
            {formik.errors.location ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.location}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
        </Form.Group>
        {props.onSave ? (
          ""
        ) : (
          <Container className="d-flex justify-content-around">
            <Button
              className="p-2"
              size="sm"
              type="submit"
              variant="outline-success"
            >
              Add
            </Button>
          </Container>
        )}
      </Form>
    </Container>
  )
}

const seasonSchema = object({
  title: string().required("Field required"),
  start: date().notRequired(), //date
  end: date() //date
    .notRequired()
  // "status" is featured in the schema as a hidden field
})

export const SeasonForm = props => {
  // Handles the collection of data for a new season

  let formik = useFormik({
    initialValues: {
      title: "",
      start: "",
      end: ""
    },
    onSubmit: () => {
      alert("submitted season")
    },
    validationSchema: seasonSchema,
    validateOnBlur: true
  })

  let style = { maxWidth: 300 }

  return (
    <Container style={style}>
      {props.title ? (
        <Container>
          <h4
            className="mx-auto pt-2 text-center align-middle"
            style={{ color: club.color }}
          >
            Add Season
          </h4>
        </Container>
      ) : (
        ""
      )}
      <Form onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
        <Form.Group className="mx-auto">
          <Form.Row className="my-2 px-2">
            <Form.Control
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              isInvalid={formik.errors.title}
              placeholder="Title"
            />
            {formik.errors.title ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.title}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
          <Form.Row className="my-2 px-2">
            <Form.Label className="font-weight-bold">Start Date</Form.Label>
            <Form.Control
              name="start"
              as="input"
              type="date"
              value={formik.values.start}
              onChange={formik.handleChange}
              isInvalid={formik.errors.start}
            />
            {formik.errors.start ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.start}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
          <Form.Row className="my-2 px-2">
            <Form.Label className="font-weight-bold">End Date</Form.Label>
            <Form.Control
              name="end"
              as="input"
              type="date"
              value={formik.values.end}
              onChange={formik.handleChange}
              isInvalid={formik.errors.end}
            />
            {formik.errors.end ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.end}
              </Form.Control.Feedback>
            ) : (
              ""
            )}
          </Form.Row>
        </Form.Group>
        <Container className="d-flex justify-content-around">
          {props.onSave ? (
            ""
          ) : (
            <Container className="d-flex justify-content-around">
              <Button
                className="p-2"
                size="sm"
                type="submit"
                variant="outline-success"
              >
                Add
              </Button>
            </Container>
          )}
        </Container>
      </Form>
    </Container>
  )
}
