/**
 * Controls how elements within individual cards are displayed.
 */
import React from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"

// -- CONSTANTS --
const status = ["maybe", "yes", "no"]
const availabilityColors: ["warning", "success", "danger"] = ["warning", "success", "danger"]


interface FixtureCard {
  key?: number,
  round: number,
  location: string,
  date: string,
  title: string,
  color: string,
  children?: any,
  onChange?: any, // availability change function
  availability: number,
  onEdit?: any // edit function
  onSearch?: any // search function
}

export default (props: FixtureCard) => {
  return (
    <div
      className={`border shadow rounded-lg mb-4 mx-1 p-2 border-${availabilityColors[props.availability]}`}
    >
      <Container className="text-center p-2">
        <h5 className="font-weight-bold">
          {props.title ? props.title : err.title}
        </h5>
        <p className="font-italic">
          Round: <strong>{props.round}</strong>
        </p>
        <div>
          <p>{props.date ? props.date : err.date}</p>
        </div>
        <div>
          <p>{props.location ? props.location : err.location}</p>
        </div>
      </Container>
      <div>
        <div className="d-flex justify-content-around">
          <Button
            className="text-capitalize"
            variant={availabilityColors[props.availability]}
            onClick={props.onChange}
          >
            {status[props.availability]}
          </Button>
        </div>
        <Container className="d-flex justify-content-sm-between mt-2 pt-2 border-top">
          <Button
              className="text-capitalize"
              variant="outline-secondary"
              onClick={props.onSearch}
              size="sm"
            >
              Available
            </Button>
            <Button
              className="text-capitalize"
              variant="outline-warning"
              onClick={props.onEdit}
              size="sm"
            >
              Edit
            </Button>
          </Container>
      </div>
    </div>
  )
}

let err = {
  title: "No title",
  date: "Unknown date",
  location: "No location provided",
  button: ""
}


// {props.children}
// - DEPRECATED --

/**
 Description:
 * Display all information related to a fixture within this component.
 * Meta-data provided through props

 Props:
 * meta: {
    title: string,
    location: string,
    id: string,
    status: string,
    date: number
  }
 */
