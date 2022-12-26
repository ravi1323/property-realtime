const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const PRIV_KEY = fs.readFileSync(path.join(__dirname, "..", "id_rsa_priv.pem"))
const PUB_KEY = fs.readFileSync(path.join(__dirname, "..", "id_rsa_pub.pem"))

module.exports.validateEmail = (email) => {
  var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return regex.test(String(email).toLowerCase());
};

module.exports.validateJson = (item) => {
  item = typeof item !== "string"
      ? JSON.stringify(item)
      : item;

  try {
      item = JSON.parse(item);
  } catch (e) {
      return false;
  }

  if (typeof item === "object" && item !== null) {
      return true;
  }

  return false;
}

module.exports.validatePhoneNumber = (phoneNumber) => {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(phoneNumber.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}


module.exports.genPassword = (password) => {
	const salt = crypto.randomBytes(32).toString('hex')
	const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
	return {
		salt:salt,
		hash:hash
	}
}

module.exports.issueJWT = (id) => {
	const expiresIn = '1d'
	const payload = {
		sub:id,
		iat:Date.now(),
		exp:Math.floor(Date.now() / 1000) + (24 * 60 *60)
	}
	const jwt = jsonwebtoken.sign(payload, PRIV_KEY, {algorithm:'RS256'})
	return {
		token: 'Bearer ' + jwt,
		expire:expiresIn
	}
}

module.exports.verityJWT = (token) => {
  jsonwebtoken.verify(token, PUB_KEY, function(err, decoded) {
    /**
     * !pending
     * todo: return the status of the token, is expired or invalid
     */
    if(err) {
      console.log(err)
    }
    console.log(decoded.foo)
  });
}

module.exports.comparePassword = (password, hash, salt) => {
	const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
	return newHash === hash
}
