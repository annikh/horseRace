export default class Game {
  constructor(isActive, user_id, classroom_id, date, teams, tasks, figure) {
    this.isActive = isActive;
    this.date = date;
    this.teams = teams;
    this.user_id = user_id;
    this.classroom_id = classroom_id;
    this.tasks = tasks;
    this.figure = figure;
  }
}
