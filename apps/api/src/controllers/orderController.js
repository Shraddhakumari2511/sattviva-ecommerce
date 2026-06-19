import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {


    

  try {

    console.log("BODY:", req.body);
    const {
  fullName,
  phone,
  address,
  city,
  state,
  pincode,
  razorpayOrderId,
  razorpayPaymentId,
} = req.body;
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} is out of stock`,
        });
      }

      product.stock -= item.quantity;

      await product.save();

      totalAmount +=
        product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
  user: req.user.userId,

  items: orderItems,

  totalAmount,

  paymentStatus: "Paid",

  razorpayOrderId,

  razorpayPaymentId,

  shippingAddress: {
    fullName,
    phone,
    address,
    city,
    state,
    pincode,
  },
});

const user = await User.findById(
  req.user.userId
);

const productList = cart.items.map(
    (item) =>
      `${item.product.title} x ${item.quantity}`
  )
  .join("\n");

  await sendEmail(
  user.email,
  "Order Confirmation - SattViva",
  `
Hello ${user.name},

Thank you for your order!

Order ID: ${order._id}

Products:
${productList}

Total Amount: ₹${totalAmount}

Your order has been received and is being processed.

Regards,
SattViva Team
`
);


await sendEmail(
  "support@sattviva.com",
  "New Order Received",
  `
Customer: ${user.name}

Email: ${user.email}

Order ID: ${order._id}

Products:
${productList}

Total Amount: ₹${totalAmount}
`
);



    cart.items = [];

    await cart.save();

    res.status(201).json({
      success: true,
      order,
    });
  }catch (error) {
  console.log("FULL ERROR:");
  console.log(error);

  console.log("ERROR RESPONSE:");
  console.log(error.response?.data);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

export const createRazorpayOrder = async (
  req,
  res
) => {
  console.log(
  process.env.RAZORPAY_KEY_ID
);

console.log(
  process.env.RAZORPAY_KEY_SECRET
);
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      totalAmount +=
        item.product.price *
        item.quantity;
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt:
        "receipt_" + Date.now(),
    };

    const razorpayOrder =
      await razorpay.orders.create(
        options
      );

      
    res.status(200).json({
      success: true,
      order:
        razorpayOrder,
      amount:
        totalAmount,
    });
  } catch (error) {
  console.log("========== RAZORPAY ERROR ==========");
  console.log(error);

  console.log("STATUS CODE:");
  console.log(error.statusCode);

  console.log("ERROR DESCRIPTION:");
  console.log(error.error);

  console.log("MESSAGE:");
  console.log(error.message);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};
export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTrackingNumber = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.trackingNumber =
      req.body.trackingNumber;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};