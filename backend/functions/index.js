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
    getClassroomsFromDatabase(res);
  })
})

exports.getClassrooms = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      if(req.method !== 'GET') {
        return res.status(404).json({
          message: 'Not allowed'
        })
      }
      getClassroomsFromDatabase(res);
  })
})

const getClassroomsFromDatabase = (res) => {
  let classrooms = [];

  return classroomDB.on('value', (snapshot) => {
      snapshot.forEach((classroom) => {
          classrooms.push({
          id: classroom.key,
          pin: classroom.val().pin,
          names: classroom.val().names
          });
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
    gameDB.push(req.body);
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
          classroom_id: game.val().classroom_id,
          user_id: game.val().user_id,
          date: new Date()
          });
      });

  res.status(200).json(classrooms)
  }, (error) => {
      res.status(error.code).json({
      message: `Something went wrong. ${error.message}`
      })
  })
};