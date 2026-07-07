const services = require("./store_services");

const {
  registerReqValidation,
  updateReqValidation,
} = require("./store_validation");

exports.login = async (req, res) => {
  const response = await services.login(req.body.email, req.body.password);
  return res.status(response.statusCode).send(response);
};

exports.resetPassword = async (req, res) => {
  const response = await services.resetPassword(req.user.store_id, req.body);
  res.status(response.statusCode).send(response);
};

exports.forgetPassword = async (req, res) => {
  const response = await services.forgetPassword(req.body);
  res.status(response.statusCode).send(response);
};

exports.resetForgettenPassword = async (req, res) => {
  const response = await services.resetForgettenPassword(req.body);
  res.status(response.statusCode).send(response);
};

exports.addStore = async (req, res) => {
  const { error } = registerReqValidation(req.body);
  if (error) {
    return res.status(400).send({
      statusCode: 400,
      message: error.details[0].message,
    });
  }
  const response = await services.addStore(req.body);
  return res.status(response.statusCode).send(response);
};

exports.updateStore = async (req, res) => {
  const { error } = updateReqValidation(req.body);
  if (error) {
    return res.status(400).send({
      statusCode: 400,
      message: error.details[0].message,
    });
  }

  let id = req.params.id;
  const response = await services.updateStore(id, req.body);
  return res.status(response.statusCode).send(response);
};

exports.getStore = async (req, res) => {
  const response = await services.getStore(req.params.id);
  return res.status(response.statusCode).send(response);
};

exports.getAllStores = async (req, res) => {
  const response = await services.getAllStores();
  return res.status(response.statusCode).send(response);
};

exports.deleteStore = async (req, res) => {
  const response = await services.deleteStore(req.params.id);
  return res.status(response.statusCode).send(response);
};

exports.getPreSignedUrl = async (req, res) => {
  const response = await services.getPreSignedUrl(
    req.user.store_id,
    req.params.filename
  );
  return res.status(response.statusCode).send(response);
};
