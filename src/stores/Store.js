const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const storeSchema = new Schema(
  {
    seller_name_en: {
      type: String,
    },
    seller_name_ar: {
      type: String,
    },
    vat_registration_number: {
      type: String,
      length: 15,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    store_address: {
      type: String,
    },
    message: String,
    vat_rate: {
      type: Number,
      default: 15,
    },
    discount_rate: {
      type: Number,
      default: 0,
    },
    img_url: {
      type: String,
    },
    stamp_url: {
      type: String,
    },
    resetToken: String,
    expireToken: Date,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

storeSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

storeSchema.methods.isValidPassword = async function (password) {
  const store = this;
  const compare = await bcrypt.compare(password, store.password);
  return compare;
};
storeSchema.methods.getClassName = () => {
  return "Store";
};
const Store = model("stores", storeSchema);
exports.Store = Store;
