import React, { Component } from "react";
import { ListGroup, Row } from "react-bootstrap";
import "../Account/style.css";
import "../CreateGame/style.css";

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.setBackgroundColor = this.setBackgroundColor.bind(this);

    this.state = {
      colorIndex: 0
    };
  }

  setBackgroundColor = team => {
    switch (team) {
      case 0:
        return "#8DDA77";
      case 1:
        return "#F0EE8D";
      case 2:
        return "#E37171";
      case 3:
        return "#77ABDA";
      case 4:
        return "#8D6A9F";
      default:
        return "#DB7F67";
    }
  };

  render() {
    const { teams } = this.props;
    const names = Object.keys(teams);
    return (
      <Row className="rowAccount">
        <h5>
          Del inn i lag ved å trykke på en deltaker, slik at fargen på boksen
          endrer seg.
        </h5>
        <ListGroup className="teamList">
          {names.map((name, i) => (
            <ListGroup.Item
              className="player"
              key={i}
              style={{
                backgroundColor: this.setBackgroundColor(teams[name].team)
              }}
              action
              onClick={event => this.props.handleNewTeam(event, name)}
            >
              {name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
    );
  }
}

export default PlayerList;
