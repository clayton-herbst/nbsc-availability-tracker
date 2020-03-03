import React, { useEffect, useState } from "react"
import Nav from "react-bootstrap/Nav"

export default props => {
  const [items, setItems] = useState(defaultState[0])

  console.log("competition nav children:")
  console.log(props.children)

  useEffect(() => {
    if (typeof props.children === "undefined") return
    console.log("competition nav children:")
    console.log(props.children)
    setItems(
      props.children.map((value, index) => {
        return (
          <Nav.Item key={index} className="border rounded">
            <Nav.Link eventKey={index}>{value.title}</Nav.Link>
          </Nav.Item>
        )
      })
    )
  }, [props.children])

  return (
    <Nav
      activeKey="0"
      justify="true"
      navbar="true"
      variant="pills"
      className="d-flex flex-column"
    >
      {items}
      <Nav.Item key="2">
        <Nav.Link eventKey="2">Test Item</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

const defaultState = [
  <Nav.Item key="5">
    <Nav.Link eventKey="5">Title</Nav.Link>
  </Nav.Item>
]
