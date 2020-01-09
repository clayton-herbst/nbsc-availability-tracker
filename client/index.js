import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { FacebookProvider } from "react-facebook";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "popper.js";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Fixture from "./pages/Fixture";

const App = () => {
  let value = false;

  return (
    <FacebookProvider appId="474015373186319">
      <HashRouter>
        <div>
          <Switch>
            <Route exact path="/">
              {value ? <Redirect to="/player" /> : <Login />}
            </Route>
            <Route path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/player" component={Home} />
            <Route exact path="/player/cup" component={Home} />
            <Route exact path="/player/fixture" component={Fixture} />
          </Switch>
        </div>
      </HashRouter>
    </FacebookProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
