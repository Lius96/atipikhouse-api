const pool = require("../config/db");

class Comments {
  constructor(
    id,
    content	,
    created_by,
    created_date,
    status,
    stars_number,
    house,
  ) {
    this.id = id;
    this.content = content;
    this.created_by = created_by;
    this.created_date = created_date;
    this.status = status;
    this.stars_number = stars_number;
    this.house = house;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE comments SET content=$1, status=$2, stars_number=$3  WHERE id=$4 RETURNING id",
        [
            this.content,
            this.status,
            this.stars_number,
            this.id,
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO comments (content, created_by, status, stars_number, house, created_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [
            this.content,
            this.created_by,
            this.status,
            this.stars_number,
            this.house,
            this.created_date,
        ]
      );
    }
  }

  static findById (id){
    return pool.query("SELECT * FROM comments WHERE id=$1", [id])
  }

  static findByHouse (id){
    return pool.query("SELECT comments.*, users.first_name, users.last_name, houses.title FROM comments INNER JOIN users ON comments.created_by = users.id INNER JOIN houses ON comments.house = houses.id WHERE comments.house = $1 ORDER BY comments.created_date DESC", [id])
  }

  static getAll() {
    return pool.query("SELECT comments.*, users.first_name, users.last_name, houses.title FROM comments INNER JOIN users ON comments.created_by = users.id INNER JOIN houses ON comments.house = houses.id ORDER BY comments.created_date DESC");
  }

  static deleteById(id) {
    return pool.query("DELETE FROM comments WHERE id=$1", [id]);
  }
}

module.exports = Comments;
