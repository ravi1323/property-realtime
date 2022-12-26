const {
  validateEmail,
  validatePhoneNumber,
  validateJson
} = require('../helpers/common')
const {
  signupUser
} = require('../controllers/AuthController');


module.exports.signin = (io, socket, payload) => {
  const errors = {
    email: [],
    password: [],
    general: []
  }

  if(!validateJson(payload)) errors.general.push("please provide valid json");
  else {
    const {email, password} = JSON.parse(payload);

    // email validation
    if(!email || email === "") errors.email.push("email is required");
    else if(!validateEmail(email)) errors.email.push("email is invalid");

    // password validation
    if (!password || password === "") errors.password.push("password is required.");
    else if (password.length < 4) errors.password.push("password is too short");
    else if (password.length > 10) errors.password.push("password is too long");
  }

  if(
    errors.email.length > 0 ||
    errors.password.length > 0 ||
    errors.general.length > 0
  ) {
    Object.keys(errors).map((key, _) => {
      if(!errors[key][0]) delete errors[key];
    })
    socket.emit('user:signin:fail', errors);
  } else {
    socket.emit('user:signin:success', payload);
  }
}

module.exports.signup = (io, socket, payload) => {
  const errors = {
    firstname: [],
    lastname: [],
    email: [],
    phone: [],
    password: [],
    confirm_password: [],
    general: []
  }

  if (!validateJson(payload)) errors.general.push("please provide valid json");
  else {
    const {
      firstname,
      lastname,
      email,
      phone,
      password,
      confirm_password
    } = JSON.parse(payload);

    // firstname validation
    if (!firstname || firstname === "") errors.firstname.push("firstname is required");
    else if (firstname.length < 2) errors.firstname.push("firstname is too short, MIN -> 2");
    else if (firstname.length > 10) errors.firstname.push("firstname is too long, MAX -> 10");

    // lastname validation
    if (!lastname || lastname === "") errors.lastname.push("lastname is required");
    else if (lastname.length < 2) errors.lastname.push("lastname is too short, MIN -> 2");
    else if (lastname.length > 10) errors.lastname.push("lastname is too long, MAX -> 10");

    // email validation
    if (!email || email === "") errors.email.push("email is required");
    else if (!validateEmail(email)) errors.email.push("email is invalid");

    // phone validation
    if (!phone || phone === "") errors.phone.push("phone is required");
    else if (!validatePhoneNumber(phone)) errors.phone.push("phone is invalid");

    // password validation
    if (!password || password === "") errors.password.push("password is required");
    else if (password.length < 6) errors.password.push("password is too short, MIN -> 6");
    else if (password.length > 12) errors.password.push("password is too long, MAX -> 12");

    // confirm password validation
    if (!confirm_password || confirm_password === "") errors.confirm_password.push("confirm_password is required");
    else if(confirm_password !== password) errors.confirm_password.push("confirm_password does not match with provided password");
  }

  if(
    errors.firstname.length > 0 ||
    errors.lastname.length > 0 ||
    errors.email.length > 0 ||
    errors.phone.length > 0 ||
    errors.password.length > 0 ||
    errors.confirm_password.length > 0 ||
    errors.general.length > 0
  ) {
    Object.keys(errors).map((key, _) => {
      if(!errors[key][0]) delete errors[key];
    })
    socket.emit('user:signup:fail', errors);
  } else {
    signupUser(io, socket, payload);
  }
}
