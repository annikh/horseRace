import React, { Component } from "react";
import { Row, Nav, Button } from "react-bootstrap";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { removeCurrentGame } from "../../actions";

class StudentGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exitGame: false,
      gameStarted: false,
      player: {
        tasks: [],
        points: 0
      }
    };
  }

  exitGame = () => {
    this.props.cookies.remove("name");
    this.props.removeCurrentGame();
    this.setState({
      exitGame: true
    });
  };

  render() {
    this.props.cookies.remove("name");
    console.log(this.props.cookies.getAll());
    return (
      <div className="studentGame">
        <Nav className="justify-content-center">
          <Nav.Item>
            {this.state.exitGame ? (
              <Redirect
                to={{
                  pathname: ROUTES.STUDENT
                }}
              />
            ) : (
              <Button onClick={this.exitGame}>Avslutt spill</Button>
            )}
          </Nav.Item>
          <Nav.Item>
            <h3>Hei, </h3>
          </Nav.Item>
        </Nav>
        {this.state.gameStarted === false ? (
          <Row style={{ justifyContent: "center" }}>
            Venter på at spillet skal starte..
          </Row>
        ) : (
          <div> Her skal spillet komme</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentGame: state.currentGame,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeCurrentGame: () => dispatch(removeCurrentGame())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentGame);
