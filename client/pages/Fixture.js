import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Header from "../components/Header"
import Title from "../components/Title"
import FixtureCard from "../components/FixtureCard"
import Button from "react-bootstrap/Button"
import { club } from "../constants"

export default () => {
  // STATE
  const [fixtures, setFixtures] = useState(defaultState.fixtures)
  // MUTATOR METHOD

  const fixturelist = fixtures.map(item => {
    return <FixtureCard key={item.key} meta={item} />
  })

  return (
    <div>
      <Header player="Clayton" title={club.name} />
      <Container>
        <Title
          title={defaultState.title.title}
          className="py-3"
          style={defaultState.title.style}
        />
        <div className="d-flex flex-wrap rounded justify-content-sm-start">
          {fixturelist}
        </div>
      </Container>
      <Container>
        <Button>ADD NEW</Button>
      </Container>
    </div>
  )
}

const defaultState = {
  keys: [1, 2],
  fixtures: [
    {
      title: "Test1",
      key: 1,
      date: Date.now(),
      location: "Sorrento",
      button: "Toggle"
    },
    {
      title: "Test2",
      key: 2,
      date: Date.now(),
      location: "Duncraig",
      button: "Toggle"
    }
  ],
  fixtureCard: {
    meta: {
      title: "Title",
      desc: "description",
      button: "delete"
    }
  },
  title: {
    title: "Fixtures",
    style: {
      color: "green"
    }
  }
}
