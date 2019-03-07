class Game {
    constructor(id, pin, user_id, classroom_id, date, score) {
        this.id = id;
        this.date = date;
        this.score = score;
        this.pin = pin;
        this.user_id = user_id;
        this.classroom_id = classroom_id;
    }

    constructor(pin, user_id, classroom_id) {
        this.id = '';
        this.date = '';
        this.score = '';
        this.pin = pin;
        this.user_id = user_id;
        this.classroom_id = classroom_id;
    }
}