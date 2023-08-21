const Joi = require("@hapi/joi");

const createUserValidation = (data) => {
  const schema = Joi.object({
    grade: Joi.string().required(),
    lastname: Joi.string().min(3).required(),
    firstname: Joi.string().min(3).required(),
    email: Joi.string().email(),
    address: Joi.string().min(3),
    phone: Joi.string().min(6),
    social_link: Joi.object(),
    password: Joi.string().min(6).required(),
    city: Joi.string().empty(''),
    country: Joi.string().empty(''),
    
  });

  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    lastname: Joi.string().min(3).required(),
    firstname: Joi.string().min(3).required(),
    address: Joi.string().min(3),
    phone: Joi.string().min(6),
    social_link: Joi.object(),
    grade: Joi.string(),
    city: Joi.string().empty(''),
    country: Joi.string().empty(''),
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
    off_days: Joi.array().items(Joi.number()),
    location: Joi.string(),
    user_id: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
    equipements: Joi.array().items(Joi.object()).allow(null)
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
    email: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

const logoutValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
  });
  return schema.validate(data);
};

const createBookingValidation = (data) => {
  const schema = Joi.object({
    price: Joi.string().required(),
    start_date: Joi.number().required(),
    end_date: Joi.number().required(),
    house: Joi.number().required(),
    user_id: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
    reserved_names: Joi.string(),
    billing_details: Joi.object(),
  });

  return schema.validate(data);
};

const sendMailValidation = (data) => {
  const schema = Joi.object({
    from: Joi.string(),
    to: Joi.string().required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
  });

  return schema.validate(data);
};

const updateBookingValidation = (data) => {
  const schema = Joi.object({
    start_date: Joi.number().required(),
    end_date: Joi.number().required(),
  });

  return schema.validate(data);
};


const createPagesValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    end_date: Joi.object().required(),
  });

  return schema.validate(data);
};

const createEquipmentValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    icon: Joi.string().allow(null, ''),
  });

  return schema.validate(data);
};

const updatePagesValidation = (data) => {
  const schema = Joi.object({
    content: Joi.object().required(),
  });

  return schema.validate(data);
};

const paymentsIntentmentValidation = (data) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string(),
    paymentType: Joi.string(),
  });

  return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.logoutValidation = logoutValidation;
module.exports.createUserValidation = createUserValidation;
module.exports.updateUserValidation = updateUserValidation;
module.exports.createHouseValidation = createHouseValidation;
module.exports.createCommentsValidation = createCommentsValidation;
module.exports.updateCommentsValidation = updateCommentsValidation;
module.exports.createBookingValidation = createBookingValidation;
module.exports.updateBookingValidation = updateBookingValidation;
module.exports.createPagesValidation = createPagesValidation;
module.exports.updatePagesValidation = updatePagesValidation;
module.exports.sendMailValidation = sendMailValidation;
module.exports.paymentsIntentmentValidation = paymentsIntentmentValidation;
module.exports.createEquipmentValidation = createEquipmentValidation;
