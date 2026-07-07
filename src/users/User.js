// const { Schema, model } = require("mongoose");
// const bcrypt = require("bcryptjs");
// const Joi = require("joi");

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       unique: true,
//       required: true,
//       minlength: 3,
//       maxlength: 50,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 5,
//       maxlength: 1024,
//     },
//     name: {
//       type: String,
//       required: true,
//       minlength: 3,
//       maxlength: 50,
//     },
//     // email: {
//     //   type: String,
//     //   required: true,
//     //   minlength: 5,
//     //   maxlength: 255,
//     //   unique: true,
//     // },
//     // country_code: {
//     //   type: String,
//     // },
//     // mobile: {
//     //   type: String,
//     //   required: true,
//     //   minlength: 10,
//     //   unique: true,
//     // },
//     role: {
//       type: String,
//       default: "user",
//       enum: ["user", "manager", "admin", "super-admin"],
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   const user = this;
//   const hash = await bcrypt.hash(this.password, 12);
//   this.password = hash;
//   next();
// });

// userSchema.methods.isValidPassword = async function (password) {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);
//   return compare;
// };

// const User = model("User", userSchema);

// function validateNewUser(user) {
//   const schema = Joi.object({
//     username: Joi.string().min(3).max(50).required(),
//     password: Joi.string().min(5).max(255).required(),
//     name: Joi.string().min(3).max(50).required(),
//     // email: Joi.string().min(5).max(255).email().required(),
//     // mobile: Joi.string().min(10).required(),
//     role: Joi.string().valid("user", "manager", "admin", "super-admin"),
//     // isAdmin: Joi.boolean(),
//   });
//   return schema.validate(user);
// }

// function validateUpdatedUser(user) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(50),
//     // email: Joi.string().min(5).max(255).email(),
//     // mobile: Joi.string().min(10),
//     role: Joi.string().valid("user", "manager", "admin", "super-admin"),
//     // isAdmin: Joi.boolean(),
//   });
//   return schema.validate(user);
// }

// exports.User = User;
// exports.validateNewUser = validateNewUser;
// exports.validateUpdatedUser = validateUpdatedUser;
