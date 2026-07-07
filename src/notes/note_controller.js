const services = require("./note_services");

exports.getNote = async (req, res) => {
  const response = await services.getNote(req.params.id);
  return res.status(response.statusCode).send(response);
};

exports.getAllNotes = async (req, res) => {
  const response = await services.getAllNotes(req.query);
  return res.status(response.statusCode).send(response);
};

exports.addNote = async (req, res) => {
  const response = await services.addNote(req.user.store_id, req.body);
  return res.status(response.statusCode).send(response);
};
