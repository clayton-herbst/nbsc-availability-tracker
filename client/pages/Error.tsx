import React from "react"
import Container from "react-bootstrap/Container"

export default function(): any {
  return (
    <Container>
      <div className="m-auto p-5">
        <h2 className="text-danger text-center p-2">
          Sorry! An error has occured :(
        </h2>
        <div>
          <p className="text-secondary text-center text-italic p-2">
            Please navigate back to the {" "}
            <a href="#/" className="text-no-decoration text-font-bold">
              home
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </Container>
  )
}
