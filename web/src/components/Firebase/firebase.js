import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import * as FIGURES from "../../constants/figures.js";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.image_storage = app.storage();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Game API ***
  games = () => {
    return this.db.ref("games");
  };
  game = pin => {
    return this.db.ref("games").child(pin);
  };
  gameState = pin => {
    return this.db
      .ref("games")
      .child(pin)
      .child("isActive");
  };
  gamePlayerList = pin => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams");
  };
  addGame = pin => {
    return this.db.ref("games").child(pin);
  };
  gamePlayer = (pin, team, name) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams")
      .child(team)
      .child("players")
      .child(name);
  };
  gameTask = (pin, taskId) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("tasks")
      .child(taskId);
  };
  gameTasks = pin => {
    return this.db
      .ref("games")
      .child(pin)
      .child("tasks");
  };
  gameTeam = (pin, team) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams")
      .child(team);
  };
  solvedGameTasks = (pin, team) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams")
      .child(team)
      .child("solvedTasks");
  };
  solvedGameTask = (pin, team, taskId) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams")
      .child(team)
      .child("solvedTasks")
      .child(taskId);
  };
  gameFigure = pin => {
    return this.db
      .ref("games")
      .child(pin)
      .child("figure");
  };

  // *** Classroom API ***
  addClassroom = (user_id, className) => {
    return this.db
      .ref("classrooms")
      .child(user_id)
      .child(className);
  };
  classroomsByTeacher = (user_id, className) => {
    return this.db.ref("classrooms").child(user_id);
  };

  deleteClassroomByTeacher = (user_id, className) => {
    return this.db
      .ref("classrooms")
      .child(user_id)
      .child(className)
      .remove();
  };

  // *** Task API ***
  tasks = type => {
    return this.db.ref("tasks").child(type);
  };

  // *** Image API ***
  getImagePart = (figure, part) => {
    const string_part = FIGURES.FIGUREPARTS[part] + ".jpg";
    return this.image_storage
      .ref()
      .child(figure)
      .child(string_part);
  };

  figureChoices = () => {
    return this.db.ref("figure");
  };

  getFigureSolution = figureKey => {
    return this.db.ref("figure").child(figureKey);
  };
}

export default Firebase;
