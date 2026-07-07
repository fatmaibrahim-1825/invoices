const services = require("./invoice_services");

exports.getInvoice = async (req, res) => {
  const response = await services.getInvoice(req.params.id);
  return res.status(response.statusCode).send(response);
};

exports.getAllInvoices = async (req, res) => {
  const response = await services.getAllInvoices(req.query);
  return res.status(response.statusCode).send(response);
};

exports.addInvoice = async (req, res) => {
  const response = await services.addInvoice(req.user.store_id, req.body);
  return res.status(response.statusCode).send(response);
};

exports.getInvoiceData = async (req, res) => {
  const response = await services.getInvoiceData(req.params.id);
  return res.status(response.statusCode).send(response);
};

exports.addDemoInvoice = async (req, res) => {
  const response = await services.addDemoInvoice(req.body);
  return res.status(response.statusCode).send(response);
};
