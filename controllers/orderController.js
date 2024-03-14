import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/index.js";
import jwtUtils from "../utils/index.js";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

async function createOrder(req, res) {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id : ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;

    console.log(dbProduct);

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    // add item to order
    orderItems = [...orderItems, singleOrderItem];

    // calculate subtotal
    subtotal += item.amount * price;
  }

  // calculate total
  const total = tax + shippingFee + subtotal;

  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
}

async function getAllOrders(req, res) {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

async function getSingleOrder(req, res) {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }

  jwtUtils.checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
}

async function getCurrentUserOrders(req, res) {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

async function updateOrder(req, res) {
  const { id: orderId } = req.params;

  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }

  jwtUtils.checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;

  order.status = "paid";

  await order.save();

  res.status(StatusCodes.OK).json({ order });
}

export {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
