import React from "react"
import Container from "react-bootstrap/Container"

export default props => {
  console.log(props.style)

  return (
    <div className="border shadow rounded-lg m-1 p-2">
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
      {props.children}
    </div>
  )
}

let err = {
  title: "No title",
  date: "Unknown date",
  location: "No location provided",
  button: ""
}

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
