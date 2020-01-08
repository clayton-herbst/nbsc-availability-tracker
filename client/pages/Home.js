import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Header from "../components/Header";
import SectionTitle from "../components/SectionTitle";
import SeasonCard from "../components/SeasonCard";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Section from "../components/Section";

export default () => {
  // STATE
  const [keys, setKeys] = useState(defaultState.keys);
  const [seasons, setSeasons] = useState(defaultState.seasons);
  const [selectedSeason, selectSeason] = useState(defaultState.seasons[0]);

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

  useEffect(() => {
    const cup = { title: "CUP 1", desc: "Ryder Cup", button: "remove" };
    console.log(cup);
  }, [selectedSeason]);

  const seasonList = seasons.map(season => {
    if (typeof season.key == "undefined") return;
    else
      return (
        <div
          className="text-decoration-none text-dark"
          onClick={() => selectSeason(season)}
        >
          <SeasonCard key={season.key} meta={season}>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deleteSeason(season.key)}
            >
              DELETE SEASON
            </Button>
          </SeasonCard>
        </div>
      );
  });

  return (
    <div>
      <Header title="North Beach Soccer Club" />
      <Container>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Section>
              <SectionTitle
                title="Seasons List"
                className="pt-3"
                style={{ color: "#17a2b8" }}
              />
              <div className="d-flex justify-content-start">{seasonList}</div>
              <div className="mt-3">
                <Button
                  variant="info"
                  onClick={() => addSeason({ title: "New", key: keys + 1 })}
                >
                  Add new season
                </Button>
              </div>
            </Section>
          </ListGroup.Item>
          <ListGroup.Item>
            <Section>
              <SectionTitle
                title="Cups List"
                className="pt-3"
                style={{ color: "#28a745" }}
              />
              <div className="d-flex justify-content-start">{seasonList}</div>
              <div className="mt-3">
                <Button
                  style={{ "background-color": "#28a745" }}
                  className="border-0"
                  onClick={() => addSeason({ title: "New", key: keys + 1 })}
                >
                  Add new cup
                </Button>
              </div>
            </Section>
          </ListGroup.Item>
        </ListGroup>
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
  }
};
