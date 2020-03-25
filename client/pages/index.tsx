import React, { useState, useEffect, useReducer } from "react"
import { HashRouter, Switch, Route, Redirect } from "react-router-dom"
import Login from "./Login"
import Season from "./Season"
import ErrorPage from "./Error"
import AdminLogin from "./AdminLogin"
import axios from "axios"
import { club } from "../constants"

// FOR TESTING:
import Test from "./Test"


const reducerHome = (state, action) => {
  switch(action.type) {
    case "login": {
      if(typeof action.payload === "undefined")
        throw new Error("Action payload not specified: login")

      let user = action.payload
      return { ...state, loggedIn: true, user: user}
    }
    case "logout": {
      return { ...state, loggedIn: false, user: {}}
    }
    case "setMeta": {
      if(typeof action.payload === "undefined")
        throw new Error("Action payload not specified: login")
      return { ...state, meta: action.payload}
    }
    default: throw new Error("Action type not recognised!: reducerHome")
  }
}

const initState = (init: {loggedIn: boolean}) => ({
  loggedIn: init.loggedIn,
  meta: {
    season: undefined
  },
  user: {
    admin: undefined,
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    name: undefined,
    email: undefined
  }
})

export default function() {
  const [state, dispatch] = useReducer(reducerHome, {loggedIn: false}, initState)
  const [homeElement, setHomeElement] = useState(null)

  const logout = () => {
    dispatch({type: "logout", payload: {admin: false}})
  }

  const authorise = (authorised: boolean, user: {admin: boolean, firstName: string, lastName: string, name: string, id: string}) => {
    if(authorised)
      dispatch({type: "login", payload: user})
    else {
      dispatch({type: "logout"})
    }
  }

  /*useEffect(() => {
    setHomeElement( 
      
    )
  }, [state.user])*/

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
                <Season user={state.user} defaultSeasonId={state.meta.season ? state.meta.season : "5e1f11fb73c95e11de2ea91e"}/>
              ) : (
                <Login login={(user) => authorise(true, user)} />
              )}
            </Route>
            <Route exact path="/admin">
              <h1>ADMIN</h1>
            </Route>
            <Route exact path="/admin/login">
              {state.loggedIn ? (
                <Redirect to="/" />
              ) : (
                <AdminLogin onLogin={(user) => authorise(true, user)} onError={(err) => alert("Error Loggin in: " + err.toString())}/>
              )}
            </Route>
            <Route exact path="/test">
              <Test />
            </Route>
            <Route exact path="/error">
              <ErrorPage />
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
