import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default () => {
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand style={{ color: "blue" }}>
        North Beach Soccer Club
      </Navbar.Brand>
      <Nav>
        <Nav.Item className="px-2">
          <Link className="text-info text-decoration-none" to="">
            Availability
          </Link>
        </Nav.Item>
        <Nav.Item className="px-2">
          <Link className="text-info text-decoration-none" to="round">
            Round
          </Link>
        </Nav.Item>
        <Nav.Item className="px-2">
          <Link className="text-info text-decoration-none" to="type">
            Type
          </Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};
