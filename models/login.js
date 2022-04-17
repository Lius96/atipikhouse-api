const pool = require('../config/db')

class Login {
  constructor(email, id, history, lastLogin, loginToken) {
    this.email = email
    this.id = id
    this.history = history
    this.lastLogin = lastLogin
    this.loginToken =loginToken
  }

  static clientPool() {
    return pool.connect()
  }
 
  static find(id) {
    
      return pool.query(
        'SELECT * FROM users WHERE id=$1',
        [
            id
        ]
      )
  }


  add() {
      if (this.id) {
        return pool.query(
            'UPDATE users SET login_session_token=$1, last_login=$2, login_history=$3, is_online=$4 WHERE id=$5 RETURNING id',
            [
              this.loginToken,
              this.lastLogin,
              this.history,
              true,
              this.id
            ]
          )
      }
  }

  delete() {
    if (this.id) {
        return pool.query(
            'UPDATE users SET login_session_token=$1, is_online=$2 WHERE id=$3 RETURNING id',
            [
              null,
              false,
              this.id,
            ]
          )
      }
  }

  static async findByEmail(email) {
    return pool.query(
      'SELECT * FROM users WHERE email=$1',
      [
        email
      ]
    )
  }
}

module.exports = Login
