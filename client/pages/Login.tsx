import React, { useState, useEffect, useReducer } from "react"
import Container from "react-bootstrap/Container"
import Title from "../components/Title"
import Button from "react-bootstrap/Button"
import { facebook } from "../constants/index"
import Loading from "../components/Loading"
import axios from "axios"

/*const handleResponse = data => {
  console.log(data)
  alert(data)
}*/

interface LoginPage {
  login: any;
}

declare global {
  interface Window {
    FB: any
  }
}

const reducerLogin =(state, action) => {
  switch(action.type) {
    case 'facebookReady': {
      window.FB.init({
        appId: facebook.id,
        status: true,
        xfbml: true,
        version: "v2.7",
        frictionlessRequests: true
      })
      return {... state, facebookReady: true}
    }
    case 'loginStatusUpdate': {
      window.FB.getLoginStatus(response => {
        if (response.status === "connected") {
          console.log(response.authResponse)
        }
      })
      return {... state}
    }
    case 'error': {
      return {...state, error: true}
    }
    default: throw new Error("unhandled dispatch: login page")
  }
}

export default function(props: LoginPage) {
  const [state, dispatch] = useReducer(reducerLogin, {facebookSDK: false, error: false})

  useEffect(function(): void {
    if (typeof window.FB !== "undefined") dispatch({type: "facebookReady"})
  }, [window.FB])

  const handleFacebookLogin = async function(userId: string, tokenId: string) {
    try {
      window.FB.api(
        `/${userId}`,
        "GET",
        { fields: "first_name,email,last_name" },
        response => {
          console.log(response)
          axios
            .post("/user/register", {
              first_name: response.first_name,
              last_name: response.last_name,
              email: response.email,
              facebookID: response.id
            })
            .then(value => {
              console.log(value.data)
              if (!value.data.ok) console.log("error with value")
              else {
                // SUCCESS
                props.login()
              }
            })
        }
      )
    } catch (err) {
      console.log(err)
    }
  }

  // RENDER
  if (state.error)
    return <h1>THERE HAS BEEN AN ERROR!</h1>
  /*else if (typeof facebookSDK === "undefined") {
    setTimeout(() => {
      setFacebookSDK(window.FB)
    }, 1000)
    return (
      <div>
        <Container className="my-5 p-5 mx-auto">
          <Title size="lg" title="North Beach Soccer Club" style={{ color: "#800000" }} />
          <Loading text="Loading page ..." />
        </Container>
      </div>
    )
  }*/
  else
    return (
      <Container className="my-5 p-5 mx-auto">
        <Title size="lg" title="North Beach Soccer Club" style={{ color: "#800000" }} />
        <p className="text-weight-ligher text-center">
          Welcome to the player availability tracker.
          <br />
          Please <strong>sign-in</strong> below.
        </p>
        <Container className="d-flex flex-row justify-content-sm-center mx-auto">
          <div className="p-2">
            <Button
              size="lg"
              variant="outline-primary"
              className="border-0"
              onClick={() => {
                window.FB.login(
                  response => {
                    console.log(response)
                    if (response.status === "connected")
                      console.log("facebook connected")
                    handleFacebookLogin(
                      response.authResponse.userID,
                      response.authResponse.accessToken
                    )
                  },
                  { scope: "public_profile, email" }
                )
              }}
            >
              Facebook
            </Button>
          </div>
          <div className="p-2">
            <Button
              size="lg"
              className="border-0"
              variant="outline-dark"
              href="#/admin/login"
            >
              Administrator
            </Button>
          </div>
        </Container>
      </Container>
    )
}
