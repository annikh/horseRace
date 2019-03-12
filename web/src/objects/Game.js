export default class Game {
  constructor(id, pin, user_id, classroom_id, date, scoreboard) {
    this.id = id;
    this.date = date;
    this.scoreboard = scoreboard;
    this.pin = pin;
    this.user_id = user_id;
    this.classroom_id = classroom_id;
  }
}
