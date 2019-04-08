import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

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
  game = pin => {
    return this.db.ref("games").child(pin);
  };
  gameState = pin => {
    return this.db.ref("games")
    .child(pin)
    .child("isActive");
  }
  gamePlayerList = pin => {
    return this.db.ref("games")
    .child(pin)
    .child("teams")
    .child("0")
    .child("players");
  }
  games = () => {
    return this.db.ref("games");
  };
  addGame = pin => {
    return this.db.ref("games").child(pin);
  };
  gamePlayer = (pin, name) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams")
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
  }
  solvedGameTasks = (pin, team) => {
    return this.db
      .ref("games")
      .child(pin)
      .child("teams")
      .child(team)
      .child("solvedTasks");
  }

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

  // *** Task API ***
  tasks = type => {
    return this.db.ref("tasks").child(type);
  };

  // *** Image API ***
  getImagePart = (folder, part) => {
    const string_part = '/image_part_0' + part + '.jpg'
    return this.image_storage
      .ref()
      .child(folder)
      .child(string_part)
  }
}

export default Firebase;
