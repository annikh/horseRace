import React, { Component } from "react";
import { Nav, Button } from "react-bootstrap";
import Editor from "../Editor";

class Game extends Component {
  render() {
    return (
    <div className="studentGame">
      <Nav className="justify-content-center">
          <Nav.Item>
              <Button>Avslutt spill</Button>
          </Nav.Item>
          <Nav.Item>
            <h3>Hei, Anniken</h3>
          </Nav.Item>
        </Nav>
        <Editor/>
    </div>
    );
  }
}

export default Game;
