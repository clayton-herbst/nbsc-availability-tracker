import React, { useState, useEffect, useReducer } from "react"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import Login from "./Login"
import Season from "./Season"
import Error from "./Error"
import AdminLogin from "./AdminLogin"
import axios from "axios"
import { club } from "../constants"

// FOR TESTING:
import Test from "./Test"


const reducerHome = (state, action) => {
  switch(action.type) {
    case "login": {
      return { ...state, loggedIn: true, admin: action.payload.admin}
    }
    case "logout": {
      return { ...state, loggedIn: false, admin: false}
    }
    case "setMeta": {
      return { ...state, meta: action.payload}
    }
  }
}

export default function() {
  const [state, dispatch] = useReducer(reducerHome, {loggedIn: false, meta: {}, admin: false})

  const logout = function(): void {
    dispatch({type: "logout", payload: {admin: false}})
  }

  const authorise = function(authorised: boolean, admin: boolean): void {
    if(authorised)
      dispatch({type: "login", payload: {admin: admin}})
    else {
      dispatch({type: "logout"})
    }
  }

  useEffect(function(): void {
    axios.get(`/api/club/${club.id}`)
      .then(res => {
        dispatch({type: "setMeta", payload: res.data})
      })
  }, [])

  return (
    <div>
      <HashRouter>
        <div>
          <Switch>
            <Route exact path={["/"]}>
              {state.loggedIn ? (
                <Season defaultSeasonId={state.meta.season ? state.meta.season : "5e1f11fb73c95e11de2ea91e"}/>
              ) : (
                <Login login={() => authorise(true, false)} />
              )}
            </Route>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/admin/login">
              {state.loggedIn ? (
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
