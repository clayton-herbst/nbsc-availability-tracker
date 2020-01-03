import React, { useState } from "react";
import { LoginButton } from "react-facebook";
import Container from "react-bootstrap/Container";
import Title from "../components/Title";

const handleResponse = data => {
  console.log(data);
};

export default () => {
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(undefined);

  if (typeof error != "undefined") return <h1>THERE HAS BEEN AN ERROR!</h1>;

  console.log(data);

  return (
    <Container>
      <Title />
      <p className="text-weight-ligher text-center">
        Welcome to the player availability tracker.
        <br />
        Please <strong>sign-in</strong> below.
      </p>
      <Container className="d-flex justify-content-center mx-auto">
        <LoginButton
          className="border-0"
          onError={error => setError(error)}
          onCompleted={data => {
            handleResponse(data);
            setData(data);
          }}
        >
          <div
            className="fb-login-button"
            data-width=""
            data-size="medium"
            data-button-type="login_with"
            data-auto-logout-link="false"
            data-use-continue-as="true"
          ></div>
        </LoginButton>
      </Container>
    </Container>
  );
};
