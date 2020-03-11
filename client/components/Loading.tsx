/**
 * Standardised loading component with spinning widget.
 */
import React from "react"
import Container from "react-bootstrap/Container"

interface Loading {
  text?: string
}

export default (props: Loading) => {
  return (
    <Container>
      <div className="d-flex justify-content-center">
        <div className="spinner-border m-auto" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      <div className="text-center p-1 my-1">{props.text || ""}</div>
    </Container>
  )
}
