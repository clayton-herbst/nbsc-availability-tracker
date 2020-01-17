import React, { useState, useEffect } from "react"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import { FacebookProvider } from "react-facebook"
import Home from "./Home"
import Login from "./Login"
import Fixture from "./Fixture"
import Error from "./Error"
import axios from "axios"
import { club } from "../constants"

export default () => {
  const [loggedIn, toggleLogin] = useState(true)
  const [meta, setMeta] = useState("")
  const [fetch, setFetch] = useState(0) // allows for singular / initial api request
  const [auth, setAuth] = useState("player")

  useEffect(() => {
    axios.get(`/api/club/${club.id}`).then(res => {
      setMeta(res.data)
    })
  }, [fetch])

  return (
    <FacebookProvider appId="474015373186319">
      <HashRouter>
        <div>
          <Switch>
            <Route exact path={["/", "/season/:id"]}>
              {loggedIn ? (
                <Home auth={auth} meta={meta ? meta : defaultHome.meta} />
              ) : (
                <Login />
              )}
            </Route>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/fixture/:season_id/:competition_id">
              <Fixture />
            </Route>
            <Route exact path="/error">
              <Error />
            </Route>
            <Route path="*">
              <Redirect to="/error" />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </FacebookProvider>
  )
}

const defaultHome = {
  meta: {
    title: "loading ..."
  },
  seasons: []
}
