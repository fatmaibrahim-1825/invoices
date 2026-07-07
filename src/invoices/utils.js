const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const utils = require("../utils/utils");
const getStream = require("get-stream");
const { BUCKET_PATH } = require("../config");
const axios = require("axios");

exports.printInvoice = async (store, invoice) => {
  const qr_image = await generateQRCode(
    store.seller_name_en,
    store.vat_registration_number,
    invoice.issue_date.toISOString(),
    invoice.total_cost.toString(),
    invoice.vat_total.toString()
  );
  const text = {
    title: {
      ar: "فاتورة ضريبية مبسطة",
      en: "Simplified Electronic Invoice",
    },
    type: {
      ar: "الفاتورة",
      en: "Invoice",
    },
  };

  const pdfBuffer = await createInvoice(store, invoice, qr_image, text);
  const inv_path = `stores/${store._id}/invoices/${invoice._id}_invoice.pdf`;
  const response = await utils.putPDFFileInBucket(pdfBuffer, inv_path);
  if (response) {
    const pdf_url = BUCKET_PATH + inv_path;
    return pdf_url;
  }
};

exports.printNote = async (store, invoice) => {
  const qr_image = await generateQRCode(
    store.seller_name_en,
    store.vat_registration_number,
    invoice.issue_date.toISOString(),
    invoice.total_cost.toString(),
    invoice.vat_total.toString()
  );
  const text = {
    title: {
      ar: "إشـعار إلكترونـي مبسـط",
      en: "Simplified Electronic Note",
    },
    type: {
      ar: "الإشعار",
      en: "Note",
    },
  };

  const pdfBuffer = await createInvoice(store, invoice, qr_image, text);
  const inv_path = `stores/${store._id}/Notes/${invoice._id}_note.pdf`;
  const response = await utils.putPDFFileInBucket(pdfBuffer, inv_path);
  if (response) {
    const pdf_url = BUCKET_PATH + inv_path;
    return pdf_url;
  }
};

generateQRCode = async (
  seller_name_en,
  vat_registration_number,
  timestamp,
  total_cost,
  vat_total
) => {
  const seller_name_buffer = getTLVForValue("1", seller_name_en);
  const vat_registration_number_buffer = getTLVForValue(
    "2",
    vat_registration_number
  );
  const timestamp_buffer = getTLVForValue("3", timestamp);
  const total_cost_buffer = getTLVForValue("4", total_cost);
  const vat_total_buffer = getTLVForValue("5", vat_total);

  const tags_buffers_array = [
    seller_name_buffer,
    vat_registration_number_buffer,
    timestamp_buffer,
    total_cost_buffer,
    vat_total_buffer,
  ];
  const qr_code_buffer = Buffer.concat(tags_buffers_array);
  const qr_code_b64 = qr_code_buffer.toString("base64");

  const qr_image = await QRCode.toBuffer(qr_code_b64);

  return qr_image;
};

getTLVForValue = (tag_number, tag_value) => {
  if (tag_number && tag_value) {
    const tag_number_buffer = Buffer.from([tag_number], "utf8");
    const tag_value_length_buffer = Buffer.from([tag_value.length], "utf8");
    const tag_value_buffer = Buffer.from(tag_value, "utf8");
    const buffers_array = [
      tag_number_buffer,
      tag_value_length_buffer,
      tag_value_buffer,
    ];
    return Buffer.concat(buffers_array);
  } else {
    throw new Error(
      `the tag_value for tag_number ${tag_number} is not defined`
    );
  }
};

createInvoice = async (store, invoice, qr_image, text) => {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.registerFont(
    "Amiri",
    "public/Noto_Naskh_Arabic/static/NotoNaskhArabic-Regular.ttf"
  );
  doc.registerFont("Amiri", "public/Noto_Sans/Amiri-Regular.ttf");
  doc.registerFont(
    "AmiriB",
    "public/Noto_Naskh_Arabic/static/NotoNaskhArabic-Bold.ttf"
  );
  doc.registerFont("AmiriB", "public/Noto_Sans/Amiri-Bold.ttf");

  doc.registerFont("Amiri", "public/Amiri/Amiri-Regular.ttf");
  doc.registerFont("AmiriB", "public/Amiri/Amiri-Bold.ttf");
  await generateHeader(doc, store, qr_image, text, invoice);
  generateCustomerInformation(doc, invoice, store, text);
  await generateInvoiceTable(doc, invoice, store);
  // generateFooter(doc, store);

  doc.end();
  return await getStream.buffer(doc);
};

