import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Menu from "./Menu";

export default props => {
  return (
    <Navbar className="w-100" bg="light" variant="light">
      <Container className="m-auto">
        <div className="d-flex justify-content-between">
          <h1 className="text-center w-100" style={{ color: "maroon" }}>
            {props.title}
          </h1>
        </div>
        <Menu />
      </Container>
    </Navbar>
  );
};
