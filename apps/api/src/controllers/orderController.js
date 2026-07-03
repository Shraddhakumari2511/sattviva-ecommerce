import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import razorpay from "../config/razorpay.js";
import PDFDocument from "pdfkit";

export const createOrder = async (req, res) => {


  console.log("========== CREATE ORDER ==========");
  console.log(req.body);
    

  try {

    console.log("BODY:", req.body);
    const {
  fullName,
  email,
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

    console.log("========== CART ==========");
console.log(JSON.stringify(cart, null, 2));
console.log("==========================");

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
  email,
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

  cart.items = [];

    await cart.save();

    console.log("Cart cleared successfully");

    res.status(201).json({
      success: true,
      order,
    });

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

 console.log("Before clearing cart");




    
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

const { finalAmount } = req.body;
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

    // Remove deleted products from cart
cart.items = cart.items.filter(
  item => item.product
);

await cart.save();

if (cart.items.length === 0) {
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

    if (finalAmount) {
  totalAmount = finalAmount;
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

    console.log("ORDER SAVED");

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

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // User sirf apna hi order cancel kar sake
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    // Sirf Pending ya Confirmed order cancel ho
    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    // Stock wapas add karo
    for (const item of order.items) {
      if (item.product) {
        item.product.stock += item.quantity;
        await item.product.save();
      }
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be returned",
      });
    }

    order.orderStatus = "Return Requested";

    await order.save();

    res.json({
      success: true,
      message: "Return request submitted",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestReplacement = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be replaced",
      });
    }

    order.orderStatus = "Replacement Requested";

    await order.save();

    res.json({
      success: true,
      message: "Replacement request submitted",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // User sirf apni invoice download kar sake
    if (
      order.user &&
      order.user._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // Heading
    doc
      .fontSize(22)
      .text("SattViva", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text("INVOICE");

    doc.moveDown();

    doc.text(`Order ID : ${order._id}`);
    doc.text(
      `Date : ${new Date(
        order.createdAt
      ).toLocaleDateString()}`
    );

    doc.text(
      `Payment : ${order.paymentStatus}`
    );

    doc.text(
      `Status : ${order.orderStatus}`
    );

    doc.moveDown();

    doc
      .fontSize(16)
      .text("Shipping Address");

    doc.fontSize(12);

    doc.text(
      order.shippingAddress.fullName
    );

    if (order.shippingAddress.email) {
      doc.text(order.shippingAddress.email);
    }

    doc.text(
      order.shippingAddress.phone
    );

    doc.text(
      order.shippingAddress.address
    );

    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`
    );

    doc.text(
      order.shippingAddress.pincode
    );

    doc.moveDown();

    doc
      .fontSize(16)
      .text("Products");

    doc.moveDown();

    order.items.forEach((item) => {
      doc.fontSize(12).text(
        `${item.product?.title || "Product"}`
      );

      doc.text(
        `Quantity : ${item.quantity}`
      );

      doc.text(
        `Price : ₹${item.price}`
      );

      doc.moveDown();
    });

    doc
      .fontSize(16)
      .text(
        `Total : ₹${order.totalAmount}`,
        {
          align: "right",
        }
      );

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

