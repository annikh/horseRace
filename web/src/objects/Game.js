export default class Game {
  constructor(isActive, user_id, classroom_id, date, scoreboard, tasks) {
    this.isActive = isActive;
    this.date = date;
    this.scoreboard = scoreboard;
    this.user_id = user_id;
    this.classroom_id = classroom_id;
    this.tasks = tasks;
  }
}
