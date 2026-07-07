const mongoose = require("mongoose");
const { Invoice } = require("./Invoice");
const { Store } = require("../stores/Store");
const utils = require("./utils");
const { Note } = require("../notes/Note");

exports.getAllInvoices = async (query) => {
  const invoices = await Invoice.find(query).select({
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return { statusCode: 200, invoices };
};

exports.getInvoice = async (id) => {
  const validId = mongoose.isValidObjectId(id);
  if (!validId) return { statusCode: 400, message: "Id is not valid" };

  const invoice = await Invoice.findById(id).select({
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!invoice) return { statusCode: 404, message: "Invoice not found." };
  return { statusCode: 200, invoice };
};

exports.getInvoiceData = async (id) => {
  const validId = mongoose.isValidObjectId(id);
  if (!validId) return { statusCode: 400, message: "Id is not valid" };

  const invoice = await Invoice.findById(id).select({
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!invoice) return { statusCode: 404, message: "Invoice not found." };
  const notes = await Note.find({ invoice_reference: invoice.invoice_number });

  if (notes.length > 0) {
    for (let note of notes) {
      for (let note_item of note.items) {
        let c = 0;
        for (let inv_item of invoice.items) {
          if (note_item.name === inv_item.name)
            inv_item.quantity = inv_item.quantity - note_item.quantity;
          inv_item.total = inv_item.price * inv_item.quantity;
          c += inv_item.total;
        }
        invoice.cost = c;
        invoice.total_cost = c * 1.15;
        invoice.vat_total = (invoice.total_cost - invoice.cost).toFixed(2);
      }
    }
  }
  return { statusCode: 200, invoice };
};

exports.addInvoice = async (store_id, data) => {
  const store = await Store.findById(store_id);
  if (!store) {
    return { statusCode: 400, message: "Store not found" };
  }
  let invoice = await Invoice.findOne({
    invoice_number: data.invoice_number,
    store_id,
  });
  if (invoice) {
    return { statusCode: 400, message: "invoice number must be unique" };
  }
  invoice = await new Invoice(data);
  invoice.store_id = store_id;

  if (
    store.seller_name_en &&
    store.vat_registration_number &&
    invoice.issue_date &&
    invoice.total_cost &&
    invoice.vat_total
  ) {
    const pdf_url = await utils.printInvoice(store, invoice);
    invoice.pdf_url = pdf_url;
    invoice = await invoice.save();
    return { statusCode: 200, pdf_url: pdf_url };
  } else {
    return { statusCode: 400, message: "complete store and invoice data" };
  }
};

exports.addDemoInvoice = async (data) => {
  const store = data.store;

  const demoStore = await Store.findOne({ email: "demo@store.com" });

  let inv = await Invoice.find({ store_id: demoStore._id })
    .sort({ invoice_number: -1 })
    .limit(1);
  if (inv[0]) {
    data.invoice.invoice_number = inv[0].invoice_number + 1;
  } else {
    data.invoice.invoice_number = 1;
  }

  let invoice = await new Invoice(data.invoice);
  invoice.store_id = demoStore._id;
  invoice.demo = true;

  if (
    store.seller_name_en &&
    store.vat_registration_number &&
    invoice.issue_date &&
    invoice.total_cost &&
    invoice.vat_total
  ) {
    const pdf_url = await utils.printInvoice(store, invoice);
    invoice.pdf_url = pdf_url;
    invoice = await invoice.save();
    return { statusCode: 200, pdf_url: pdf_url };
  } else {
    return { statusCode: 400, message: "complete store and invoice data" };
  }
  // return { statusCode: 200, invoice, store };
};
