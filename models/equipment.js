const pool = require("../config/db");

class Equipment {
  constructor(
    id,
    name,
    icon
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
  }

  static clientPool() {
    return pool.connect();
  }

  save() {
    if (this.id) {
      return pool.query(
        "UPDATE equipement SET name=$1, icon=$2 WHERE id=$3 RETURNING id",
        [
            this.name,
            this.icon,
            this.id
        ]
      );
    } else {
      return pool.query(
        "INSERT INTO equipement (name, icon) VALUES ($1, $2) RETURNING id",
        [
            this.name,
            this.icon,
        ]
      );
    }
  }

  static findById (id){
    return pool.query("SELECT * FROM equipement WHERE id=$1", [id])
  }

  static getAll() {
    return pool.query("SELECT* FROM equipement");
  }

  static deleteById(id) {
    return pool.query("DELETE FROM equipement WHERE id=$1", [id]);
  }
}

module.exports = Equipment;
