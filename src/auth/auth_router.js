const express = require("express");
const storeController = require("../stores/store_controller");
const router = express.Router();
const passport = require("passport");

/**
 * @typedef StoreAdmin
 * @property {string} email.required - store email - eg: info@honeystore.com
 * @property {string} password.required - password - eg: pas1234
 */

/**
 * @typedef ResetPassword
 * @property {string} oldPassword - old password - eg: 123456
 * @property {string} newPassword - new password - eg: 1235426
 * @property {string} confirmPassword - confirm password - eg: 1235426
 */

/**
 * @typedef AdminEmail
 * @property {string} email -store email - eg: info@honeystore.com
 */

/**
 * @typedef AdminResetForgettenPassword
 * @property {string} email - store email - eg: info@honeystore.com
 * @property {string} newPassword - new password - eg: 1235426
 * @property {string} confirmPassword - confirm password - eg: 1235426
 * @property {string} token - reset password token - eg: 85b2cae9c0f5c67c4a3319ec20f83992
 */

/**
 * This route logs in user
 * @route POST /auth/login
 * @group Auth
 * @param {StoreAdmin.model} credentials.body.required
 * @returns {object} 200
 */
router.post("/login", storeController.login);

/**
 * This route resets store admin password
 * @route PATCH /auth/reset-password
 * @param {ResetPassword.model} passwords.body.required
 * @group Auth
 * @security JWT
 * @returns {object} 200
 */
router.patch(
  "/reset-password",
  passport.authenticate("jwt", { session: false }),
  storeController.resetPassword
);

/**
 * This route sends an email with a link to reset the forgetten password
 * @route PATCH /auth/forget-password-admin
 * @group Auth
 * @param {AdminEmail.model} email.body.required
 * @returns {object} 200
 */
router.patch("/forget-password-admin", storeController.forgetPassword);

/**
 * This route reset forgetten password
 * @route PATCH /auth/reset-forgetten-password-admin
 * @group Auth
 * @param {AdminResetForgettenPassword.model} data.body.required
 * @returns {object} 200
 */
router.patch(
  "/reset-forgetten-password-admin",
  storeController.resetForgettenPassword
);

module.exports = router;
