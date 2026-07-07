// const { User, validateNewUser, validateUpdatedUser } = require("./User");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { SECRET, EXPIRES_IN } = require("../config/index");

// exports.getMyInfo = async (username) => {
//   const user = await User.findOne({ username }).select({
//     password: 0,
//     __v: 0,
//     createdAt: 0,
//     updatedAt: 0,
//   });

//   if (!user) return { statusCode: 404, message: "User not found." };

//   return { statusCode: 200, user };
// };

// exports.getAllUsers = async (query) => {
//   const users = await User.find(query).select({
//     password: 0,
//     __v: 0,
//     createdAt: 0,
//     updatedAt: 0,
//   });
//   return { statusCode: 200, users };
// };

// exports.getUser = async (id) => {
//   const validId = mongoose.isValidObjectId(id);
//   if (!validId) return { statusCode: 400, message: "Id is not valid" };

//   const user = await User.findById(id).select({
//     password: 0,
//     __v: 0,
//     createdAt: 0,
//     updatedAt: 0,
//   });

//   if (!user) return { statusCode: 404, message: "User not found." };

//   return { statusCode: 200, user };
// };

// exports.addUser = async (data) => {
//   const { error } = validateNewUser(data);
//   if (error) return { statusCode: 400, message: error.details[0].message };

//   let user = await User.findOne({ username: data.username });
//   if (user) return { statusCode: 400, message: "Username already registered." };

//   user = await User.findOne({ email: data.email });
//   if (user) return { statusCode: 400, message: "Email already registered." };

//   user = await User.findOne({ mobile: data.mobile });
//   if (user) return { statusCode: 400, message: "mobile already registered." };

//   user = new User(data);
//   await user.save();

//   return { statusCode: 200, message: "added successfully" };
// };

// exports.updateUser = async (id, data) => {
//   const validId = mongoose.isValidObjectId(id);
//   if (!validId) return { statusCode: 400, message: "Id is not valid" };

//   const { error } = validateUpdatedUser(data);
//   if (error) return { statusCode: 400, message: error.details[0].message };

//   let user = await User.findById(id);
//   if (!user) return { statusCode: 404, message: "User not found." };

//   if (data.email && user.email !== data.email) {
//     let user1 = await User.findOne({ email: data.email });
//     if (user1) return { statusCode: 400, message: "Email already registered." };
//   }

//   if (data.mobile && user.mobile !== data.mobile) {
//     let user1 = await User.findOne({ mobile: data.mobile });
//     if (user1)
//       return { statusCode: 400, message: "mobile already registered." };
//   }

//   await User.findByIdAndUpdate(id, data);

//   return { statusCode: 200, message: "added successfully" };
// };

// exports.deleteUser = async (id) => {
//   const validId = mongoose.isValidObjectId(id);
//   if (!validId) return { statusCode: 400, message: "Id is not valid" };

//   const user = await User.findByIdAndDelete(id);

//   if (!user) return { statusCode: 404, message: "User not found." };

//   return { statusCode: 200, message: "deleted successfully" };
// };

// exports.resetPassword = async (id, data) => {
//   if (data.oldPassword && data.newPassword && data.confirmPassword) {
//     const validId = mongoose.isValidObjectId(id);
//     if (!validId) return { statusCode: 400, message: "Id is not valid" };

//     const user = await User.findById(id);
//     if (!user) return { statusCode: 404, message: "User not found." };

//     const validate = await user.isValidPassword(data.oldPassword);
//     if (!validate) return { statusCode: 400, message: "wrong old password" };

//     if (data.oldPassword !== data.newPassword) {
//       if (data.newPassword === data.confirmPassword) {
//         const hashedPassword = await bcrypt.hash(data.newPassword, 10);
//         await User.findByIdAndUpdate(
//           id,
//           { password: hashedPassword },
//           { new: true }
//         );
//         return {
//           statusCode: 200,
//           message: "password updated successfully",
//         };
//       } else {
//         return {
//           statusCode: 400,
//           message: "confirm password mismatched with the new one",
//         };
//       }
//     } else {
//       return {
//         statusCode: 400,
//         message: "new password can not be the same as the old one",
//       };
//     }
//   } else {
//     return { statusCode: 400, message: "Missing fields" };
//   }
// };

// exports.login = async (username, password) => {
//   const user = await User.findOne({ username });

//   if (!user) {
//     return { statusCode: 404, message: "User not found" };
//   }

//   const validate = await user.isValidPassword(password);
//   if (!validate) {
//     return { statusCode: 400, message: "Wrong Password" };
//   }

//   const body = {
//     username: user.username,
//     name: user.name,
//     role: user.role,
//     isAdmin: false,
//   };
//   const token = jwt.sign({ user: body }, SECRET, { expiresIn: EXPIRES_IN });

//   return { statusCode: 200, token: "Bearer " + token };
// };
