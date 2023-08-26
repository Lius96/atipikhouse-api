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
    location,
    equipements
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
    this.location = location;
    this.created_by = created_by;
    this.created_date = created_date;
    this.updated_by = updated_by;
    this.off_days = off_days;
    this.updated_date = updated_date;
    this.equipements = equipements;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE houses SET title=$1, description=$2, status=$3, type=$4, nbr_couchage=$5, capacity=$6, price=$7, photos=$8, updated_by=$9, off_days=$10, updated_date=$11, location=$12, equipements=$13  WHERE id=$14 RETURNING id",
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
            this.location,
            this.equipements,
            this.id,
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO houses (title, description, status, type, nbr_couchage, capacity, price, photos, created_by, created_date, off_days, location, notify, equipements) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id",
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
            this.location,
            true,
            this.equipements
        ]
      );
    }
  }

  static findById(id) {
    return pool.query("SELECT houses.*, users.first_name, users.last_name, users.email, users.address, users.phone, users.social_link FROM houses INNER JOIN users ON houses.created_by = users.id WHERE houses.id=$1", [id]);
  }

  static findByAuthor (id){
    return pool.query("SELECT houses.*, users.first_name, users.last_name, users.email, users.address, users.phone, users.social_link FROM houses INNER JOIN users ON houses.created_by = users.id WHERE houses.created_by = $1", [id])
  }

  static findHousesBookedByAuthor (id){
    return pool.query("SELECT booking.*, houses.*, users.first_name, users.last_name, users.email, users.address, users.phone, users.social_link FROM booking INNER JOIN houses ON booking.house = houses.id INNER JOIN users ON houses.created_by = users.id WHERE houses.created_by = $1 ORDER BY booking.start_date DESC", [id])
  }

  static getAll() {
    return pool.query("SELECT houses.*, users.first_name, users.last_name, users.email, users.address, users.phone, users.social_link FROM houses INNER JOIN users ON houses.created_by = users.id ORDER BY title DESC");
  }

  static updateNotify(id, notify=false) {
    return pool.query(
      "UPDATE houses SET notify=$1  WHERE id=$2 RETURNING id",
      [
          notify,
          id
      ]
    );
  }

  static updateHouseOffDays(id, offDays) {
    return pool.query(
      "UPDATE houses SET off_days=$1  WHERE id=$2 RETURNING id",
      [
          offDays,
          id
      ]
    );
  }

  static deleteById(id) {
    return pool.query("UPDATE houses SET status=$1  WHERE id=$2 RETURNING id", ['deleted', id]);
  }
}

module.exports = Houses;
