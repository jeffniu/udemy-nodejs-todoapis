const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// var message = "I am user number 3"
// var hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');
// console.log(`Token: ${token}`)
//
// var decoded = jwt.verify(token, '123abc')
// console.log(`Decoded: ${JSON.stringify(decoded)}`)

var password = "123abc!"
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
      console.log(hash)
  })
})
