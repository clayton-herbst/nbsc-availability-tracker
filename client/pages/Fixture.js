import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Header from "../components/Header"
import Title from "../components/Title"
import FixtureCard from "../components/FixtureCard"
import Button from "react-bootstrap/Button"
import { club, player } from "../constants"
import { useParams } from "react-router-dom"
import axios from "axios"

export default () => {
  const { seasonId, competitionId } = useParams()
  console.log(`${seasonId} & ${competitionId}`)

  // STATE
  const [fixtures, setFixtures] = useState(defaultState.fixtures)
  const [fetch, fetchApi] = useState(0)
  const [availability, setAvailability] = useState([0])
  const [status, setStatus] = useState(["maybe", "yes", "no"])

  // MUTATOR METHOD
  useEffect(() => {
    axios
      .get(`/api/competition/${seasonId}`, {
        params: {
          competitionId: competitionId
        }
      })
      .then(res => {
        console.log(res.data)
        setFixtures(res.data.fixtures)
        axios
          .get(`/api/fixture/${player.id}`, {
            params: {
              seasonId: seasonId,
              competitionId: competitionId
            }
          })
          .then(res => {
            console.log(res.data)
            setStatus(res.data.status)
            setAvailability(res.data.fixtures)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, [fetch])

  const toggleAvailability = index => {
    let arr = availability
    arr[index] = (arr[index] + 1) % 3
    setAvailability(arr)
  }

  const fixtureList = fixtures.map((item, index) => {
    const date = new Date(item.date)
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "2-digit"
    }
    const dateString = `${date.toLocaleDateString(undefined, dateOptions)}`
    return (
      <div key={item._id}>
        <FixtureCard
          key={item._id}
          round={index + 1}
          location={item.location}
          date={dateString}
          title={item.title}
        >
          <div className="d-flex justify-content-around">
            <Button
              className="text-capitalize"
              variant="outline-secondary"
              onClick={() => toggleAvailability(index)}
            >
              {status[availability[index]]}
            </Button>
          </div>
        </FixtureCard>
      </div>
    )
  })

  return (
    <div>
      <Header player="Clayton" title={club.name} />
      <Container>
        <Title
          title={defaultState.title.title}
          className="my-3 p-2"
          style={defaultState.title.style}
        />
        <div className="d-flex flex-wrap rounded justify-content-sm-center">
          {fixtureList}
        </div>
      </Container>
      <Container className="d-flex justify-content-around">
        <div className="m-2 p-2">
          <Button className="text-capitalize" variant="outline-success">
            save
          </Button>
        </div>
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
