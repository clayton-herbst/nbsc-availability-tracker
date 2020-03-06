/**
 * Standardised loading component with spinning widget.
 */
import React from "react"
import Container from "react-bootstrap/Container"

export default props => {
  return (
    <Container>
      <div className="d-flex justify-content-center">
        <div className="spinner-border m-auto" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      <div className="text-center">{props.text ? <p>{props.text}</p> : ""}</div>
    </Container>
  )
}
