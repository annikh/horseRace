const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const classroomDB = admin.database().ref('/classrooms');
const gameDB = admin.database().ref('/games');


exports.addClassroom = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }
    console.log(req.body)
    classroomDB.push(req.body);
    getClassroomsForTeacherFromDatabase(req, res);
  })
})

exports.getClassrooms = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      if(req.method !== 'GET') {
        return res.status(404).json({
          message: 'Not allowed'
        })
      }
      getClassroomsForTeacherFromDatabase(req, res);
  })
})

const getAllClassroomsFromDatabase = (res) => {
  let classrooms = [];

  return classroomDB.on('value', (snapshot) => {
      snapshot.forEach((classroom) => {
          classrooms.push({
          id: classroom.key,
          pin: classroom.val().pin,
          names: classroom.val().names,
          user_email: classroom.val().user_email || ''
          });
      });

  res.status(200).json(classrooms)
  }, (error) => {
      res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
      })
  })
};

const getClassroomsForTeacherFromDatabase = (req, res) => {
  let classrooms = [];

  return classroomDB.on('value', (snapshot) => {
      snapshot.forEach((classroom) => {
        const classroom_user_email = classroom.val().user_email;
        console.log("DB val: " + classroom_user_email);
        console.log("Req val: " + req.body.user_email);
        if (classroom_user_email && classroom_user_email === req.body.user_email) {
          classrooms.push({
            id: classroom.key,
            pin: classroom.val().pin,
            names: classroom.val().names
          });
        }
      });
  res.status(200).json(classrooms)
  }, (error) => {
      res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
      })
  })
};


exports.addGame = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }
    console.log("Add Game Backend: ", req.body)
    const date = { date: new Date().getTime()}
    const game = Object.assign(req.body, date)
    gameDB.push(game);
    getGamesFromDatabase(res);
  })
})


exports.getGames = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      if(req.method !== 'GET') {
        return res.status(404).json({
          message: 'Not allowed'
        })
      }
      getGamesFromDatabase(res);
  })
})

const getGamesFromDatabase = (res) => {
  let games = [];

  return gameDB.on('value', (snapshot) => {
      snapshot.forEach((game) => {
          games.push({
          id: game.key,
          pin: game.val().pin,
          classroom_id: game.val().classroom_id,
          user_id: game.val().user_id,
          date: game.val().date
          });
      });

  res.status(200).json(games)
  }, (error) => {
      res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
      })
  })
};