// const userServices = require("./user_services");

// exports.login = async (req, res) => {
//   const response = await userServices.login(
//     req.body.username,
//     req.body.password
//   );
//   return res.status(response.statusCode).send(response);
// };

// exports.resetPassword = async (req, res) => {
//   const response = await userServices.resetPassword(req.params.id, req.body);
//   res.status(response.statusCode).send(response);
// };

// exports.getMyInfo = async (req, res) => {
//   const response = await userServices.getMyInfo(req.user.username);
//   res.status(response.statusCode).send(response);
// };

// exports.getAllUsers = async (req, res) => {
//   const users = await userServices.getAllUsers(req.query);
//   res.send(users);
// };

// exports.getUser = async (req, res) => {
//   const response = await userServices.getUser(req.params.id);
//   res.status(response.statusCode).send(response);
// };

// exports.addUser = async (req, res) => {
//   const response = await userServices.addUser(req.body);
//   res.status(response.statusCode).send(response);
// };

// exports.updateUser = async (req, res) => {
//   const response = await userServices.updateUser(req.params.id, req.body);
//   res.status(response.statusCode).send(response);
// };

// exports.deleteUser = async (req, res) => {
//   const response = await userServices.deleteUser(req.params.id);
//   res.status(response.statusCode).send(response);
// };
