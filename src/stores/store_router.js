const express = require("express");
const router = express.Router();
const controller = require("./store_controller");
const passport = require("passport");

/**
 * @typedef Store
 * @property {string} seller_name_en - seller name in English - eg: Honey Store
 * @property {string} seller_name_ar - seller name in Arabic - eg: شركة العسل
 * @property {string} email.required - email - eg: info@honeystore.com
 * @property {string} password.required - password - eg: pas1234
 */

/**
 * @typedef UpdatedStore
 * @property {string} vat_registration_number - vat registration number for e-invoice - eg: 300154289654879
 * @property {string} store_address - store address - eg: honystore.com
 * @property {string} message - store message - eg: Thanks for your visit, Have a nice day.
 * @property {number} vat_rate - vat rate  - eg: 15
 * @property {number} discount_rate - discount rate - eg: 10
 * @property {string} img_url - store image - eg: https://i.pinimg.com/550x/5a/d8/cf/5ad8cf34f80d6a2067d39f48927ee5dc.jpg
 * @property {string} stamp_url - store stamp - eg: https://i.pinimg.com/550x/5a/d8/cf/5ad8cf34f80d6a2067d39f48927ee5dc.jpg
 */

/**
 * This route returns pre-signed url
 * @route PUT /stores/pre-signed-url/{filename}
 * @param {string} filename.path.required
 * @group Stores
 * @security JWT
 * @returns {object} 200
 */
router.put(
  "/pre-signed-url/:filename",
  passport.authenticate("jwt", { session: false }),
  controller.getPreSignedUrl
);

/**
 * This route add a store
 * @route POST /stores
 * @param {Store.model} store.body.required
 * @group Stores
 * @security JWT
 * @returns {object} 200
 */
router.post("/", controller.addStore);

/**
 * This route updates a store
 * @route PUT /stores/{id}
 * @param {string} id.path.required
 * @param {UpdatedStore.model} store.body.required
 * @group Stores
 * @security JWT
 * @returns {object} 200
 */
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateStore
);

/**
 * This route retrives store information By ID
 * @route GET /stores/{id}
 * @param {string} id.path.required
 * @group Stores
 * @security JWT
 * @returns {object} 200
 */
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getStore
);

/**
 * This route retrives all stores
 * @route GET /stores
 * @group Stores
 * @security JWT
 * @returns {object} 200
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAllStores
);

/**
 * This route deletes store By ID
 * @route DELETE /stores/{id}
 * @param {string} id.path.required
 * @group Stores
 * @security JWT
 * @returns {object} 200
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteStore
);

module.exports = router;
