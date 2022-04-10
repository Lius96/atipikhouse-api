const Joi = require("@hapi/joi");

const createPortofolioValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    descriptions: Joi.string().min(5),
    images: Joi.object(),
    token: Joi.string(),
    portofolio_type: Joi.string(),
  });

  return schema.validate(data);
};

const createUserValidation = (data) => {
  const schema = Joi.object({
    lastname: Joi.string().min(3).required(),
    firstname: Joi.string().min(3).required(),
    email: Joi.string().email(),
    address: Joi.string().min(3),
    phone: Joi.string().min(10),
    social_link: Joi.object(),
    password: Joi.string().min(6),
  });

  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    lastname: Joi.string().min(3).required(),
    firstname: Joi.string().min(3).required(),
    address: Joi.string().min(3),
    phone: Joi.string().min(10),
    social_link: Joi.object(),
  });

  return schema.validate(data);
};

const createHouseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string(),
    status: Joi.string().required(),
    type: Joi.string(),
    nbr_couchage: Joi.number(),
    capacity: Joi.string(),
    price: Joi.string().required(),
    photos: Joi.object(),
    off_days: Joi.object(),
    user_id: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
  });

  return schema.validate(data);
};


const createCommentsValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(3).required(),
    status: Joi.string(),
    stars_number: Joi.number(),
    house: Joi.number().required(),
    user_id: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
  });

  return schema.validate(data);
};


const updateCommentsValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(3).required(),
    status: Joi.string(),
    stars_number: Joi.number(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(9).required(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

const logoutValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(9).required(),
  });
  return schema.validate(data);
};

module.exports.createPortofolioValidation = createPortofolioValidation;
module.exports.loginValidation = loginValidation;
module.exports.logoutValidation = logoutValidation;
module.exports.createUserValidation = createUserValidation;
module.exports.updateUserValidation = updateUserValidation;
module.exports.createHouseValidation = createHouseValidation;
module.exports.createCommentsValidation = createCommentsValidation;
module.exports.updateCommentsValidation = updateCommentsValidation;
