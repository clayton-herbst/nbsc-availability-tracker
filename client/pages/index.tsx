import React, { useState, useEffect } from "react"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import Login from "./Login"
import Season from "./Season"
import Error from "./Error"
import AdminLogin from "./AdminLogin"
import axios from "axios"
import { club } from "../constants"

// FOR TESTING:
import Test from "./Test"

export default function() {
  const [loggedIn, toggleLogin] = useState(true)
  const [meta, setMeta] = useState({season: ""})
  const [admin, setAdmin] = useState(true)

  const logout = function(): void {
    toggleLogin(false)
  }

  console.log(meta)

  const authorise = function(authorised: boolean, admin: boolean): void {
    if(authorised) {
      toggleLogin(true)
      setAdmin(admin)
    }
    else {
      toggleLogin(false)
      setAdmin(false)
    }
  }

  useEffect(function(): void {
    axios.get(`/api/club/${club.id}`).then(res => {
      setMeta(res.data)
    })
  }, [])

  return (
    <div>
      <HashRouter>
        <div>
          <Switch>
            <Route exact path={["/"]}>
              {loggedIn ? (
                <Season defaultSeasonId={meta.season ? meta.season : "5e1f11fb73c95e11de2ea91e"}/>
              ) : (
                <Login login={() => authorise(true, false)} />
              )}
            </Route>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/admin/login">
              {loggedIn ? (
                <Redirect to="/" />
              ) : (
                <AdminLogin login={() => authorise(true, true)} />
              )}
            </Route>
            <Route exact path="/test">
              <Test />
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
    </div>
  )
}

const defaultHome = {
  meta: {
    title: "loading ..."
  },
}
