/**
 * DEPRECATED
 */
import React from "react"
import Container from "react-bootstrap/Container"

export default props => {
  const textColor = status => {
    if (typeof status === "undefined") return ""
    else if (status.toUpperCase() === "ONGOING") return "text-success"
    else if (status.toUpperCase() === "RETIRED") return "text-warning"
    else return ""
  }

  return (
    <div className={`border rounded m-2 p-2 ${props.className}`}>
      <div>
        <Container className="text-center px-2">
          <div className="d-flex justify-content-around">
            <p className="font-weight-bold">
              {props.meta.title ? props.meta.title : "No title"}
            </p>
          </div>
          <p
            className={`text-capitalize font-italic ${textColor(
              props.meta.description
            )}`}
          >
            {props.meta.description ? props.meta.description : ""}
          </p>
        </Container>
        {props.children}
      </div>
    </div>
  )
}
