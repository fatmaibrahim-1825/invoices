const { Note } = require("./Note");
const mongoose = require("mongoose");
const { Store } = require("../stores/Store");
const utils = require("../invoices/utils");

exports.getAllNotes = async (query) => {
  const notes = await Note.find(query).select({
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return { statusCode: 200, notes };
};

exports.getNote = async (id) => {
  const validId = mongoose.isValidObjectId(id);
  if (!validId) return { statusCode: 400, message: "Id is not valid" };

  const note = await Note.findById(id).select({
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!note) return { statusCode: 404, message: "Note not found." };
  return { statusCode: 200, note };
};

exports.addNote = async (store_id, data) => {
  const store = await Store.findById(store_id);
  if (!store) {
    return { statusCode: 400, message: "Store not found" };
  }
  let note = await Note.findOne({
    note_number: data.note_number,
    store_id,
  });
  if (note) {
    return {
      statusCode: 400,
      message: "note number must be unique",
    };
  }
  note = await new Note(data);
  note.store_id = store_id;
  if (
    store.seller_name_en &&
    store.vat_registration_number &&
    note.issue_date &&
    note.total_cost &&
    note.vat_total
  ) {
    const pdf_url = await utils.printNote(store, note);
    note.pdf_url = pdf_url;
    note = await note.save();
    return { statusCode: 200, pdf_url: pdf_url };
  } else {
    return {
      statusCode: 400,
      message: "complete store and note data",
    };
  }
};
