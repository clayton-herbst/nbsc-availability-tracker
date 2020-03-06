/**
 * Handle Components within the header / main navigation bar
 */
import React, { useState, useEffect } from "react"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Menu from "./Menu"
import Dropdown from "react-bootstrap/Dropdown"
import { DropdownButton } from "react-bootstrap"

export default props => {
  const [seasons, setSeasons] = useState(props.seasons)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (typeof props.seasons === "undefined") return

    setSeasons(
      props.seasons.map((value, index) => (
        <Dropdown.Item
          key={index}
          href={`#/season/${value.id}`}
          active={active === index}
          onClick={() => {
            setActive(index)
          }}
        >
          {value.title}
        </Dropdown.Item>
      ))
    )
  }, [props.seasons])

  return (
    <Navbar className="w-100" bg="light" variant="light">
      <Container className="m-auto">
        <div className="d-flex justify-content-between">
          <h1 className="text-center w-100" style={{ color: "maroon" }}>
            {props.title}
          </h1>
        </div>
        <div className="mx-auto">
          <DropdownButton variant="outline-secondaray" size="lg" title="Season">
            <Dropdown drop="down">
              {seasons}
              <Dropdown.Item>another</Dropdown.Item>
              <Dropdown.Item>another</Dropdown.Item>
            </Dropdown>
          </DropdownButton>
        </div>
        <Menu />
      </Container>
    </Navbar>
  )
}
