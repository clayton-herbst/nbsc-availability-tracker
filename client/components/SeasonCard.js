import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export default props => {
  console.log(props.style);

  return (
    <div className="border rounded mr-4 mt-2">
      <Container className="text-center p-3">
        <h1>{props.meta.title ? props.meta.title : err.title}</h1>
        <p>{props.meta.desc ? props.meta.desc : err.desc}</p>
        {props.meta.button ? <Button>{props.meta.button}</Button> : err.button}
      </Container>
      {props.children}
    </div>
  );
};

let err = {
  title: "No title",
  desc: "No description provided",
  button: ""
};
