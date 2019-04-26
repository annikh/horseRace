export default class Game {
  constructor(
    isActive,
    user_id,
    classroom_id,
    date,
    teams,
    figure,
    isFinished
  ) {
    this.isActive = isActive;
    this.date = date;
    this.teams = teams;
    this.user_id = user_id;
    this.classroom_id = classroom_id;

    this.figure = figure;
    this.isFinished = isFinished;
  }
}
