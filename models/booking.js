const pool = require("../config/db");

class Booking {
  constructor(
    id,
    price,
    start_date,
    end_date,
    reserved_by,
    house,
    reserved_names,
    billing_details,
    created_at,
    status
  ) {
    this.id = id;
    this.price = price;
    this.start_date = start_date;
    this.end_date = end_date;
    this.reserved_by = reserved_by;
    this.reserved_names = reserved_names;
    this.house = house;
    this.billing_details = billing_details
    this.created_at = created_at
    this.status = status
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE booking SET start_date=$1, end_date=$2  WHERE id=$3 RETURNING id",
        [
            this.start_date,
            this.end_date,
            this.id
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO booking (price, start_date, end_date, reserved_by, reserved_names, house, billing_details, created_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
        [
            this.price,
            this.start_date,
            this.end_date,
            this.reserved_by,
            this.reserved_names,
            this.house,
            this.billing_details,
            this.created_at,
            this.status && this.status !='' ? this.status : 'pending' 
        ]
      );
    }
  }

  static findById (id){
    return pool.query("SELECT booking.*, houses.photos, users.first_name, users.last_name, houses.title FROM booking INNER JOIN users ON booking.reserved_by = users.id INNER JOIN houses ON booking.house = houses.id WHERE booking.id=$1", [id])
  }

  static findByAuthor (id){
    return pool.query("SELECT booking.*, houses.photos, users.first_name, users.last_name, houses.title FROM booking INNER JOIN users ON booking.reserved_by = users.id INNER JOIN houses ON booking.house = houses.id WHERE booking.reserved_by = $1 ORDER BY booking.start_date DESC", [id])
  }

  static findByOwer (id){
    return pool.query("SELECT booking.*, houses.photos, users.first_name, users.last_name, houses.title FROM booking INNER JOIN users ON booking.reserved_by = users.id INNER JOIN houses ON booking.house = houses.id WHERE houses.created_by = $1 ORDER BY booking.start_date DESC", [id])
  }

  static findByHouse (id){
    return pool.query("SELECT booking.*, houses.photos, users.first_name, users.last_name, houses.title FROM booking INNER JOIN users ON booking.reserved_by = users.id INNER JOIN houses ON booking.house = houses.id WHERE booking.house = $1 ORDER BY booking.start_date DESC", [id])
  }

  static updateStatus(id, status){
    return pool.query(
      "UPDATE booking SET status=$1  WHERE id=$2 RETURNING id", [
        status,
        id
      ])
  }

  static getAll() {
    return pool.query("SELECT booking.*, houses.photos, users.first_name, users.last_name, houses.title FROM booking INNER JOIN users ON booking.reserved_by = users.id INNER JOIN houses ON booking.house = houses.id ORDER BY booking.start_date DESC");
  }

  static deleteById(id) {
    return pool.query("UPDATE booking SET status=$1, start_date=$2, end_date=$3 WHERE id=$4 RETURNING id", ['canceled', 0, 0, id]);
  }
}

module.exports = Booking;
