const pool = require("../config/db");

class Houses {
  constructor(
    id,
    title,
    description,
    status,
    type,
    nbr_couchage,
    capacity,
    price,
    photos,
    created_by,
    created_date,
    updated_by,
    off_days,
    updated_date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.type = type;
    this.nbr_couchage = nbr_couchage;
    this.capacity = capacity;
    this.price = price;
    this.photos = photos;
    this.created_by = created_by;
    this.created_date = created_date;
    this.updated_by = updated_by;
    this.off_days = off_days;
    this.updated_date = updated_date;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE houses SET title=$1, description=$2, status=$3, type=$4, nbr_couchage=$5, capacity=$6, price=$7, photos=$8, updated_by=$9, off_days=$10, updated_date=$11  WHERE id=$12 RETURNING id",
        [
            
            this.title,
            this.description,
            this.status,
            this.type,
            this.nbr_couchage,
            this.capacity,
            this.price,
            this.photos,
            this.updated_by,
            this.off_days,
            this.updated_date,
            this.id,
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO houses (title, description, status, type, nbr_couchage, capacity, price, photos, created_by, created_date, off_days) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
        [
            this.title,
            this.description,
            this.status,
            this.type,
            this.nbr_couchage,
            this.capacity,
            this.price,
            this.photos,
            this.created_by,
            this.created_date,
            this.off_days,
        ]
      );
    }
  }

  static findById(id) {
    return pool.query("SELECT houses.*, users.first_name, users.last_name FROM houses INNER JOIN users ON houses.created_by = users.id WHERE houses.id=$1", [id]);
  }

  static findByAuthor (id){
    return pool.query("SELECT houses.*, users.first_name, users.last_name FROM houses INNER JOIN users ON houses.created_by = users.id WHERE houses.created_by = $1", [id])
  }

  static getAll() {
    return pool.query("SELECT houses.*, users.first_name, users.last_name FROM houses INNER JOIN users ON houses.created_by = users.id ORDER BY title DESC");
  }

  static deleteById(id) {
    return pool.query("DELETE FROM houses WHERE id=$1", [id]);
  }
}

module.exports = Houses;
