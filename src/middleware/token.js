const { Store } = require("../stores/Store");

module.exports = async (req, res, next) => {
  const store = await Store.findById(req.store._id);
  if (!store)
    return res.status(403).send({ statusCode: 403, message: "Access denied." });
  next();
};
