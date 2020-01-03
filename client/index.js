import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { FacebookProvider } from "react-facebook";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "popper.js";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";

const App = props => {
  let value = true;

  return (
    <FacebookProvider appId="474015373186319">
      <HashRouter>
        <div>
          <Switch>
            <Route exact path="/">
              {value ? <Redirect to="/player" /> : <Login />}
            </Route>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route
              path="/player"
              render={() => {
                return (
                  <div>
                    <Header player="Clayton" />
                    <Home />
                  </div>
                );
              }}
            />
          </Switch>
        </div>
      </HashRouter>
    </FacebookProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
