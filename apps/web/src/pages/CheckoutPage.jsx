import React, {useState,useEffect,} from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;




const CheckoutPage = () => {

  console.log(
    import.meta.env.VITE_RAZORPAY_KEY_ID
  );


const location = useLocation();

const buyNowItem =
  location.state?.buyNowItem;

  const [addresses, setAddresses] = useState([]);
    
  const { cartItems, getCartTotal, clearCart } = useCart();

  const checkoutItems =
  buyNowItem
    ? [buyNowItem]
    : cartItems;
  const navigate = useNavigate();

  const [visibleCoupons, setVisibleCoupons] =
  useState([]);

  if (checkoutItems.length === 0) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Your cart is empty 🛒
      </h1>
    </div>
  );
}

 const [shippingAddress, setShippingAddress] = useState({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});


  const [couponCode, setCouponCode] =
  useState("");

const [discount, setDiscount] =
  useState(0);

const [finalAmount, setFinalAmount] =
  useState(0);

  useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (token) {
    fetchAddresses();
  }

  fetchCoupons();

}, []);

useEffect(() => {
  const total =
    checkoutItems.reduce(
      (sum, item) =>
        sum +
        item.product.price *
          item.quantity,
      0
    );


  setFinalAmount(total);
}, [checkoutItems]);

useEffect(() => {
  const handleStorageChange = () => {
    fetchCoupons();
  };

  window.addEventListener(
    "storage",
    handleStorageChange
  );

  return () =>
    window.removeEventListener(
      "storage",
      handleStorageChange
    );
}, []);
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem(
      "token"
    );

    const response = await fetch(
      `${API}/addresses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setAddresses(data.addresses);

      const defaultAddress =
        data.addresses.find(
          (a) => a.isDefault
        );

      if (defaultAddress) {
        setShippingAddress({
          fullName:
            defaultAddress.fullName,

            email: defaultAddress.email,
          phone:
            defaultAddress.phone,

          address:
            defaultAddress.address,

          city:
            defaultAddress.city,

          state:
            defaultAddress.state,

          pincode:
            defaultAddress.pincode,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchCoupons = async () => {
  try {
    const response = await fetch(
      `${API}/coupons`,
    );

    const data = await response.json();

    if (data.success) {
      setVisibleCoupons(
        data.coupons
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const applyCoupon = async () => {
  try {
    const total = checkoutItems.reduce(
  (sum, item) =>
    sum +
    item.product.price * item.quantity,
  0
);

setFinalAmount(total);

    const response = await fetch(
      `${API}/coupons/apply`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
  code: couponCode,
  amount: total,
}),
      }
    );

    const data =
      await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setDiscount(data.discount);

    setFinalAmount(
      data.finalAmount
    );

    alert(
      "Coupon Applied 🎉"
    );
  } catch (error) {
    console.error(error);
  }
};

  const handlePlaceOrder = async () => {

    const res = await loadRazorpay();

if (!res) {
  alert("Razorpay SDK failed to load");
  return;
}

    if (
  !shippingAddress.fullName ||
  !shippingAddress.email ||
  !shippingAddress.phone ||
  !shippingAddress.address ||
  !shippingAddress.city ||
  !shippingAddress.state ||
  !shippingAddress.pincode
){
  alert("Please fill all fields");
  return;
}

// Phone validation
  if (!/^\d{10}$/.test(shippingAddress.phone)) {
    alert("Phone number must be 10 digits");
    return;
  }

  // Pincode validation
  if (!/^\d{6}$/.test(shippingAddress.pincode)) {
    alert("Pincode must be 6 digits");
    return;
  }
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/orders/create-razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  ...shippingAddress,
  finalAmount,
}),
        }
      );

      if (response.status === 401) {
  navigate("/register");
  return;
}

      const data = await response.json();

      if (!data.success) {

  if (
    data.message === "Invalid Token" ||
    data.message === "Access Denied" ||
    data.message === "No Token Provided"
  ) {

     navigate("/register");

    return;
  }

  alert(data.message);
  return;
}
      const options = {
  key:
    import.meta.env.VITE_RAZORPAY_KEY_ID,

  amount:
    data.order.amount,

  currency:
    data.order.currency,

  name:
    "SattViva",

  description:
    "Order Payment",

  order_id:
    data.order.id,

  handler: async function (
    response
  ) {
    alert("HANDLER CALLED");
     console.log("HANDLER CALLED");

    console.log(response);

    const orderResponse =
      await fetch(
        `${API}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...shippingAddress,

            razorpayOrderId:
              response.razorpay_order_id,

            razorpayPaymentId:
              response.razorpay_payment_id,
          }),
        }
      );

    const orderData =
      await orderResponse.json();

    if (
      orderData.success
    ) {
      clearCart();

      alert(
        "Payment Successful 🎉"
      );

      window.location.href =
        "/success";
    }
  },

  prefill: {
  name: shippingAddress.fullName,
  contact: shippingAddress.phone,
},

