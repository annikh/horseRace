export default class Game {
  constructor(user_id, classroom_id, date, scoreboard) {
    this.date = date;
    this.scoreboard = scoreboard;
    this.user_id = user_id;
    this.classroom_id = classroom_id;
  }
}
