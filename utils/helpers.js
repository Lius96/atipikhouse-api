var _ = require("underscore");
const { Buffer } = require('buffer');
const bcrypt = require('bcrypt')
const saltRounds = 10

// hash password
module.exports.getHashedPassword = (passwordText) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(passwordText, salt);
  return hash
};

module.exports.verifyToken = (pass) => {
  return bcrypt.compareSync(passwordText, pass);
};

module.exports.verifyPass = (pass, hash) => {
  return bcrypt.compareSync(pass, hash);
};

module.exports.object2SQL = function(obj, type) {
  if (_.isUndefined(type)) {
    type = "insert";
  }

  switch (type) {
    case "insert":
      var object_keys = Object.keys(obj);
      var sql_fields = object_keys.join(",", object_keys);
      var sql_fields_template = "";

      _.each(object_keys, function(value, key) {
        var sup = ",";
        if (key === 0) {
          sup = "";
        }
        sql_fields_template += sup + "" + "$" + (key + 1);
      });

      return {
        fields: sql_fields,
        template: sql_fields_template,
        values: Object.values(obj)
      };
      break;

    case "insertion":
      var object_keys = Object.keys(obj.data);
      var sql_fields = object_keys.join(",", object_keys);
      var sql_fields_template = "";

      _.each(object_keys, function(value, key) {
        var sup = ",";
        if (key === 0) {
          sup = "";
        }
        sql_fields_template += sup + "" + "$" + (key + 1);
      });

      return {
        sql:
          "INSERT INTO " +
          obj.table +
          " (" +
          sql_fields +
          ") VALUES (" +
          sql_fields_template +
          ") RETURNING *",
        values: Object.values(obj.data)
      };
      break;

    case "update":
      var global_values = Object.values(obj.new_values);
      var new_values_keys = Object.keys(obj.new_values);
      var set_string = "";
      _.each(new_values_keys, function(key_value, key) {
        var sup = ",";
        if (key === 0) {
          sup = "";
        }
        set_string += sup + "" + key_value + "=$" + (key + 1) + " ";
      });

      var where_string = "";
      _.each(obj.where_values, function(key_value, key) {
        var sup = obj.where_operator;
        if (key === 0) {
          sup = " ";
        }
        where_string +=
          sup +
          " " +
          key_value.where +
          "" +
          key_value.operator +
          "$" +
          (global_values.length + 1) +
          " ";
        global_values.push(key_value.val);
      });

      var more_sql = "";
      if (!_.isUndefined(obj.more_sql)) {
        if (obj.more_sql !== "") {
          more_sql = obj.more_sql;
        }
      }

      return {
        sql:
          "UPDATE " +
          obj.table +
          " SET " +
          set_string +
          " WHERE " +
          where_string +
          "" +
          more_sql,
        values: global_values
      };

      break;
    default:
      break;
  }  
};

module.exports.updateLoginHistory = (obj={}, newTime) =>{
  var size = 0
  let Obj = {};
  if (obj) {
    size = Object.keys(obj).length;
    Obj = obj;
  }
  Obj[size++] = newTime;
  return Obj
}

module.exports.generateWord = (length = 8, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#-=")=> {
  var retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

module.exports.encodeString = (str) => {
  const buf = Buffer.from(str, 'utf8')
  return buf.toString('base64');
}

module.exports.decodeString = (str) => {
  const buf = Buffer.from(str, 'base64')
  return buf.toString('ascii');
}

