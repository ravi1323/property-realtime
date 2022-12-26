const AuthModel = require('../models/AuthModel');
const {genPassword, issueJWT} = require('../helpers/common')

module.exports.signupUser = (io, socket, payload) => {
  const errors = {};
  const {
    firstname,
    lastname,
    phone,
    email,
    password
  } = payload;

  const GenPassword = genPassword(password)
  const user = {
    firstname,
    lastname,
    email,
    phone,
    satt: GenPassword.salt,
    hash: GenPassword.hash
  }

  const newUser = AuthModel(user)
  newUser.save().then(user => {
    const jwt = issueJWT(user.id);

    socket.emit("user:signup:success", {
      success: true,
      message: "Registered Successfully",
      user: {
        phone: result.phone,
        email: result.email,
        id: result.id,
      },
      token: jwt.token,
      expires: jwt.expire,
    });
  }).catch(err => {
    if (err.errors['email'].message) {
      errors['email'] = []
      errors['email'].push(err.errors['email'].message)
    } else {
      errors['general'] = []
      errors['general'].push(err.message);
    }
    socket.emit("user:signup:fail", errors);
  })
}
