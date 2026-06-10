import React, { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            className="border rounded-lg p-4 mb-4"
          >
            <h3 className="font-bold">
              Order ID: {order._id}
            </h3>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

            <p className={ order.orderStatus === "Delivered"? "text-green-600": "text-yellow-600"}>Status: {order.orderStatus}</p>
            <p>Total: ₹{order.totalAmount}</p>

            <div className="mt-3">{order.items.map(item => (
                <div
                  key={item._id}
                  className="flex justify-between border-b py-2"
                >
                  <span>
                    {item.product.title}
                  </span>

                  <span>
                    Qty: {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;