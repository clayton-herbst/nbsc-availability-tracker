/**
 * Container of fixture cards and any actions relating to fixtures.
 */
import React from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Loading from "./Loading"


interface FixtureContainer {
  onSave: any; // function for save
  fixtures: any;
  className?: string;
  emptyComponent?: any
}

export default (props: FixtureContainer) => {

  if(typeof props.fixtures !== "object")
    return (
      <Container className="p-2 m-1">
        <Loading text="Loading resources." />
      </Container>
    )
  else if(props.fixtures.length === 0)
    return (
      <Container className="text-center font-italic p-2">
        No fixtures could be found
      </Container>
    )
  else
    return (
      <div>
        <Container fluid="sm" className={"p-2 mx-auto " + props.className}>
          <div className="d-lg-flex flex-wrap rounded justify-content-sm-center">
            {props.fixtures}
          </div>
        </Container>
        <Container className="mb-5 my-1 d-flex justify-content-sm-center">
          <Button
            className="text-capitalize m-1"
            variant="outline-success"
            onClick={props.onSave}
          >
            Save
          </Button>
        </Container>
      </div>
    )
}

const defaultState = <p>Loading ....</p>

// -- DEPRECATED --
/**
 * const { season_id, competition_id } = useParams()
  console.log(`${season_id} & ${competition_id}`)

  // STATE
  const [fixtures, setFixtures] = useState(defaultState.fixtures)
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
  }, [])

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

 */
