module.exports = async (req, res, next) => {
  console.log(req.user);
  if (!req.user.isAdmin)
    return res.status(403).send({ statusCode: 403, message: "Access denied." });
  next();
};
