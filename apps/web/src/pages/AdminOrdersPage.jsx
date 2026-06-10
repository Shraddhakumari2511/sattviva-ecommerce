import React, { useEffect, useState } from "react";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
  orderId,
  status
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {
      fetchOrders();
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Admin Orders Dashboard
      </h1>

      {orders.map(order => (
        <div
          key={order._id}
          className="border rounded-lg p-4 mb-4"
        >
          <h3 className="font-bold">
            Order ID: {order._id}
          </h3>

          <p>
            Customer: {order.user?.name}
          </p>

          <p>
            Email: {order.user?.email}
          </p>

          <p>
            Total: ₹{order.totalAmount}
          </p>

          <div className="mt-2">
  <label className="mr-2">
    Status:
  </label>

  <select
    value={order.orderStatus}
    onChange={(e) =>
      updateStatus(
        order._id,
        e.target.value
      )
    }
    className="border rounded px-2 py-1"
  >
    <option value="Pending">
      Pending
    </option>

    <option value="Processing">
      Processing
    </option>

    <option value="Shipped">
      Shipped
    </option>

    <option value="Delivered">
      Delivered
    </option>
  </select>
</div>

          <div className="mt-3">
            {order.items.map(item => (
              <div
                key={item._id}
                className="flex justify-between py-1"
              >
                <span>
                  {item.product?.title}
                </span>

                <span>
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersPage;