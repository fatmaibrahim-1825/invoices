const express = require("express");
const router = express.Router();
const controller = require("./invoice_controller");
const passport = require("passport");

/**
 * @typedef Item
 * @property {string} name.required - item name - eg: row honey
 * @property {string} description - item description - eg: row honey
 * @property {string} size - item size - eg: 100 ml
 * @property {integer} quantity.required - quantity - eg: 2
 * @property {integer} price.required - price - eg: 25
 * @property {integer} total - quantity * price - eg: 50
 */

/**
 * @typedef Invoice
 * @property {integer} invoice_number.required - invoice number - eg: 12
 * @property {Array.<Item>} items.required - ordered items
 * @property {string} PO - purchase order number - eg: po123456
 * @property {string} customer_name - customer name - eg: Aldanoub
 * @property {integer} customer_number - customer number - eg: 133
 * @property {integer} customer_vat_number - customer vat registration number - eg: 300154289654878
 * @property {integer} cost.required - items cost - eg: 1100
 * @property {integer} total_cost.required - invioce total cost - eg: 1150
 * @property {integer} vat_total.required - vat_total - eg: 150
 * @property {integer} discount_total.required - discount_total - eg: 100
 * @property {date} issue_date.required - issue_date - eg: 2021-10-20T07:37:24.345Z
 */

/**
 * @typedef DemoStore
 * @property {string} seller_name_en - seller name in English - eg: Honey Store
 * @property {string} seller_name_ar - seller name in Arabic - eg: شركة العسل
 * @property {string} email.required - email - eg: info@honeystore.com
 * @property {string} vat_registration_number - vat registration number for e-invoice - eg: 300154289654879
 * @property {string} store_address - store address - eg: honystore.com
 * @property {string} message - store message - eg: Thanks for your visit, Have a nice day.
 * @property {number} vat_rate - vat rate  - eg: 15
 * @property {number} discount_rate - discount rate - eg: 10
 * @property {string} img_url - store image - eg: https://i.pinimg.com/550x/5a/d8/cf/5ad8cf34f80d6a2067d39f48927ee5dc.jpg
 * @property {string} stamp_url - store stamp - eg: https://i.pinimg.com/550x/5a/d8/cf/5ad8cf34f80d6a2067d39f48927ee5dc.jpg
 */

/**
 * @typedef Demo
 * @property {Invoice.model} invoice - demo invoice
 * @property {DemoStore.model} store - demo store
 */

/**
 * This route returns all invoices for the logged-in store
 * @route GET /invoices
 * @param {string} store_id.query.required
 * @group Invoices
 * @security JWT
 * @returns {object} 200
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getAllInvoices
);

/**
 * This route returns invoice by id
 * @route GET /invoices/{id}
 * @param {string} id.path.required
 * @group Invoices
 * @security JWT
 * @returns {object} 200
 */
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getInvoice
);

/**
 * This route adds an invoice
 * @route POST /invoices
 * @param {Invoice.model} invoice.body.required
 * @group Invoices
 * @security JWT
 * @returns {object} 200
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.addInvoice
);

/**
 * This route adds a demo invoice
 * @route POST /invoices/demo
 * @param {Demo.model} data.body.required
 * @group Invoices
 * @returns {object} 200
 */
router.post("/demo", controller.addDemoInvoice);

/**
 * This route returns invoice data by id
 * @route GET /invoices/data/{id}
 * @param {string} id.path.required
 * @group Invoices
 * @security JWT
 * @returns {object} 200
 */
router.get(
  "/data/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getInvoiceData
);

module.exports = router;
