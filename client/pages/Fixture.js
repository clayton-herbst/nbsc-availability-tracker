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
import Alert from "react-bootstrap/Alert"
import { setTimeout } from "timers"

export default () => {
  const { season_id, competition_id } = useParams()
  console.log(`${season_id} & ${competition_id}`)

  // STATE
  const [fixtures, setFixtures] = useState(defaultState.fixtures)
  const [fetch, fetchApi] = useState(0)
  const [availability, setAvailability] = useState([])
  const [fixtureList, setFixtureList] = useState(<p>Loading</p>)
  const [saveAlert, setSaveAlert] = useState({ success: false, error: false })
  const [status, setStatus] = useState(["maybe", "yes", "no"])

  // MUTATOR METHOD
  useEffect(() => {
    axios
      .get(`/api/competition/${competition_id}`, {
        params: {
          season: season_id
        }
      })
      .then(res => {
        console.log(res.data)
        setFixtures(res.data.fixtures)
        axios
          .get(`/api/fixture/${player.id}`, {
            params: {
              season: season_id,
              competition: competition_id,
              length: res.data.fixtures.length
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
        console.log(item)
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
                    availability[index] = (availability[index] + 1) % 3
                    setAvailability([...availability])
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

  const saveAvailability = fixt_arr => {
    console.log(player.id)
    axios
      .post(`/api/fixture/${player.id}`, {
        fixtures: fixt_arr,
        season: season_id,
        competition: competition_id,
        status: ["maybe", "yes", "no"]
      })
      .then(resp => {
        if (typeof resp.data.ok === "undefined") {
          setSaveAlert({ ...saveAlert, error: true })
        } else if (resp.data.ok === true) {
          setSaveAlert({ ...saveAlert, success: true })
        } else {
          setSaveAlert({ ...saveAlert, error: true })
        }
        setTimeout(setSaveAlert, 2000, { success: false, error: false })
      })
      .catch(err => {
        console.log(err)
        setSaveAlert({ ...saveAlert, error: true })
      })
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
            onClick={() => saveAvailability(availability)}
          >
            save
          </Button>
        </div>
      </Container>
      <div className="position-relative">
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={saveAlert.success}
            onClose={() => setSaveAlert({ ...saveAlert, success: false })}
            dismissible="true"
            variant="success"
          >
            <strong className="text-success">Saved your progress!</strong>
          </Alert>
        </div>
        <div className="position-absolute" style={{ bottom: 100, right: 10 }}>
          <Alert
            show={saveAlert.error}
            dismissible="true"
            onClose={() => setSaveAlert({ ...saveAlert, error: false })}
            variant="danger"
          >
            <strong className="text-danger">Error saving progress!</strong>
          </Alert>
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
