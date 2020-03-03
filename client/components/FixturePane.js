import React, { useEffect, useState } from "react"
import Tab from "react-bootstrap/Tab"
import FixtureContainer from "../components/FixtureContainer"
import axios from "axios"
import { player } from "../constants/index"

export default props => {
  const [items, setItems] = useState(defaultState)
  const [id, setId] = useState({
    season: props.season,
    competition: props.competition
  })
  const [fixtures, setFixtures] = useState([])

  useEffect(() => {
    axios
      .get(`/api/competition/${id.competition}`, {
        params: {
          season: id.season
        }
      })
      .then(res => {
        console.log(res.data)
        setFixtures(res.data.fixtures)

        axios
          .get(`/api/fixture/${player.id}`, {
            params: {
              season: id.season,
              competition: id.competition,
              length: res.data.fixtures.length
            }
          })
          .then(res => {
            console.log(res.data)
            //setAvailability(res.data.fixtures)
            //setStatus(res.data.status)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, [id])

  console.log(props.competitions)
  useEffect(() => {
    setItems(
      props.competitions.map((value, index) => {
        return (
          <Tab.Pane
            key={index}
            eventKey={index}
            onEnter={() => console.log("entered")}
          >
            <FixtureContainer save={() => console.log("safasf")}>
              <div>
                <p>Hello asfsadf</p>
              </div>
              <div>
                <p>Hello adfsaf</p>
              </div>
            </FixtureContainer>
          </Tab.Pane>
        )
      })
    )
  }, [props.competitions])

  return <Tab.Content>{items}</Tab.Content>
}

const defaultState = [
  <Tab.Pane key="0" eventKey="0">
    <FixtureContainer save={() => console.log("asdfasf")}>
      <div>
        <p>Hello</p>
      </div>
      <div>
        <p>Hello</p>
      </div>
      <div>
        <p>Hello</p>
      </div>
      <div>
        <p>Hello</p>
      </div>
    </FixtureContainer>
  </Tab.Pane>
]
