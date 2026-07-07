const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerOptions = require("./swagger-options");
const expressSwagger = require("express-swagger-generator");
const { DB_URL, PORT, BASE_PATH } = require("./src/config/index");
const storeRouter = require("./src/stores/store_router");
const invoiceRouter = require("./src/invoices/invoice_router");
const authRouter = require("./src/auth/auth_router");
const noteRouter = require("./src/notes/note_router");
const passport = require("passport");
require("./src/middleware/passport");

const app = express();
expressSwagger(app)(swaggerOptions);

app.use(morgan("tiny"));

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (err) => console.log(`can't connect to db\n${err}`));
db.once("open", () => console.log(`DB connected`));

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/stores`, storeRouter);
app.use(`${BASE_PATH}/invoices`, invoiceRouter);
app.use(
  `${BASE_PATH}/notes`,
  passport.authenticate("jwt", { session: false }),
  noteRouter
);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message || err });
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));
