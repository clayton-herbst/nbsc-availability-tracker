import React from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"

export default props => {
  console.log(props.style)

  return (
    <div className="border shadow rounded-lg m-1 p-2 w-25">
      <Container className="text-center p-3">
        <h1>{props.meta.title ? props.meta.title : err.title}</h1>
        <div>
          <p>{props.meta.date ? Date(props.meta.date) : err.date}</p>
        </div>
        <div>
          <p>{props.meta.location ? props.meta.location : err.location}</p>
        </div>
        <div>
          {props.meta.button ? (
            <Button>{props.meta.button}</Button>
          ) : (
            err.button
          )}
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
