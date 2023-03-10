const AuthModel = require('../models/AuthModel');
const {
  genPassword, 
  issueJWT,
  comparePassword
} = require('../helpers/common')

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
    salt: GenPassword.salt,
    hash: GenPassword.hash
  }

  const newUser = AuthModel(user)
  newUser.save((err, result) => {
    if(err) {
      if (err.errors['phone'].message) {
        errors['phone'] = []
        errors['phone'].push(err.errors['phone'].message)
      }
      if (err.errors['email'].message) {
        errors['email'] = []
        errors['email'].push(err.errors['email'].message)
      }
      if (!errors['phone'] && !errors['email']) {
        errors['general'] = []
        errors['general'].push(err.message);
      }

      socket.emit("user:signup:fail", errors);
    } else {
      const jwt = issueJWT(user.id);

      socket.emit("user:signup:success", {
        success: true,
        message: "Registered Successfully",
        user: {
          phone: result.phone,
          email: result.email,
          id: result.id,
          email_verified: result.email_verified,
          phone_verified: result.phone_verified,
        },
        token: jwt.token,
        expires: jwt.expire,
      });
    }
  });
}

module.exports.signinUser = (io, socket, payload) => {
  const errors = {};
  const {
    email,
    password
  } = payload;

  AuthModel.findOne({ email })
  .then(result => {
    if (!result) {
      errors['email'] = []
      errors['email'].push("email is not registered");
      socket.emit('user:signin:fail', errors);
    } else {
      const isValidPassword = comparePassword(
        password,
        result.hash,
        result.salt
      );

      if (!isValidPassword) {
        errors['password'] = [];
        errors['password'].push("wrong password")
        socket.emit('user:signin:fail', errors);
      } else {
        const jwt = issueJWT(result.id);
        socket.emit('user:signin:success', {
          success: true,
          message: "Logged in successfully.",
          user: {
            phone: result.phone,
            email: result.email,
            id: result.id,
            email_verified: result.email_verified,
            phone_verified: result.phone_verified
          },
          token: jwt.token,
          expires: jwt.expire,
        });
      }
    }
  }).catch(e => {
    errors['general'] = [];
    errors['general'].push(e.message);
    socket.emit('user:signin:fail', errors);
  })
}