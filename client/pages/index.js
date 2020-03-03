import React, { useState, useEffect } from "react"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import Home from "./Home"
import Login from "./Login"
import Season from "./Season"
import Error from "./Error"
import AdminLogin from "./AdminLogin"
import axios from "axios"
import { club } from "../constants"
import EventEmitter from "events"

export default () => {
  const [loggedIn, toggleLogin] = useState(true)
  const [meta, setMeta] = useState("")
  const [admin, setAdmin] = useState(true)

  const myEmitter = new EventEmitter()
  myEmitter.on("authorised", (permission = false) => {
    if (permission) setAdmin(true)
    else setAdmin(false)

    toggleLogin(true)
  })

  myEmitter.on("logout", () => {
    toggleLogin(false)
  })

  useEffect(() => {
    axios.get(`/api/club/${club.id}`).then(res => {
      setMeta(res.data)
    })
  }, [])

  return (
    <div>
      <HashRouter>
        <div>
          <Switch>
            <Route exact path={["/", "/season/:id"]}>
              {loggedIn && typeof admin !== "undefined" ? (
                <Season />
              ) : (
                <Login login={() => myEmitter.emit("authorised")} />
              )}
            </Route>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/season/:season_id/:competition">
              <Home admin={admin} meta={meta ? meta : defaultHome.meta} />
            </Route>
            <Route exact path="/admin/login">
              {loggedIn ? (
                <Redirect to="/" />
              ) : (
                <AdminLogin login={() => myEmitter.emit("authorised", true)} />
              )}
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
  seasons: []
}
