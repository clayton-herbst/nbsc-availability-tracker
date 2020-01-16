import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import { FacebookProvider } from "react-facebook"
import "bootstrap/dist/css/bootstrap.min.css"
import "jquery"
import "popper.js"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Fixture from "./pages/Fixture"
import axios from "axios"
import { club } from "./constants"

const App = () => {
  const [loggedIn, toggleLogin] = useState(true)
  const [meta, setMeta] = useState("")
  const [activeSeason, setActiveSeasons] = useState(0)
  const [fetch, setFetch] = useState(0) // allows for singular / initial api request
  const [auth, setAuth] = useState("player")

  useEffect(() => {
    axios.get(`/api/club/${club.id}`).then(res => {
      setMeta(res.data)
      setActiveSeasons(res.data.activeSeason)
    })
  }, [fetch])

  return (
    <FacebookProvider appId="474015373186319">
      <HashRouter>
        <div className="h-100 w-100">
          <Switch>
            <Route exact path={["/", "/:id"]}>
              {loggedIn ? (
                <Home
                  auth={auth}
                  meta={meta ? meta : defaultHome.meta}
                  activeSeason={activeSeason}
                />
              ) : (
                <Login />
              )}
            </Route>
            <Route path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/fixture/:seasonId/:competitionId">
              <Fixture />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </FacebookProvider>
  )
}

const defaultHome = {
  meta: {
    title: "default"
  },
  seasons: []
}

ReactDOM.render(<App />, document.getElementById("root"))
