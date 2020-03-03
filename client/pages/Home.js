import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
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
import Jumbotron from "react-bootstrap/Jumbotron"
import Card from "react-bootstrap/Card"
import Carousel from "react-bootstrap/Carousel"

export default props => {
  // URI LOCATION

  // STATE
  const [seasonMeta, setSeasonMeta] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [seasonList, setSeasonList] = useState([])
  const [active, setActive] = useState(0)
  const [competitionList, setCompetitionList] = useState([])
  const [direction, setDirection] = useState()

  // PERMISSIONS ==> props.admin

  // MUTATOR METHODS
  useEffect(() => {
    axios
      .get("/api/seasons")
      .then(res => {
        console.log(res.data)
        setSeasonMeta(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  /*useEffect(() => {
    // Dynamically update competition list
    axios
      .get(`/api/season/${seasonMeta[0].competitions[0].id ? seasonMeta[0].competitions[0].id : "all"}`)
      .then(res => {
        setCompetitions(res.data.competitions)
      })
      .catch(err => {
        console.log(err)
      })
  }, [activeSeason])*/

  useEffect(() => {
    setSeasonList(
      seasonMeta.map((s, index) => {
        console.log(s)
        return (
          <Container key={index} className="m-2 p-2 w-25">
            <Card bg="dark" text="white">
              <Card.Body className="mx-auto text-center">
                <Card.Title>{s.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-capitalize">
                  {s.status}
                </Card.Subtitle>
                <Card.Link href={`#/season/${s.id}/${s.competition}`}>
                  Select
                </Card.Link>
              </Card.Body>
            </Card>
          </Container>
        )
      })
    )
  }, [seasonMeta])

  /* Render all competitions
  useEffect(() => {
    setCompetitionList(
      competitions.map(comp => {
        return (
          <div key={comp.id} className="d-flex justify-content-around">
            <CompetitionCard key={comp.id} meta={comp}>
              <div className="d-flex justify-content-around">
                <Button
                  className="text-capitalize"
                  variant="outline-secondary"
                  size="sm"
                  href={`#/season/${activeSeason}`}
                >
                  select
                </Button>
              </div>
            </CompetitionCard>
          </div>
        )
      })
    )
  }, [competitions, seasonMeta])*/

  if (seasonList.length === 0 || seasonMeta.length === 0) return <p>loading</p>

  return (
    <div>
      <Header title={props.meta.title} />
      <Container className="p-2 h-25">
        <Jumbotron className="d-flex flex-row no-wrap justify-content-around shadow p-3 rounded">
          {seasonList.length !== 0 ? seasonList : <p>Loading ...</p>}
        </Jumbotron>
      </Container>
    </div>
  )
}

const defaultAuth = auth => {
  if (typeof auth === "undefined") return 0
  else return auth
}

/**
 * <ListGroup variant="flush">
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
        -->
 */

/**
  * <div key={s.id} className="d-flex justify-content-around">
            <SeasonCard
              className="d-flex justify-content-around"
              key={s.id}
              meta={s}
            >
              <div className="d-flex justify-content-around">
                <Button
                  className="text-capitalize"
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => selectSeason(s.id)}
                  href={`#/season/${s.id}`}
                >
                  select
                </Button>
              </div>
            </SeasonCard>
          </div>
  */
