class Classroom {
    constructor(classroom_name, names, user_id) {
        this.id = '';
        this.classroom_name = classroom_name;
        this.date = '';
        this.names = names;
        this.user_id = user_id;
    }

    constructor(id, classroom_name, date, names, user_id) {
        this.id = id;
        this.classroom_name = classroom_name;
        this.date = date;
        this.names = names;
        this.user_id = user_id;
    }
}