const pool = require("../config/db");

class Users {
  constructor(
    id,
    last_name,
    first_name,
    email,
    address,
    phone,
    social_link,
    created_date,
    updated_date,
    password,
    confirmation_token
  ) {
    this.id = id;
    this.last_name = last_name;
    this.first_name = first_name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.social_link = social_link;
    this.created_date = created_date;
    this.updated_date = updated_date;
    this.password = password;
    this.confirmation_token = confirmation_token;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE users SET last_name=$1, first_name=$2, address=$3, phone=$4, social_link=$5, updated_date=$6, password=$7 WHERE id=$8 RETURNING id",
        [
          this.last_name,
          this.first_name,
          this.address,
          this.phone,
          this.social_link,
          this.updated_date,
          this.id,
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO users (last_name, first_name, email, address, phone, social_link, created_date, password, confirmation_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
        [
          this.last_name,
          this.first_name,
          this.email,
          this.address,
          this.phone,
          this.social_link,
          this.created_date,
          this.password,
          this.confirmation_token,
        ]
      );
    }
  }

  static findById(id) {
    return pool.query("SELECT * FROM users WHERE id=$1", [id]);
  }

  static getAll() {
    return pool.query("SELECT * FROM users ORDER BY last_name DESC");
  }

  static deleteById(id) {
    return pool.query("DELETE FROM users WHERE id=$1", [id]);
  }
}

module.exports = Users;
