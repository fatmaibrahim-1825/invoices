const express = require("express");
const router = express.Router();
const controller = require("./note_controller");

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
 * @typedef Note
 * @property {integer} note_number.required - note number - eg: 1
 * @property {integer} invoice_reference.required - related invoice number - eg: 12
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
 * This route returns all notes - only admins and managers can get All notes
 * @route GET /notes
 * @param {string} store_id.query.required
 * @group Notes
 * @security JWT
 * @returns {object} 200
 */
router.get("/", controller.getAllNotes);

/**
 * This route returns note by id
 * @route GET /notes/{id}
 * @param {string} id.path.required
 * @group Notes
 * @security JWT
 * @returns {object} 200
 */
router.get("/:id", controller.getNote);

/**
 * This route adds an note
 * @route POST /notes
 * @param {Note.model} note.body.required
 * @group Notes
 * @security JWT
 * @returns {object} 200
 */
router.post("/", controller.addNote);

module.exports = router;
