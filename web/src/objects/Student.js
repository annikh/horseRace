class Student {
    constructor(id, name, points, tasks) {
        this.id = id;
        this.name = name;
        this.points = points;
        this.tasks = tasks;
    }

    constructor(name, points) {
        this.id = '';
        this.name = name;
        this.points = points;
        this.tasks = [];
    }
}