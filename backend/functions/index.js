const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

admin.initializeApp();

const classroomDB = admin.database().ref("/classrooms");
const gameDB = admin.database().ref("/games");

exports.addClassroom = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    console.log(req.body);
    const date = { date: new Date().getTime() };
    const classroom = Object.assign(req.body, date);
    classroomDB.push(classroom);
    getClassroomsForTeacherFromDatabase(classroom, res);
  });
});

exports.getClassroomsForTeacherFromDatabase = functions.https.onRequest(
  (req, res) => {
    return cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(404).json({
          message: "Not allowed"
        });
      }
      getClassroomsForTeacherFromDatabase(req.query, res);
    });
  }
);

const getClassroomsForTeacherFromDatabase = (reqClassrooms, res) => {
  let classrooms = [];
  return classroomDB.on(
    "value",
    snapshot => {
      snapshot.forEach(classroom => {
        const classroom_user_id = classroom.val().user_id;
        console.log("DB val: " + classroom_user_id);
        console.log("Req val: " + reqClassrooms.user_id);
        if (classroom_user_id && classroom_user_id === reqClassrooms.user_id) {
          classrooms.push({
            id: classroom.key,
            classroom_name: classroom.val().classroom_name,
            names: classroom.val().names,
            date: classroom.val().date
          });
        }
      });
      res.status(200).json(classrooms);
    },
    error => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      });
    }
  );
};

exports.addGame = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    console.log("Add Game Backend: ", req.body);
    const date = { date: new Date().getTime() };
    const game = Object.assign(req.body, date);
    gameDB.push(game);
    getGamesForTeacherFromDatabase(req.body, res);
  });
});

exports.getGamesForTeacherFromDatabase = functions.https.onRequest(
  (req, res) => {
    return cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(404).json({
          message: "Not allowed"
        });
      }
      getGamesForTeacherFromDatabase(req.query, res);
    });
  }
);

const getGamesForTeacherFromDatabase = (reqGame, res) => {
  let games = [];
  return gameDB.on(
    "value",
    snapshot => {
      snapshot.forEach(game => {
        const game_user_id = game.val().user_id;
        console.log("DB val: " + game_user_id);
        console.log("Req val: " + reqGame.user_id);
        if (game_user_id && game_user_id === reqGame.user_id) {
          games.push({
            id: game.key,
            pin: game.val().pin,
            classroom_id: game.val().classroom_id,
            user_id: game.val().user_id,
            date: game.val().date,
            scoreboard: game.val().scoreboard
          });
        }
      });
      res.status(200).json(games);
    },
    error => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      });
    }
  );
};

exports.getGameById = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }
    getGameByIdFromDatabase(req.query, res);
  });
});

const getGameByIdFromDatabase = (reqGame, res) => {
  let matched_game = {};
  return gameDB.on(
    "value",
    snapshot => {
      snapshot.forEach(game => {
        const game_pin = game.val().pin;
        console.log("DB val: " + game_pin);
        console.log("Req val: " + reqGame.pin);
        if (game_pin && game_pin === reqGame.pin) {
          matched_game = {
            id: game.key,
            pin: game.val().pin,
            classroom_id: game.val().classroom_id,
            user_id: game.val().user_id,
            date: game.val().date,
            names: game.val().names,
            scoreboard: game.val().scoreboard
          };
        }
      });
      res.status(200).json(matched_game);
    },
    error => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      });
    }
  );
};

// CURRENT GAME UPDATES
exports.addPlayerToGame = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    const active_player = req.body[1];
    const game_id = req.body[0];

    //remove player from name list
    const oldNames = gameDB.child(game_id).child("names/");
    console.log("old:", oldNames);
    let newNames = [];
    oldNames.forEach(name => {
      if (name !== active_player) {
        newNames.push(name);
      }
    });
    console.log("new", newNames);
    gameDB.child(game_id + "/names").set(newNames);

    //add player to game
    gameDB.child(game_id + "/scoreboard/" + active_player).set({
      points: 0,
      tasks: []
    });
  });
});
