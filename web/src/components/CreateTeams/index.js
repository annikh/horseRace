import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Table } from "react-bootstrap";

class CreateTeams extends Component {
  constructor(props) {
    super(props);
  }

  handleTeamChange(name, team) {
    this.setState({
      teams: { ...this.state.teams, name: team }
    });
  }

  render() {
    const names = this.props.classrooms[this.state.classroomName]["names"];
    const teams = 2;
    const teamSize = Math.floor(names.length / teams);
    let row = [];
    let grid = [];
    let head = [];
    return (
      <Table striped bordered size="sm">
        <thead>
          <tr>
            {[...Array(teams)].forEach((x, i) =>
              head.push(<th key={i}>{i + 1}</th>)
            )}
            {head}
          </tr>
        </thead>
        <tbody>
          {names.forEach((name, i) => {
            row.push(<th key={i}>{name}</th>);
            if ((i + 1) % teamSize === 0) {
              let wrappedRow = [<tr>{row}</tr>];
              grid.push(wrappedRow);
              row = [];
            }
          })}
          {grid}
        </tbody>
      </Table>
    );
  }
}

export default withFirebase(CreateTeams);
