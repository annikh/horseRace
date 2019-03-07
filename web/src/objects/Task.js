class Task {
    constructor(text, concept, difficulty) {
        this.id = '';
        this.text = text;
        this.concept = concept;
        this.difficulty = difficulty;
    }

    constructor(id, text, concept, difficulty) {
        this.id = id;
        this.text = text;
        this.concept = concept;
        this.difficulty = difficulty;
    }
}