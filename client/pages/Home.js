import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Container from "react-bootstrap/Container";
import { useRouteMatch } from "react-router-dom";

export default props => {
  console.log(props);
  let state = {
    match: useRouteMatch()
  };

  console.log(state["match"]);
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/player">Season</Breadcrumb.Item>
        <Breadcrumb.Item href="/player/cup">Cup</Breadcrumb.Item>
        <Breadcrumb.Item active>Availability</Breadcrumb.Item>
      </Breadcrumb>
    </Container>
  );
};
