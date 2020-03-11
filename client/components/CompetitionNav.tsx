import React, { useEffect, useState } from "react"
import Nav from "react-bootstrap/Nav"

interface CompetitionNav {
  children?: any;
}

export default (props: CompetitionNav) => {
  const [items, setItems] = useState(defaultState[0])

  // COMMENTS
  console.log("competition nav children:")
  console.log(props.children)

  useEffect(() => {
    if (typeof props.children === "undefined") return

    // COMMENTS
    console.log("competition nav children:")
    console.log(props.children)
    setItems(
      props.children.map((value, index) => {
        return (
          <Nav.Item key={index} className="rounded p-1 my-1 mx-auto w-75">
            <Nav.Link eventKey={value.id}>{value.title}</Nav.Link>
          </Nav.Item>
        )
      })
    )
  }, [props.children])

  return (
    <Nav
      activeKey="0"
      justify={true}
      navbar={true}
      variant="pills"
      className="d-flex flex-column"
    >
      {items}
      <Nav.Item className="rounded p-1 my-1 mx-auto w-75">
        <Nav.Link eventKey="2">Test Item</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

// -- TESTING --
const defaultState = [
  <Nav.Item key="5">
    <Nav.Link eventKey="5">Title</Nav.Link>
  </Nav.Item>
]
