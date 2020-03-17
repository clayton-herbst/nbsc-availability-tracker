/**
 * Contains the components that facilitate the necessary data to be collected within a modal and submitted to the cloud.
 * State of surrounding components should be capable of updated as well.
 */

import React from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useFormik } from "formik"
import { object, string, date, array } from "yup"
import { club } from "../constants"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import axios from "axios"


const fixtureSchema = object({
  title: string().required("Field required"),
  home: string().required("Field required"),
  away: string().required("Field required"),
  date: date() // date
    .required("Field required"),
  location: string().required("Field required"),
  description: string().notRequired()
})

interface FixtureForm {
  onSave?: any; // function
  onClose?: any;
  initialValues?: {
    title: string,
    home: string,
    away: string,
    date: string,
    location: string,
    description: string
  };
  title?: string;
  competition: string;
  onSaveError?: any;
}

export const FixtureForm = (props: FixtureForm) => {
  /**
   * Paramater's:
   * {
   *   edit: ["add" | "edit" ],
   *   initialValues: object,
   *   onSave: function, // In addition to the api requests. State management etc.
   *
   * }
   */

  /**
   * Implement REDUX state manager.
   * Fields:
   *  - Button text
   *  - onSubmit function (api endpoint)
   *  -
   */

  // Handles the collection of data for a new fixture

  let setFormInitialValues = () => {
    if (typeof props.initialValues !== "undefined") {
      return {
        title:
          typeof props.initialValues.title !== "undefined"
            ? props.initialValues.title
            : "",
        home:
          typeof props.initialValues.home !== "undefined"
            ? props.initialValues.home
            : "",
        away:
          typeof props.initialValues.away !== "undefined"
            ? props.initialValues.away
            : "",
        date:
          typeof props.initialValues.date !== "undefined"
            ? props.initialValues.date
            : "",
        location:
          typeof props.initialValues.location !== "undefined"
            ? props.initialValues.location
            : "",
        description:
          typeof props.initialValues.description !== "undefined"
            ? props.initialValues.description
            : ""
      }
    } else {
      return {
        title: "",
        home: "",
        away: "",
        date: "",
        location: "",
        description: ""
      }
    }
  }

  let formik = useFormik({
    initialValues: setFormInitialValues(),
    onSubmit: (values) => {
      requestAddFixture({competition: props.competition, fixture: values})
        .then(() => {
          props.onSave()
          props.onClose()
        })
      .catch(() => {
        props.onSaveError ? props.onSaveError() : null
      })
    },
    validationSchema: fixtureSchema,
    validateOnBlur: true,
    validateOnChange: false
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
        <Form.Group className="my-2 px-2">
          <Form.Control
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            isInvalid={formik.errors.title ? true : false}
            placeholder="Title"
          />
          {formik.errors.title ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Control
            name="home"
            value={formik.values.home}
            onChange={formik.handleChange}
            isInvalid={formik.errors.home ? true : false}
            placeholder="Home Team"
          />
          {formik.errors.home ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.home}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Control
            name="away"
            value={formik.values.away}
            onChange={formik.handleChange}
            isInvalid={formik.errors.away ? true : false}
            placeholder="Away Team"
          />
          {formik.errors.away ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.away}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Control
            name="date"
            as="input"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            isInvalid={formik.errors.date ? true : false}
            placeholder="Date"
          />
          {formik.errors.date ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.date}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Control
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            isInvalid={formik.errors.location ? true : false}
            placeholder="Location"
          />
          {formik.errors.location ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.location}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        {typeof props.onSave === "function" ? (
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
        ) : (
          ""
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

interface SeasonForm {
  title?: string;
  onSave?: any;
  onClose?: any; 
  initialValues?: {
    title: string,
    start: string,
    end: string
  }
}

export const SeasonForm = (props: SeasonForm) => {
  // Handles the collection of data for a new season

  let formik = useFormik({
    initialValues: {
      title: "",
      start: "",
      end: ""
    },
    onSubmit: () => {
      props.onSave()
      props.onClose()
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
        <Form.Group className="my-2 px-2">
          <Form.Control
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            isInvalid={formik.errors.title ? true : false}
            placeholder="Title"
          />
          {formik.errors.title ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Label className="font-weight-bold">Start Date</Form.Label>
          <Form.Control
            name="start"
            as="input"
            type="date"
            value={formik.values.start}
            onChange={formik.handleChange}
            isInvalid={formik.errors.start ? true : false}
          />
          {formik.errors.start ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.start}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Label className="font-weight-bold">End Date</Form.Label>
          <Form.Control
            name="end"
            as="input"
            type="date"
            value={formik.values.end}
            onChange={formik.handleChange}
            isInvalid={formik.errors.end ? true : false}
          />
          {formik.errors.end ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.end}
            </Form.Control.Feedback>
          ) : (
            ""
          )}
        </Form.Group>
        <Container className="d-flex justify-content-around">
          {typeof props.onSave === "function" ? (
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
          ) : (
            ""
          )}
        </Container>
      </Form>
    </Container>
  )
}

interface CompetitionForm {
  title?: string;
  onSave: any; // function
  onClose?: any; // function
  season: string;
}

const competitionSchema = object({
  title: string().required("Field required"),
  description: string().required("Field required"),
  start: date()
    .required("Field required"),
  end: date() // date
    .required("Field required")
})

export const CompetitionForm = (props: CompetitionForm) => {

  let titleStyle = {color: "maroon"}
  let style = { maxWidth: 300 }

  let formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      start: "",
      end: "",
    },
    onSubmit: values => {
      let competition = {
        title: values.title,
        start: values.start,
        end: values.end,
        description: values.description,
        fixtures: []
      }
      requestAddCompetition({competition: competition, season: props.season})
        .then(() => {
          props.onSave()
          props.onClose()
        })
        .catch(err=>alert("error"))
    },
    validateOnBlur: true,
    validationSchema: competitionSchema
  })

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
        <Form.Group className="my-2 px-2">
          <Form.Control
            className="my-1"
            name="title"
            as="input"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            isInvalid={formik.errors.title ? true : false}
            placeholder="Title"
          />
          {formik.errors.title ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          ) : "" }
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Control
            className="my-1"
            name="description"
            as="input"
            type="text"
            value={formik.values.description}
            onChange={formik.handleChange}
            isInvalid={formik.errors.description ? true : false}
            placeholder="Short Description"
            maxLength={200}
          />
          {formik.errors.description ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          ) : "" }
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Label className="font-weight-bold">Start Date</Form.Label>
          <Form.Control
            className="my-1"
            name="start"
            as="input"
            type="date"
            value={formik.values.start}
            onChange={formik.handleChange}
            isInvalid={formik.errors.start ? true : false}
          />
          {formik.errors.start ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.start}
            </Form.Control.Feedback>
          ) : "" }
        </Form.Group>
        <Form.Group className="my-2 px-2">
          <Form.Label className="font-weight-bold">End Date</Form.Label>
          <Form.Control
            className="my-1"
            name="end"
            as="input"
            type="date"
            value={formik.values.end}
            onChange={formik.handleChange}
            isInvalid={formik.errors.end ? true : false}
          />
          {formik.errors.end ? (
            <Form.Control.Feedback type="invalid">
              {formik.errors.end}
            </Form.Control.Feedback>
          ) : "" }
        </Form.Group>
        <Form.Group className="my-3 d-flex justify-content-around">
          <Button size="sm" type="submit" variant="outline-success">Save</Button>
        </Form.Group>
      </Form>
    </Container>
  )
}

const requestAddCompetition = (meta: {competition: any, season: string}) => {
  return (
    axios
      .post("/api/admin/addCompetition", {
        competition: meta.competition,
        season: meta.season
      })
  )
}

const requestAddFixture = (meta: {competition: string, fixture: any}) => {
  return (
    axios
      .post("/api/admin/addFixture", {
        competition: meta.competition,
        fixture: meta.fixture
      })
  )
}