generateHeader = async (doc, store, qr_image, text, invoice) => {
  const y = 50;
  if (store.img_url) {
    const image = await displayImage(store.img_url);

    doc.image(image, 470, y, { height: 65, align: "right" });
  }
  if (store.seller_name_ar) {
    doc
      .fillColor("#444444")
      .fontSize(10)
      .font("AmiriB")
      .text(store.seller_name_ar, 350, y + 70, {
        features: ["rtla"],
        align: "right",
      });
  } else {
    doc
      .fillColor("#444444")
      .fontSize(10)
      .font("AmiriB")
      .text(store.seller_name_en, 350, y + 70, {
        align: "right",
      });
  }

  doc
    .fontSize(8)
    .text("الرقم الضريبي:", 500, y + 85, { align: "right", features: ["rtla"] })
    .font("Amiri")
    .text(store.vat_registration_number, 420, y + 86, {
      width: 80,
      align: "right",
    });
  if (store.store_address) {
    doc.text(store.store_address, 450, y + 100, {
      align: "right",
      features: ["rtla"],
    });
  }

  doc
    .font("Helvetica")
    .image(qr_image, 50, 50, { width: 80, align: "left" })
    .moveDown(3)
    .fontSize(14)
    .font("AmiriB")
    .text(text.title.ar, 50, 160, {
      features: ["rtla"],
      align: "center",
    })
    .font("Amiri")
    .text(text.title.en, 50, 180, {
      align: "center",
    });
  if (invoice.invoice_reference) {
    doc
      .font("Amiri")
      .fontSize(10)
      .text("رقم الفاتورة", 300, 200, {
        features: ["rtla"],
        // align: "center",
      })
      .font("Amiri")
      .text(invoice.invoice_reference, 230, 200, {
        align: "center",
        width: 90,
        //  align: "center",
      });
  }
};

generateCustomerInformation = (doc, invoice, store, text) => {
  generateHr(doc, 230);

  const customerInformationTop = 235;

  doc
    .fontSize(10)
    .font("AmiriB")
    .text(text.type.en + " Number:", 50, customerInformationTop)
    .font("Amiri")
    .text(
      invoice.invoice_number || invoice.note_number,
      150,
      customerInformationTop
    )
    .font("AmiriB")
    .text(text.type.en + " Issue Date:", 50, customerInformationTop + 17)
    .font("Amiri")
    .text(formatDate(invoice.issue_date), 150, customerInformationTop + 17)
    .font("AmiriB");
  if (invoice.PO) {
    doc
      .text("PO:", 50, customerInformationTop + 50)
      .font("Amiri")
      .text(invoice.PO, 150, customerInformationTop + 50);
  }
  if (invoice.customer_vat_number) {
    doc
      .text(":الرقم الضريبي للعميل", 50, customerInformationTop + 67, {
        features: ["rtla"],
      })
      .font("Amiri")
      .text(invoice.customer_vat_number, 150, customerInformationTop + 67);
  }
  doc
    .font("AmiriB")
    .text("رقم " + text.type.ar + ": ", 455, customerInformationTop, {
      features: ["rtla"],
      align: "right",
      width: 90,
    })
    .font("Amiri")
    .text(
      invoice.invoice_number || invoice.note_number,
      404,
      customerInformationTop
    );

  doc
    .font("AmiriB")
    .text(
      "تاريخ اصدار " + text.type.ar + ": ",
      450,
      customerInformationTop + 17,
      {
        features: ["rtla"],
        align: "right",
      }
    )
    .font("Amiri")
    .text(formatDate(invoice.issue_date), 404, customerInformationTop + 17, {
      features: ["rtla"],
    })
    .moveDown();

  generateHr(doc, 275);
  doc
    .font("AmiriB")
    .text("اسم العميل:", 450, customerInformationTop + 50, {
      features: ["rtla"],
      align: "right",
    })
    .font("Amiri")
    .text(invoice.customer_name, 404, customerInformationTop + 50, {
      features: ["rtla"],
    });
  doc
    .font("AmiriB")
    .text("رقم العميل:", 450, customerInformationTop + 67, {
      features: ["rtla"],
      align: "right",
    })
    .font("Amiri")
    .text(invoice.customer_number, 404, customerInformationTop + 67, {
      features: ["rtla"],
    });
  generateHr(doc, 320);
};

