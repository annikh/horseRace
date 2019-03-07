class Task {
    constructor(id, type, solution, hintUsed) {
        this.id = id;
        this.type = type; 
        this.solution = solution;
        this.hintUsed = hintUsed;
    }
    
    constructor(type) {
        this.id = '';
        this.type = type;
        this.solution = '';
        this.hintUsed = false;
    }
}