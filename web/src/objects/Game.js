export default class Game {
    constructor(id, pin, user_id, classroom_id, date, score_board) {
        this.id = id;
        this.date = date;
        this.score_board = score_board;
        this.pin = pin;
        this.user_id = user_id;
        this.classroom_id = classroom_id;
    }
}