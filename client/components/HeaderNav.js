import React, { useState, useEffect } from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom"
import Dropdown from "react-bootstrap/Dropdown"

export default props => {
  const [seasons, setSeasons] = useState(props.seasons)

  useEffect(() => {
    if (typeof props.seasons === "undefined") return

    setSeasons(
      props.seasons.map((value, index) => (
        <Dropdown.Item key={index} href={`#/season/${value.id}`}>
          {value.title}
        </Dropdown.Item>
      ))
    )
  }, [props.seasons])

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand style={{ color: "blue" }}>
        North Beach Soccer Club
      </Navbar.Brand>
      <Nav>
        <Nav.Item className="px-2">
          <Link className="text-info text-decoration-none" to="player">
            Player
          </Link>
        </Nav.Item>
        <Nav.Item className="px-2">
          <Link className="text-info text-decoration-none" to="admin" disable>
            Admin
          </Link>
        </Nav.Item>
      </Nav>
      <Container className="d-flex flex-row justify-content-end align-items-center">
        <div>
          <Dropdown drop="down">{seasons}</Dropdown>
        </div>
        <div className="px-2">
          <p className="d-inline">{props.player}</p>
        </div>
        <div className="px-2 align-bottom">
          <Button className="px-2 d-inline" variant="outline-danger">
            Logout
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}
