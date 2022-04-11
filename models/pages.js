const pool = require("../config/db");

class Pages {
  constructor(
    id,
    title,
    content
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE pages SET content=$1, WHERE id=$2 RETURNING id",
        [
            this.content,
            this.id
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO pages (title, content) VALUES ($1, $2) RETURNING id",
        [
            this.title,
            this.content,
        ]
      );
    }
  }

  static findById (id){
    return pool.query("SELECT * FROM pages WHERE id=$1", [id])
  }

  static getAll() {
    return pool.query("SELECT* FROM pages");
  }

  static deleteById(id) {
    return pool.query("DELETE FROM pages WHERE id=$1", [id]);
  }
}

module.exports = Pages;
