const { authenticate } = require("../utils/middleware");
const { login } = require('../controllers/login');
const { createUser } = require('../controllers/user');
const {
  createNote,
  getNotes,
  deleteNote,
  editNote
} = require("../controllers/notes");

module.exports = (server) => {
  server.route("/").post(createUser);
  server.route("/login").post(login);
  server.route('/:uid/displayNotes').get(authenticate, getNotes);
  server.route("/:uid/createNote").post(authenticate, createNote);
  server.route('/editNote/:id').put(authenticate, editNote);
  server.route('/deleteNote/:id').delete(authenticate, deleteNote);
};