modal: {
  ondismiss: function () {
    console.log("Popup closed");
  },

  escape: false,

  backdropclose: false,
},

  theme: {
    color: "#16a34a",
  },
};

console.log("OPTIONS =", options);
console.log(window.Razorpay);
console.log("Before Open");
const razorpay =
  new window.Razorpay(
    options

  );

  razorpay.on("payment.submit", function (response) {
  console.log("PAYMENT SUBMITTED");
  console.log(response);
});

  razorpay.on("payment.failed", function (response) {
  console.log("PAYMENT FAILED");
  console.log(response.error);
});
razorpay.open();
console.log("After Open");

    } catch (error) {
      console.error(error);
    }
  };

  setTimeout(() => {
  console.log(document.querySelector("iframe"));
}, 2000);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Shipping Address */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">
            📦 Shipping Address
          </h2>

          <div className="space-y-3 mb-5">
  {addresses.map((address) => (
    <div
      key={address._id}
      className={`border rounded-lg p-3 cursor-pointer ${
        shippingAddress.address ===
        address.address
          ? "border-green-600"
          : ""
      }`}
      onClick={() =>
        setShippingAddress({
          fullName:
            address.fullName,

          email: address.email,
          
          phone:
            address.phone,

          address:
            address.address,

          city:
            address.city,

          state:
            address.state,

          pincode:
            address.pincode,
        })
      }
    >
      <div className="flex items-center gap-2">

        <strong>
          {address.nickname}
        </strong>

        {address.isDefault && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            Default
          </span>
        )}
      </div>

      <p>
        {address.fullName}
      </p>

      <p>
        {address.address}
      </p>

      <p>
        {address.city},{" "}
        {address.state} -
        {address.pincode}
      </p>
    </div>
  ))}
</div>

          <input
            placeholder="Full Name"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.fullName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                fullName: e.target.value,
              })
            }
          />

          <input
  type="email"
  placeholder="Email"
  value={shippingAddress.email}
  onChange={(e) =>
    setShippingAddress({
      ...shippingAddress,
      email: e.target.value,
    })
  }
  className="w-full border rounded-lg p-3"
/>

          <input
            placeholder="Phone Number"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                phone: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Full Address"
            rows="3"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              placeholder="City"
              className="border rounded-lg p-3"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  city: e.target.value,
                })
              }
            />

            <input
              placeholder="State"
              className="border rounded-lg p-3"
              value={shippingAddress.state}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  state: e.target.value,
                })
              }
            />
          </div>

          <input
            placeholder="Pincode"
            className="w-full border rounded-lg p-3"
            value={shippingAddress.pincode}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                pincode: e.target.value,
              })
            }
          />
        </div>

        {/* Order Summary */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">
            🛒 Order Summary
          </h2>

          <div className="space-y-4">
            {checkoutItems.map((item) => (
              <div
                key={item.variant.id}
                className="flex justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
  <img
    src={item.product.image}
    alt={item.product.title}
    className="w-16 h-16 object-cover rounded-lg"
  />

  <div>
    <p className="font-medium">
      {item.product.title}
    </p>

    <p className="text-sm text-gray-500">
      Qty: {item.quantity}
    </p>
  </div>
</div>

                <div>
                  {item.variant.sale_price_formatted}
                </div>
              </div>
            ))}
          </div>

<div className="space-y-3 mb-5">

  <h3 className="font-bold">
    🎉 Available Offers
  </h3>

  {visibleCoupons.map((coupon) => (
    <div
      key={coupon._id}
      className="border rounded-xl p-3 bg-green-50"
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="font-bold text-green-700">
            {coupon.code}
          </p>

          <p className="text-sm text-gray-500">
            {coupon.discountValue}
            {coupon.discountType ===
            "percentage"
              ? "% OFF"
              : "₹ OFF"}

            {" "}above ₹
            {coupon.minimumAmount}
          </p>
        </div>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            setCouponCode(coupon.code)
          }
        >
          Use
        </button>

      </div>
    </div>
  ))}

</div>
          <div className="mt-6">
  <input
    type="text"
    placeholder="Enter Coupon Code"
    value={couponCode}
    onChange={(e) =>
      setCouponCode(
        e.target.value
      )
    }
    className="w-full border rounded-lg p-3"
  />

  <button
    onClick={applyCoupon}
    className="w-full mt-3 bg-orange-500 text-white py-3 rounded-lg"
  >
    Apply Coupon
  </button>
</div>


          <div className="space-y-3 mt-8">

  <div className="flex justify-between">
    <span>Subtotal</span>

    <span>
      ₹{
        checkoutItems.reduce(
          (sum, item) =>
            sum +
            item.product.price *
              item.quantity,
          0
        )
      }
    </span>
  </div>

  <div className="flex justify-between text-red-500">
    <span>Discount</span>

    <span>
      -₹{discount}
    </span>
  </div>

  <div className="border-t pt-3 flex justify-between text-2xl font-bold text-green-600">
    <span>Total</span>

    <span>
      ₹{finalAmount}
    </span>
  </div>

</div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg transition"
          >
            🚀 Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;