generateInvoiceTable = async (doc, invoice, store) => {
  let i;
  const invoiceTableTop = 340;

  doc.font("AmiriB");
  generateTableRow(
    invoice,
    doc,
    invoiceTableTop,
    "اسم المنتج",
    "تفاصيل المنتج",
    "الحجم",
    "السعر",
    "الكمية",
    "المجموع"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Amiri");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    if (!item.total) {
      item.total = item.price * item.quantity;
    }
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      invoice,
      doc,
      position,
      item.name,
      item.description,
      item.size,
      item.price,
      item.quantity,
      item.total
    );
    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  doc
    .fontSize(10)
    .text("المجموع ", 100, subtotalPosition, {
      width: 200,
      features: ["rtla"],
    })
    .text(` ريال  ${invoice.cost.toFixed(2)} `, 0, subtotalPosition, {
      width: 90,
      align: "right",
    });
  const paidToDatePosition = subtotalPosition + 20;
  doc
    .fontSize(10)
    .text("خصم ", 120, paidToDatePosition, {
      width: 200,
      features: ["rtla"],
    })
    .text("%" + store.discount_rate, 100, paidToDatePosition, {
      width: 200,
    });

  if (invoice.discount_total !== 0) {
    doc.text(
      ` ريال  ${invoice.discount_total.toFixed(2)} `,
      0,
      paidToDatePosition,
      {
        width: 90,
        align: "right",
      }
    );
  } else {
    doc.text(` ريال  0`, 0, paidToDatePosition, {
      width: 90,
      align: "right",
    });
  }

  const paidToDatePosition2 = paidToDatePosition + 20;
  doc
    .fontSize(10)
    .text("الإجمالي الخاضع للضريبة", 100, paidToDatePosition2, {
      width: 200,
      features: ["rtla"],
    })
    .text(
      ` ريال  ${(invoice.total_cost - invoice.vat_total).toFixed(2)} `,
      0,
      paidToDatePosition2,
      {
        width: 90,
        align: "right",
      }
    );
  const paidToDatePosition1 = paidToDatePosition2 + 20;

  doc
    .fontSize(10)
    .text("مجموع ضريبة القيمة المضافة", 100, paidToDatePosition1, {
      width: 200,
      features: ["rtla"],
    })
    .text(` ريال  ${invoice.vat_total.toFixed(2)} `, 0, paidToDatePosition1, {
      width: 90,
      align: "right",
    });
  const totalPosition = paidToDatePosition1 + 20;

  doc
    .fontSize(10)
    .text("اجمالي المبلغ المستحق مع ضريبة القيمة المضافة", 100, totalPosition, {
      width: 200,
      features: ["rtla"],
    })
    .text(` ريال  ${invoice.total_cost.toFixed(2)} `, 0, totalPosition, {
      width: 90,
      align: "right",
    });
  if (store.stamp_url) {
    const stamp = await displayImage(store.stamp_url);
    doc.image(stamp, 100, totalPosition + 30, { height: 65, align: "right" });
  }

  doc.fontSize(10).font("Amiri");
  if (store.email) {
    doc.text(store.email, 50, totalPosition + 90, {
      align: "center",
      width: 500,
    });
  }
  doc.text(store.message, 50, totalPosition + 100, {
    align: "center",
    width: 500,
    features: ["rtla"],
  });
  if (invoice.demo) {
    doc
      .fontSize(14)
      .text("----------This invoice is for demo purpose----------", 0, 0, {
        align: "center",
        // width: 500,
        // features: ["rtla"],
      });
  }
};

// generateFooter = (doc, store) => {
// doc.fontSize(10).font("Amiri");
// if (store.email) {
//   doc.text(store.email, 50, 750, { align: "center", width: 500 });
// }
// doc.text("شكرا لشرائك من المتجر. نتمنى لك يوماً رائعاً!",
//  50,
//   770, {
//   align: "center",
//   width: 500,
//   features: ["rtla"],
// });
// };

generateTableRow = (
  invoice,
  doc,
  y,
  name,
  description,
  size,
  unitCost,
  quantity,
  total
) => {
  doc
    .fontSize(10)
    .text(name, 445, y, { width: 100, align: "right", features: ["rtla"] })
    .text(description, 280, y, {
      width: 170,
      align: "right",
      features: ["rtla"],
    });
  if (!invoice.demo) {
    doc.text(size, 186, y, { width: 90, align: "right" });
  }
  doc
    .text(unitCost, 124, y, { width: 90, align: "right" })
    .text(quantity, 62, y, { width: 90, align: "right" })
    .text(total, 0, y, { width: 90, align: "right" });
};

generateHr = (doc, y) => {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

formatCurrency = (cents) => {
  return "$" + (cents / 100).toFixed(2);
};

formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
};

displayImage = async (url) => {
  let response = await axios.request({
    method: "GET",
    url: url,
    responseEncoding: "binary",
  });
  let responseData = response.data;
  let imgBinary = Buffer.from(responseData, "binary");
  let imgBase64 = imgBinary.toString("base64");
  let img = Buffer.from(imgBase64, "base64");
  return img;
};

isArabic = (strInput) => {
  var arregex = /[\u0600-\u06FF]/;
  if (arregex.test(strInput)) {
    return true;
  } else {
    return false;
  }
};
