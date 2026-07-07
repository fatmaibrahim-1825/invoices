const Joi = require("joi");
const { Store } = require("./Store");

const registerReqValidation = (data) => {
  const schema = Joi.object({
    seller_name_en: Joi.string().required(),
    seller_name_ar: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const updateReqValidation = (data) => {
  const schema = Joi.object({
    vat_registration_number: Joi.string().length(15),
    email: Joi.string().min(6).email(),
    store_address: Joi.string(),
    message: Joi.string(),
    vat_rate: Joi.number(),
    discount_rate: Joi.number(),
    img_url: Joi.string(),
    stamp_url: Joi.string(),
  });

  return schema.validate(data);
};

const validateEmail = async (email) => {
  let store = await Store.findOne({ email });
  return store ? false : true;
};

module.exports = {
  registerReqValidation,
  updateReqValidation,
  validateEmail,
};
