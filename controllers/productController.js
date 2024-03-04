import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";

const createProduct = (req, res) => {
  res.send("Create product");
};

const getAllProducts = (req, res) => {
  res.send("Get all products");
};

const getSingleProduct = (req, res) => {
  res.send("Get single Product");
};

const updateProduct = (req, res) => {
  res.send("Update product");
};

const deleteProduct = (req, res) => {
  res.send("Delete product");
};

const uploadImage = (req, res) => {
  res.send("Upload image");
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
