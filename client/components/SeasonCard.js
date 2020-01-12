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
    <div className={`border rounded mx-2 mt-2 p-2 ${props.className}`}>
      <div>
        <Container className="text-center px-2">
          <div className="d-flex justify-content-around">
            <h4 className="font-weight-bold">
              {props.meta.title ? props.meta.title : "No title"}
            </h4>
          </div>
          <p
            className={`text-capitalize font-italic ${textColor(
              props.meta.status
            )}`}
          >
            {props.meta.status ? props.meta.status : ""}
          </p>
        </Container>
        {props.children}
      </div>
    </div>
  )
}
