const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/classrooms');

exports.addClassroom = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }
    console.log(req.body)
    database.push(req.body);
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

    return database.on('value', (snapshot) => {
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
