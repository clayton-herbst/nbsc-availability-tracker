import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Header from "../components/Header";
import Title from "../components/Title";
import SeasonCard from "../components/SeasonCard";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

export default props => {
  // STATE
  const [keys, setKeys] = useState(defaultState.keys);
  const [seasons, setSeasons] = useState(defaultState.seasons);

  // MUTATOR METHODS
  const addSeason = meta => {
    setSeasons([{ title: meta.title, key: meta.key }, ...seasons]);
    setKeys([meta.key, ...keys]);
  };

  const deleteSeason = key => {
    const newSeasons = seasons.filter(value => value.key !== key);
    const newKeys = seasons.filter(value => value !== key);
    setSeasons(newSeasons);
    setKeys(newKeys);
  };

  const seasonList = seasons.map(season => {
    if (typeof season.key == "undefined") return;
    else
      return (
        <a
          className="text-decoration-none text-dark"
          href={`#/player/cup?${season.key}`}
        >
          <ListGroup.Item key={season.key} className="border-0">
            <SeasonCard key={season.key} meta={season} />
            <Button
              variant="outline-danger"
              onClick={() => deleteSeason(season.key)}
            >
              DELETE SEASON
            </Button>
          </ListGroup.Item>
        </a>
      );
  });

  return (
    <div>
      <Header player="Clayton" />
      <Container>
        <Title
          title={childProps.Title.title}
          className="pt-3"
          style={childProps.Title.style}
        />
      </Container>
      <Container className="m-10">
        <ListGroup>{seasonList}</ListGroup>
      </Container>
      <Container>
        <Button onClick={() => addSeason({ title: "NEW", key: keys + 1 })}>
          ADD NEW
        </Button>
      </Container>
    </div>
  );
};

const defaultState = {
  keys: [1, 2],
  seasons: [
    {
      title: "Test1",
      key: 1
    },
    {
      title: "Test2",
      key: 2
    }
  ]
};

const childProps = {
  SeasonCard: {
    meta: {
      title: "Title",
      desc: "description",
      button: "delete"
    }
  },
  Title: {
    title: "Season",
    style: {
      color: "green"
    }
  }
};
