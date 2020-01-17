import React from "react"
import Nav from "react-bootstrap/Nav"

export default () => {
  return (
    <div className="d-inline p-2">
      <div>
        <Nav defaultActiveKey="0">
          <Nav.Link eventKey="0" href="#/">
            Home
          </Nav.Link>
          <Nav.Link eventKey="1" onClick={() => window.history.back()}>
            Back
          </Nav.Link>
        </Nav>
      </div>
    </div>
  )
}
