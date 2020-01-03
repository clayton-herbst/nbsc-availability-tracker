import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "popper.js";
import Home from "./pages/Home";
import Header from "./components/Header";
import { FacebookProvider, LoginButton } from "react-facebook";
import Container from "react-bootstrap/Container";
import Title from "./components/Title";

const handleResponse = data => {
  console.log(data);
};

const handleError = error => {
  this.setState({ error });
};

const App = props => {
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(undefined);

  if (typeof error != "undefined") return <h1>THERE HAS BEEN AN ERROR!</h1>;

  let value = false;
  if (value)
    return (
      <FacebookProvider appId="474015373186319">
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
              //style={{padding: '0px', 'border-style': 'none'}}
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
      </FacebookProvider>
    );
  else
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/">
              <div>
                <Header />
                <Home />
              </div>
            </Route>
          </Switch>
        </div>
      </HashRouter>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
