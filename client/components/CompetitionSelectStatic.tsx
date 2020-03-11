import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Loading from "./Loading"

export default () => {

  let containerStyle: object = {
    maxWidth: 400
  }

  return (
    <Container >
      <Container style={containerStyle} >
        <Row className="m-2">
          <h3 className="text-center mx-auto">Competition Selection Page!</h3>
        </Row>
        <Row className="m-2">
          <Loading text="... Please select a competition"/>
        </Row>
      </Container>
    </Container>
  )
}