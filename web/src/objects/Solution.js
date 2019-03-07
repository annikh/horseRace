class Solution {
    constructor(id, taskId, startTime, endTime, solution, help, hint) {
        this.id = id;
        this.taskId = taskId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.solution = solution;
        this.help = help;
        this.hint = hint;
    }
    
    constructor(taskId, startTime) {
        this.id = '';
        this.taskId = taskId;
        this.startTime = startTime;
        this.endTime = 0;
        this.solution = '';
        this.help = '';
        this.hint = '';
    }
}