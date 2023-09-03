import slugify from "slugify";
import productModal from "../models/productModal.js";
import fs from "fs";
import categoryModal from "../models/categoryModal.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';
dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModal({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};
export const getProductController = async (req, resp) => {
  try {
    const products = await productModal
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    resp.status(200).send({
      success: true,
      totalcount: products.length,
      message: "all products",
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "error in getting product",
      error: error.message,
    });
  }
};
export const getSingleProductController = async (req, resp) => {
  try {
    const product = await productModal
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    resp.status(200).send({
      success: true,
      message: "product fetched succesfully",
      product,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "error in getting product",
      error,
    });
  }
};

export const ProductPhotoController = async (req, resp) => {
  try {
    const product = await productModal.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      resp.set("Content-Type", product.photo.contentType);
      return resp.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, resp) => {
  try {
    await productModal.findByIdAndDelete(req.params.pid).select("-photo");
    resp.status(200).send({
      success: true,
      message: "deleting products successfully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in deleting products",
      error,
    });
  }
};

export const createUpdateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModal.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updated crearing product",
    });
  }
};

export const productFilterController = async (req, resp) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModal.find(args);
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "Error While filter Product",
      error,
    });
  }
};

export const productCountController = async (req, resp) => {
  try {
    const total = await productModal.find({}).estimatedDocumentCount();
    resp.status(200).send({
      success: true,
      message: "no of porduct",
      total,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "error inproduct filter",
      error,
    });
  }
};

export const productListController = async (req, resp) => {
  try {
    const perpage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModal
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ cretedAt: -1 });
    resp.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "error in per product",
      error,
    });
  }
};

export const searchPorductController = async (req, resp) => {
  try {
    const { keyword } = req.params;
    const result = await productModal
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    resp.json(result);
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "error in searching the product",
      error,
    });
  }
};

export const relatedPorductController = async (req, resp) => {
  try {
    const { pid, cid } = req.params;
    const product = await productModal
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    resp.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "error while getting realted product",
      error,
    });
  }
};
export const productCategoryController = async (req, resp) => {
  try {
    const category = await categoryModal.findOne({ slug: req.params.slug });
    const products = await productModal.find({ category }).populate("category");
    resp.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    resp.status(400).send({
      success: false,
      message: "product category not found",
      error,
    });
  }
};

export const braintreeTokenController = async (req, resp) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        resp.status(500).send(err);
      } else {
        resp.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const braintreePaymentsController = async (req, resp) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));
    let newTransection = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true, //submit for settlement
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          resp.json({ ok: true });
        } else {
          resp.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
