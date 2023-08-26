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
    confirmation_token,
    grade,
    city,
    country
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
    this.grade = grade;
    this.city = city;
    this.country = country;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE users SET last_name=$1, first_name=$2, address=$3, phone=$4, social_link=$5, updated_date=$6, grade=$7, city=$8, country=$9 WHERE id=$10 RETURNING id",
        [
          this.last_name,
          this.first_name,
          this.address,
          this.phone,
          this.social_link,
          this.updated_date,
          this.grade,
          this.city,
          this.country,
          this.id,
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO users (last_name, first_name, email, address, phone, social_link, created_date, password, confirmation_token, grade, city, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id",
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
          this.grade,
          this.city,
          this.country
        ]
      );
    }
  }

  static findById(id) {
    return pool.query("SELECT * FROM users WHERE id=$1", [id]);
  }

  static updatePass(id, password){
    return pool.query(
      "UPDATE users SET password=$1 WHERE id=$2 RETURNING id",
      [
        password,
        id
      ]
    );
  }

  static updateConfirmation(id){
    return pool.query(
      "UPDATE users SET confirmation_token=$1 WHERE id=$2 RETURNING id",
      [
        null,
        id
      ]
    );
  }

  static findByEmail(email){
    return pool.query("SELECT * FROM users WHERE email=$1", [email]);
  }

  static findByToken(token){
    return pool.query("SELECT * FROM users WHERE confirmation_token=$1", [token])
  }

  static getAll() {
    return pool.query("SELECT * FROM users ORDER BY last_name DESC");
  }

  static deleteById(id) {
    return pool.query("UPDATE users SET status=$1, email=$2 WHERE id=$3 RETURNING id", ['deleted', null, id]);
  }
}

module.exports = Users;
