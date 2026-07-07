const { Store } = require("./Store");
const { validateEmail } = require("./store_validation");
const utils = require("../utils/utils");
const { BUCKET_PATH } = require("../config/index");
const jwt = require("jsonwebtoken");
const { sendEmailToResetPassword } = require("../utils/utils");
const { SECRET, EXPIRES_IN } = require("../config/index");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.login = async (email, password) => {
  const store = await Store.findOne({ email });

  if (!store) {
    return { statusCode: 404, message: "Store not found" };
  }

  const validate = await store.isValidPassword(password);
  if (!validate) {
    return { statusCode: 400, message: "Wrong Password" };
  }
  const body = {
    email: store.email,
    store_id: store._id,
  };
  const token = jwt.sign({ user: body }, SECRET, { expiresIn: EXPIRES_IN });

  return { statusCode: 200, token: "Bearer " + token };
};

exports.resetPassword = async (id, data) => {
  if (data.oldPassword && data.newPassword && data.confirmPassword) {
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return { statusCode: 400, message: "Id is not valid" };

    const store = await Store.findById(id);
    if (!store) return { statusCode: 404, message: "Store not found." };

    const validate = await store.isValidPassword(data.oldPassword);
    if (!validate) return { statusCode: 400, message: "wrong old password" };

    if (data.oldPassword !== data.newPassword) {
      if (data.newPassword === data.confirmPassword) {
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await Store.findByIdAndUpdate(
          id,
          { password: hashedPassword },
          { new: true }
        );
        return {
          statusCode: 200,
          message: "password updated successfully",
        };
      } else {
        return {
          statusCode: 400,
          message: "confirm password mismatched with the new one",
        };
      }
    } else {
      return {
        statusCode: 400,
        message: "new password can not be the same as the old one",
      };
    }
  } else {
    return { statusCode: 400, message: "Missing fields" };
  }
};

exports.forgetPassword = async (data) => {
  const store = await Store.findOne({ email: data.email });
  if (!store) return { statusCode: 404, message: "Store not found." };
  try {
    const response = await sendEmailToResetPassword(store);
    return response;
  } catch {
    return {
      statusCode: 500,
      message: "Sorry!! Something went wrong. Please try again later.",
    };
  }
};

exports.resetForgettenPassword = async (data) => {
  if (data.newPassword && data.confirmPassword) {
    const store = await Store.findOne({ email: data.email });
    if (!store) return { statusCode: 404, message: "Store not found." };

    if (store.resetToken === data.token && store.expireToken > new Date()) {
      if (data.newPassword === data.confirmPassword) {
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await Store.findByIdAndUpdate(
          store._id,
          { password: hashedPassword },
          { new: true }
        );
        return {
          statusCode: 200,
          message: "password updated successfully",
        };
      } else {
        return {
          statusCode: 400,
          message: "confirm password mismatched with the new one",
        };
      }
    } else {
      return {
        statusCode: 400,
        message: "The token is not valid",
      };
    }
  } else {
    return { statusCode: 400, message: "Missing fields" };
  }
};

exports.addStore = async (data) => {
  let emailRegistered = await validateEmail(data.email);
  if (!emailRegistered) {
    return { statusCode: 400, message: "Email already registered" };
  }

  let store = new Store(data);
  try {
    await store.save();
    return { statusCode: 201, message: "Store added successfully" };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message || "Somthing went wrong :(",
    };
  }
};

exports.updateStore = async (id, data) => {
  let store = await Store.findById(id);

  if (data.email && store.email !== data.email) {
    let emailRegistered = await validateEmail(data.email);
    if (!emailRegistered) {
      return {
        statusCode: 400,
        message: "Email already registered",
      };
    }
  }

  try {
    store = await Store.findByIdAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    ).select({
      password: 0,
      __v: 0,
      created_at: 0,
      updated_at: 0,
      resetToken: 0,
      expireToken: 0,
    });
    return { statusCode: 200, store };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message || "Somthing went wrong :(",
    };
  }
};

exports.getStore = async (id) => {
  try {
    let store = await Store.findById(id).select({
      password: 0,
      __v: 0,
      created_at: 0,
      updated_at: 0,
      resetToken: 0,
      expireToken: 0,
    });
    if (!store) {
      return { statusCode: 404, message: "Store not found" };
    }

    return { statusCode: 200, store };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message || "Somthing went wrong :(",
    };
  }
};

exports.getAllStores = async () => {
  try {
    let stores = await Store.find().select({
      password: 0,
      __v: 0,
      created_at: 0,
      updated_at: 0,
      resetToken: 0,
      expireToken: 0,
    });

    return { statusCode: 200, stores };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message || "Somthing went wrong :(",
    };
  }
};

exports.deleteStore = async (id) => {
  try {
    let store = await Store.findByIdAndDelete({ _id: id }, { new: true });
    return { statusCode: 200, message: "Store deleted successfully" };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message || "Somthing went wrong :(",
    };
  }
};

exports.getPreSignedUrl = async (store_id, filename) => {
  const fName = filename.replace(/[&\/\\#,+()$~% '":*?<>{}]/g, "_");
  const filePath = `stores/${store_id}/${fName}`;
  const signed_url = utils.getSignedUrl(filePath);
  const img_url = BUCKET_PATH + filePath;
  return { statusCode: 200, urls: { signed_url, img_url } };
};
