const Note = require("../models/NoteModel");
const User = require("../models/UserModel");

const createNote = (req, res) => {
  console.log(req.body, req.params);
  const note = req.body;
  const newNote = new Note(note);
  const { uid } = req.params;

  newNote
    .save()
    .then(note => {
      console.log(note);
      User
        .findByIdAndUpdate(uid, {
          $push: { notes: note._id }
        })
        .then(user => {
          res.status(200).json({Message: "Note saved in the logged in User's collection"});
        })
        .catch(error => {
          res.status(500).json({Error: "There was an error saving the note"});
        })
    })
    .catch(error => {
      res.status(500).json({Error: "There was an error saving the note."});
    })
};

const getNotes = async function (req, res) {
  const { uid } = req.params;
  console.log(uid);
  // Note.find({ uid })
  //   .then(notes => res.json(notes))
  //   .catch(err => res.status(500).json({ error: 'Error fetching notes' }));
  try {
    const loggedInUser = await User.findById(uid).populate("notes");
    //console.log(uid)
    res.status(200).send(loggedInUser.notes );
  } catch (error) {
    console.log(error, "There was an error retrieving the notes");
  }
};

const deleteNote = (req, res) => {
  const {id} = req.params;
  console.log(id);
  Note
    .findByIdAndRemove(id, req.body)
    .then(deleteNote => {
      res.json(deleteNote);
    }
    ).catch(error => res.json(error));

  // try {
  //     const removeNote = await User.findByIdAndUpdate(uid, {$pull: {notes: { _id: noteId }}});
  //     res.status(200).send(removeNote.notes);
  // } catch(error) {
  //     console.log(error, 'There was an error deleting the note');
  // };
};

const editNote = async function (req, res) {
  const { id } = req.params;
  const { title, body } = req.body;
  await Note.findByIdAndUpdate(id, req.body, { new: true })
    .then(updateNote => res.status(200).json(updateNote))
    .catch(error => {
      res.status(500).json({ error: "There was an error updating" });
    });
};

module.exports = {
  createNote,
  getNotes,
  deleteNote,
  editNote
};
