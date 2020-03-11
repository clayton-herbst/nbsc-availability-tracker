import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Loading from "./Loading"

export default () => {

  let containerStyle = {maxWidth: 400}
  
  return (
    <Container style={containerStyle}>
      <Row className="m-2">
        <h3 className="text-center mx-auto">Season Selection Page</h3>
      </Row>
      <Row className="m-2 p-2">
        <Loading text="... please select a season" />
      </Row>
    </Container>
  )
}