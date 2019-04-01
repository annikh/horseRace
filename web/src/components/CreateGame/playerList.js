import React, { Component } from "react";
import { ListGroup, Row } from "react-bootstrap";

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
    const { scoreboard } = this.props;
    const names = Object.keys(scoreboard);
    return (
      <ListGroup variant="flush" style={{ width: "80%", color: "white" }}>
        {names.map((name, i) => (
          <ListGroup.Item
            key={i}
            style={{
              textAlign: "left",
              backgroundColor: this.setBackgroundColor(scoreboard[name].team)
            }}
            action
            variant="warning"
            onClick={event => this.props.handleNewTeam(event, name)}
          >
            <Row>{name}</Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
}

export default PlayerList;
