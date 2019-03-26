import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

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
  game = game_id => {
    return this.db.ref("games").child(game_id);
  };
  games = () => {
    return this.db.ref("games");
  };
  addGame = pin => {
    return this.db.ref("games/").child(pin);
  };
  gamePlayer = (game_id, name) => {
    return this.db.ref(`games/${game_id}/scoreboard/${name}`);
  };

  // *** Classroom API ***
  classroom = classroom_id => {
    return this.db.ref("classrooms/").child(classroom_id);
  };
  classrooms = () => {
    return this.db.ref("classrooms");
  };
}

export default Firebase;
