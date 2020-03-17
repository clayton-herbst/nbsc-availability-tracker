import React, { useEffect, useState } from "react"
import Nav from "react-bootstrap/Nav"

interface CompetitionNav {
  competitions: any[];
}

export default (props: CompetitionNav) => {
  const [items, setItems] = useState(undefined)

  // COMMENTS
  console.log("competition nav children:")
  console.log(props.competitions)

  useEffect(() => {
    if (typeof props.competitions === "undefined") return

    // COMMENTS
    console.log("competition nav children:")
    console.log(props.competitions)
    setItems(
      props.competitions.map((value, index) => {
        return (
          <Nav.Item key={index} className="rounded p-1 my-1 mx-auto w-75">
            <Nav.Link eventKey={value.id}>{value.title}</Nav.Link>
          </Nav.Item>
        )
      })
    )
  }, [props.competitions])

  return (
    <Nav
      activeKey="0"
      justify={true}
      navbar={true}
      variant="pills"
      className="d-flex flex-column"
    >
      {items}
    </Nav>
  )
}
