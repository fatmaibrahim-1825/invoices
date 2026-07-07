// const express = require("express");
// const userController = require("./user_controller");
// const router = express.Router();
// const { User } = require("./User");
// // const admin = require("../middlewares/admin");
// // const manager = require("../middlewares/manager");
// // const user = require("../middlewares/user");

// /**
//  * @typedef User
//  * @property {string} username.required - user username - eg: fatma
//  * @property {string} password.required - user password - eg: 123456
//  * @property {string} name.required - user name - eg: Fatma Siraj
// //  * @property {string} email.required - user email - eg: fatma@admin.com
// //  * @property {string} mobile.required - user mobile - eg: 0578345643
//  * @property {enum} role - user role - eg: user,manager,admin,super-admin
// //  * @property {boolean} isAdmin - is admin - eg: false
//  */

// /**
//  * @typedef UpdateUser
//  * @property {string} name - user name - eg: Asma Ibrahim
// //  * @property {string} email - user email - eg: asma@admin.com
// //  * @property {string} mobile - user mobile - eg: 0503456345
//  * @property {enum} role - user role - eg: user,manager,admin,super-admin
// //  * @property {boolean} isAdmin - is admin - eg: false
//  */

// /**
//  * @typedef ResetPassword
//  * @property {string} oldPassword - old password - eg: 123456
//  * @property {string} newPassword - new password - eg: 1235426
//  * @property {string} confirmPassword - confirm password - eg: 1235426
//  */

// /**
//  * This route returns the current user
//  * @route GET /users/profile
//  * @group Users
//  * @security JWT
//  * @returns {object} 200
//  */
// router.get("/profile", userController.getMyInfo);

// /**
//  * This route returns all users
//  * @route GET /users
//  * @group Users
//  * @param {enum} role.query - user role - eg: user,manager,admin,super-admin
//  * @security JWT
//  * @returns {object} 200
//  */
// router.get("/", userController.getAllUsers);

// /**
//  * This route returns user by id
//  * @route GET /users/{id}
//  * @param {string} id.path.required
//  * @group Users
//  * @security JWT
//  * @returns {object} 200
//  */
// router.get("/:id", userController.getUser);

// /**
//  * This route adds new user
//  * @route POST /users
//  * @param {User.model} user.body.required
//  * @group Users
//  * @security JWT
//  * @returns {object} 200
//  */
// router.post("/", userController.addUser);

// /**
//  * This route updates user's info
//  * @route PATCH /users/{id}
//  * @param {string} id.path.required
//  * @param {UpdateUser.model} user.body.required
//  * @group Users
//  * @security JWT
//  * @returns {object} 200
//  */
// router.patch("/:id", userController.updateUser);

// /**
//  * This route deletes user by id
//  * @route DELETE /users/{id}
//  * @param {string} id.path.required
//  * @group Users
//  * @security JWT
//  * @returns {object} 200
//  */
// router.delete("/:id", userController.deleteUser);

// /**
//  * This route resets user password
//  * @route PATCH /users/reset-password/{id}
//  * @param {string} id.path.required
//  * @param {ResetPassword.model} passwords.body.required
//  * @group Users
//  * @security JWT
//  * @returns {object} 200
//  */
// router.patch("/reset-password/:id", userController.resetPassword);

// module.exports = router;
