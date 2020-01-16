import React, { useState, useEffect, useCallback } from "react"
import Container from "react-bootstrap/Container"
import Header from "../components/Header"
import Title from "../components/Title"
import FixtureCard from "../components/FixtureCard"
import Button from "react-bootstrap/Button"
import { club, player } from "../constants"
import { useParams } from "react-router-dom"
import axios from "axios"
import Toast from "react-bootstrap/Toast"

export default () => {
  const { seasonId, competitionId } = useParams()
  console.log(`${seasonId} & ${competitionId}`)

  // STATE
  const [fixtures, setFixtures] = useState(defaultState.fixtures)
  const [fetch, fetchApi] = useState(0)
  const [availability, setAvailability] = useState([])
  const [fixtureList, setFixtureList] = useState(<p>Loading</p>)
  const [saveAlert, setSaveAlert] = useState({ success: true, error: false })
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
            setAvailability(res.data.fixtures)
            setStatus(res.data.status)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, [fetch])

  // IMPROVEMENT: USE CALLBACK INSTEAD ?? & useEffect once
  useEffect(() => {
    setFixtureList(
      fixtures.map((item, index) => {
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
                  onClick={() => {
                    console.log(availability)
                    availability[index] = (availability[index] + 1) % 3
                    console.log(availability)
                    setAvailability([...availability])
                    console.log(status[availability[index]])
                  }}
                >
                  {status[availability[index]]}
                </Button>
              </div>
            </FixtureCard>
          </div>
        )
      })
    )
  }, [fixtures, availability])

  const saveAvailability = () => {
    console.log("nothing")
  }

  return (
    <div>
      <Header player="Clayton" title={club.name} />
      <Container className="h-100 w-75 mx-auto">
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
          <Button
            className="text-capitalize"
            variant="outline-success"
            onClick={() => console.log("hi")}
          >
            save
          </Button>
        </div>
      </Container>
      <div className="position-relative">
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Toast
            show={saveAlert.success}
            delay="1000"
            animation="true"
            autohide="true"
          >
            <Toast.Header closeButton="true">
              <strong className="text-success p-2">Saved your progress!</strong>
            </Toast.Header>
          </Toast>
        </div>
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Toast
            show={saveAlert.error}
            delay="1000"
            animation="true"
            autohide="true"
          >
            <Toast.Header closeButton="true">
              <strong className="text-danger p-2">
                Error saving progress!
              </strong>
            </Toast.Header>
          </Toast>
        </div>
      </div>
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
