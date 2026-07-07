const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
  {
    note_number: {
      type: Number,
      required: true,
    },
    invoice_reference: {
      type: Number,
      required: true,
    },
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },
    items: [
      {
        name: String,
        description: String,
        size: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    PO: {
      type: String,
    },
    customer_name: {
      type: String,
    },
    customer_number: {
      type: Number,
    },
    customer_vat_number: {
      type: String,
      length: 15,
    },
    cost: {
      type: Number,
      required: true,
    },
    total_cost: {
      type: Number,
      required: true,
    },
    vat_total: {
      type: Number,
      required: true,
    },
    discount_total: {
      type: Number,
      required: true,
    },
    issue_date: {
      type: Date,
      required: true,
    },
    pdf_url: {
      type: String,
    },
  },
  { timestamps: true }
);
noteSchema.index({ note_number: 1, store_id: 1 }, { unique: true });

const Note = model("notes", noteSchema);

function validateNewNote(note) {
  const schema = Joi.object({
    note_number: Joi.number().required(),
    note_reference: Joi.number().required(),
    items: Joi.array().required(),
    PO: Joi.string(),
    customer_name: Joi.string(),
    customer_number: Joi.number(),
    cost: Joi.number.required(),
    total_cost: Joi.number().required(),
    vat_total: Joi.number().required(),
    discount_total: Joi.number().required(),

    issue_date: Joi.date().required(),
  });
  return schema.validate(note);
}

exports.Note = Note;
exports.validateNewNote = validateNewNote;
