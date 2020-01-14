import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Header from "../components/Header"
import SectionTitle from "../components/SectionTitle"
import SeasonCard from "../components/SeasonCard"
import CompetitionCard from "../components/CompetitionCard"
import Button from "react-bootstrap/Button"
import ListGroup from "react-bootstrap/ListGroup"
import Section from "../components/Section"
import axios from "axios"
import Loading from "../components/Loading"

export default props => {
  // STATE
  const [fetch, startFetch] = useState(0)
  const [seasonMeta, setSeasonMeta] = useState([])
  const [activeSeason, selectSeason] = useState(0)
  const [competitions, setCompetitions] = useState([])
  const [auth, setAuth] = useState(defaultAuth(props.auth))

  // MUTATOR METHODS
  useEffect(() => {
    axios
      .get("/api/seasons")
      .then(res => {
        console.log(res.data)
        setSeasonMeta(res.data)
      })
      .catch(err => console.log(err))
  }, [fetch])

  useEffect(() => {
    // Dynamically update competition list
    axios
      .get(`/api/season/${activeSeason}`)
      .then(res => {
        setCompetitions(res.data.competitions)
      })
      .catch(err => {
        console.log(err)
      })
  }, [activeSeason])

  const seasonList = seasonMeta.map(s => {
    console.log(s)
    return (
      <div key={s._id} className="d-flex justify-content-around">
        <SeasonCard
          className="d-flex justify-content-around"
          key={s._id}
          meta={s}
        >
          <div className="d-flex justify-content-around">
            <Button
              className="text-capitalize"
              variant="outline-secondary"
              size="sm"
              onClick={() => selectSeason(s._id)}
            >
              select
            </Button>
          </div>
        </SeasonCard>
      </div>
    )
  })

  const competitionList = competitions.map(comp => {
    return (
      <div key={comp._id} className="d-flex justify-content-around">
        <CompetitionCard key={comp._id} meta={comp}>
          <div className="d-flex justify-content-around">
            <Button
              className="text-capitalize"
              variant="outline-secondary"
              size="sm"
              onClick={() => console.log("delete did nothing")}
            >
              select
            </Button>
          </div>
        </CompetitionCard>
      </div>
    )
  })

  if (auth === 0) return <p>YOU ARE NOT VALIDATED</p>

  return (
    <div>
      <Header title={props.meta.title} />
      <Container className="shadow-lg p-3 mb-5 bg-white rounded">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Section>
              <div>
                <SectionTitle
                  title="Season List"
                  className="pt-3 text-center"
                  style={{ color: "#17a2b8" }}
                />
                <div className="d-flex justify-content-sm-around flex-wrap">
                  {seasonList.length != 0 ? seasonList : <Loading />}
                </div>
                <div className="d-flex mt-3 justify-content-around">
                  <Button variant="info" className="text-capitalize">
                    new season
                  </Button>
                </div>
              </div>
            </Section>
          </ListGroup.Item>
          <ListGroup.Item>
            <Section>
              <div>
                <div className="d-flex justify-content-sm-around flex-wrap">
                  {competitionList.length != 0 ? (
                    competitionList
                  ) : (
                    <Loading text="Waiting for selection ..." />
                  )}
                </div>
                <div className="mt-3 d-flex justify-content-around">
                  <Button
                    style={{ backgroundColor: "#28a745" }}
                    className="border-0 text-capitalize"
                    onClick={() => console.log("add competition")}
                  >
                    new competition
                  </Button>
                </div>
              </div>
            </Section>
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </div>
  )
}

const defaultAuth = auth => {
  if (typeof auth === "undefined") return 0
  else return auth
}
