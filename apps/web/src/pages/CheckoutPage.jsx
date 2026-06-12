import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";



const CheckoutPage = () => {

    
  const { cartItems, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
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
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handlePlaceOrder = async () => {

    if (
  !shippingAddress.fullName ||
  !shippingAddress.phone ||
  !shippingAddress.address ||
  !shippingAddress.city ||
  !shippingAddress.state ||
  !shippingAddress.pincode
) {
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
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shippingAddress),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      clearCart();

      alert("Order Placed Successfully 🎉");
      window.location.href="/success";
    } catch (error) {
      console.error(error);
    }
  };

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
            {cartItems.map((item) => (
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

          <div className="flex justify-between mt-8 text-2xl font-bold text-green-600">
            <span>Total</span>
            <span>{getCartTotal()}</span>
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