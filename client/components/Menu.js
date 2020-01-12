import React from "react"
import Nav from "react-bootstrap/Nav"

export default () => {
  return (
    <div className="d-inline p-2">
      <div>
        <Nav defaultActiveKey="/home">
          <Nav.Link href="/home">Active</Nav.Link>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav>
      </div>
    </div>
  )
}
