/**
 * Handle Components within the header / main navigation bar
 */
import React, { useState, useEffect } from "react"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Menu from "./Menu"
import Dropdown from "react-bootstrap/Dropdown"
import { DropdownButton } from "react-bootstrap"

interface Header {
  onSeasonSelect?: any;
  defaultSeasonId?: string;
  seasons: any;
  title: string;
  player?: string;
}

export default function(props: Header): any {
  const [seasonComponents, setSeasonComponents] = useState()
  const [active, setActive] = useState(props.defaultSeasonId)

  useEffect(() => {
    if (typeof props.seasons === "undefined") return

    setSeasonComponents(
      props.seasons.map((value, index) => (
        <Dropdown.Item
          key={index}
          eventKey={value.id}
          active={active === value.id}
          onClick={() => {
            setActive(value.id)
            if(typeof props.onSeasonSelect !== "undefined")
              props.onSeasonSelect(value.id)
          }}
        >
          {value.title}
        </Dropdown.Item>
      ))
    )
  }, [props.seasons, active])

  return (
    <Navbar className="w-100" bg="light" variant="light">
      <Container className="m-auto">
        <div className="d-flex justify-content-between">
          <h1 className="text-center w-100" style={{ color: "maroon" }}>
            {props.title}
          </h1>
        </div>
        <div className="mx-auto">
          <DropdownButton id="season_select" variant="outline-secondary" title="Season">
            <Dropdown drop="down">
              {seasonComponents}
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
