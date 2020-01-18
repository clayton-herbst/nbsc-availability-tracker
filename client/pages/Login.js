import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Title from "../components/Title"
import Button from "react-bootstrap/Button"
import { facebook } from "../constants/index"

const handleResponse = data => {
  console.log(data)
  alert(data)
}

export default () => {
  const [error, setError] = useState(undefined)
  const [data, setData] = useState(undefined)
  const [fetch, setFetch] = useState()
  const [fbState, setFB] = useState(undefined)

  useEffect(() => {
    window.FB.init({
      appId: facebook.id,
      status: true,
      xfbml: true,
      version: "v2.7",
      frictionlessRequests: true
    })

    console.log("here")
    window.FB.getLoginStatus(res => {
      console.log(res)
    })
  }, [fetch])

  useEffect(() => {
    window.FB.getLoginStatus(response => {
      if (response.status === "connected") alert(response.status)
      console.log(response)
    })
  }, [fbState])

  if (typeof error !== "undefined")
    return <h1>THERE HAS BEEN AN ERROR! {error.toString()}</h1>

  console.log(data)

  console.log(window.FB)

  return (
    <Container className="my-5 p-5 mx-auto">
      <Title title="North Beach Soccer Club" style={{ color: "#800000" }} />
      <p className="text-weight-ligher text-center">
        Welcome to the player availability tracker.
        <br />
        Please <strong>sign-in</strong> below.
      </p>
      <Container className="d-flex flex-row justify-content-sm-center mx-auto">
        <Button
          className="border-0"
          onClick={() => {
            window.FB.login(
              response => {
                console.log(response)
                if (response.status === "connected") setFB(true)
              },
              { scope: "public_profile, email" }
            )
          }}
        >
          Facebook
        </Button>
        <div className="m-2 w-25">
          <Button size="sm" variant="light" href="#/admin/login">
            Login as admin
          </Button>
        </div>
      </Container>
    </Container>
  )
}

const fb_login_button = (
  <div
    className="fb-login-button"
    data-width=""
    data-size="medium"
    data-button-type="login_with"
    data-auto-logout-link="false"
    data-use-continue-as="true"
  ></div>
)
