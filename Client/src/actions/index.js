import axios from "axios";
axios.defaults.withCredentials = true;
const ROOT_URL = "http://localhost:5000/";

export const CHECK_IF_AUTHENTICATED = 'CHECK_IF_AUTHENTICATED';

export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";

export const authError = error => {
  return {
    type: AUTHENTICATION_ERROR,
    payload: error
  };
};

export const USER_REGISTERED = "USER_REGISTERED";

export const register = (
  username,
  password,
  confirmPassword,
  firstName,
  lastName,
  history
) => {
  return dispatch => {
    if (password !== confirmPassword) {
      dispatch(authError("Passwords do not match. Watchu tryna do..?"));
      return;
    }
    axios
      .post(`${ROOT_URL}/users`, { username, password, firstName, lastName })
      .then(() => {
        dispatch({ type: USER_REGISTERED });
        history.push("/");
      })
      .catch(() => {
        dispatch(
          authError(
            "Failed to register the user. The user passed the racist test. =D"
          )
        );
      });
  };
};

export const USER_AUTHENTICATED = "USER_AUTHENTICATED";

export const login = (username, password, history) => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}`, { username, password })
      .then(response => {
        const token = response.data.token;
        window.localStorage.setItem("token", token);
        const uid = response.data._id;
        window.localStorage.setItem("uid", uid);
        dispatch({
          type: USER_AUTHENTICATED
        });
        history.push(`${ROOT_URL}${uid}/displayNotes`);
      })
      .catch(() => {
        dispatch(authError("Incorrect username/password."));
      });
  };
};

export const USER_UNAUTHENTICATED = "USER_UNAUTHENTICATED";

export const logout = () => {
  return dispatch => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("uid");
    dispatch({
      type: USER_UNAUTHENTICATED
    });
  };
};

export const ADD_NOTE = "ADD_NOTE";
//let noteId = 10;

export const addNote = note => {
  return dispatch => {
    const uid = localStorage.getItem("uid");
    axios
      .post(`${ROOT_URL}${uid}/createNote`, uid, note)
      .then(({ note }) => {
        dispatch({
          type: ADD_NOTE,
          payload: note
        });
      })
      .catch(error => {
        dispatch(authError("There was an error creating the note"));
      });
  };
};

export const GET_NOTES = "GET_NOTES";

export const getNotes = () => {
  const uid = localStorage.getItem("uid");
  const token = window.localStorage.getItem("token");
  return dispatch => {
    axios
      .get(`${ROOT_URL}${uid}/displayNotes`, {
        headers: { Authorization: token }
      })
      .then(({ data }) => {
        dispatch({
          type: GET_NOTES,
          payload: data
        });
      })
      .catch(error => {
        dispatch(authError("There was an error getting the notes"));
      });
  };
};

export const EDIT_NOTE = "EDIT_NOTE";

export const editNote = note => {
  return dispatch => {
    const id = note.data._id;
    const uid = localStorage.getItem("uid");
    console.log(uid);
    axios
      .post(`${ROOT_URL}${uid}/editNote/${id}`, note)
      .then(({ data }) => {
        dispatch({
          type: DELETE_NOTE,
          payload: data
        });
      })
      .catch(error => {
        dispatch(authError("There was an error editing/updating the note"));
      });
  };
};

export const DELETE_NOTE = "DELETE_NOTE";

export const deleteNote = id => {
  console.log("note id to be deleted: ", id);
  const uid = localStorage.getItem("uid");
  return dispatch => {
    axios
      .delete(`${ROOT_URL}/${uid}/deleteNote/${id}`)
      .then(({ data }) =>
        dispatch({
          type: DELETE_NOTE,
          payload: data
        })
      )
      .catch(error => {
        dispatch(authError("There was an error deleting the note"));
      });
  };
};
