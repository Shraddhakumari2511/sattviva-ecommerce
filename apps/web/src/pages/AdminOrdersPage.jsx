import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;
import { toast } from "sonner";


const AdminOrdersPage = () => {
  const [stats, setStats] = useState({totalOrders: 0, revenue: 0,});
  const [orders, setOrders] = useState([]);
  const [trackingInputs, setTrackingInputs] = useState({});
  const [search,setSearch]=useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);

setStats({
  totalOrders: data.orders.length,

  revenue: data.orders.reduce(
    (sum, order) =>
      sum + order.totalAmount,
    0
  ),
});
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
      `${API}/orders/${orderId}/status`,
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

const updateTracking = async (
  orderId
) => {


  const trackingNumber =
  trackingInputs[orderId];
   if (!trackingNumber?.trim()) {
    toast.error("Please enter a tracking number");
    return;
  }
  try {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API}/orders/${orderId}/tracking`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingNumber:
            trackingInputs[orderId],
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      setTrackingInputs(prev => ({
  ...prev,
  [orderId]: undefined,
}));
      fetchOrders();
      toast.success("Tracking Number Saved");
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
      <div className="mb-6">
  <input
    type="text"
    placeholder="Search by Customer Name or Order ID..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border rounded-lg px-4 py-3"
  />
</div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">

  <div className="bg-white shadow rounded-xl p-6 border">
    <p className="text-gray-500">
      Total Orders
    </p>

    <h2 className="text-3xl font-bold text-blue-600">
      {stats.totalOrders}
    </h2>
  </div>

  <div className="bg-white shadow rounded-xl p-6 border">
    <p className="text-gray-500">
      Revenue
    </p>

    <h2 className="text-3xl font-bold text-green-600">
      ₹{stats.revenue}
    </h2>
  </div>

  <div className="bg-white shadow rounded-xl p-6 border">
    <p className="text-gray-500">
      Delivered Orders
    </p>

    <h2 className="text-3xl font-bold text-purple-600">
      {
        orders.filter(
          order =>
            order.orderStatus ===
            "Delivered"
        ).length
      }
    </h2>


  </div>

 <div className="bg-white shadow rounded-xl p-6 border">
    <p className="text-gray-500">
      Cancelled Orders
    </p>

    <h2 className="text-3xl font-bold text-red-600">

{
orders.filter(
o=>o.orderStatus==="Cancelled"
).length

}

</h2>


  </div>


</div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {orders
  .filter((order) => {
    return (
      order.user?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      order._id
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  })
  .map((order) => (
        <div
          key={order._id}
          className="bg-white shadow-lg rounded-xl p-6 mb-6 border"
        >
          <div className="flex justify-between items-start mb-3">
  <div>
    <p className="text-xs text-gray-500">
      Order ID
    </p>

    <h3 className="font-semibold text-sm break-all">
      {order._id}
    </h3>
  </div>
</div>

          <p>
            Customer: {order.user?.name}
          </p>

          <p>
            Email: {order.user?.email}
          </p>

          <p>
            Order Date:{" "} {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-3 p-4 bg-green-50 border border-green-100 rounded-lg">
  <h4 className="font-semibold mb-2">
    Shipping Address
  </h4>

  <p>
<strong>Payment :</strong>

<span className="text-green-600 font-semibold">

{order.paymentStatus}

</span>

</p>

  <p>
    <strong>Name:</strong>{" "}
    {order.shippingAddress?.fullName}
  </p>

  <p>
    <strong>Phone:</strong>{" "}
    {order.shippingAddress?.phone}
  </p>

  <p>
    <strong>Address:</strong>{" "}
    {order.shippingAddress?.address}
  </p>

  <p>
    <strong>City:</strong>{" "}
    {order.shippingAddress?.city}
  </p>

  <p>
    <strong>State:</strong>{" "}
    {order.shippingAddress?.state}
  </p>

  <p>
    <strong>Pincode:</strong>{" "}
    {order.shippingAddress?.pincode}
  </p>
</div>

          <p className="text-lg font-bold text-green-600 mt-3">
  Total: ₹{order.totalAmount}
</p>

          <div className="mt-2">

          <p
  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold

${
order.orderStatus==="Pending"
?"bg-yellow-100 text-yellow-700"

:order.orderStatus==="Confirmed"
?"bg-indigo-100 text-indigo-700"

:order.orderStatus==="Shipped"
?"bg-blue-100 text-blue-700"

:order.orderStatus==="Delivered"
?"bg-green-100 text-green-700"

:order.orderStatus==="Cancelled"
?"bg-red-100 text-red-700"

:order.orderStatus==="Return Requested"
?"bg-orange-100 text-orange-700"

:"bg-purple-100 text-purple-700"

}
`}
>
  {order.orderStatus}
</p>
  <label className="mr-2">
    Status:
  </label>

{order.trackingNumber ? (
  <div className="mt-3">
    <p className="text-blue-600 font-medium mb-2">
      Current Tracking: {order.trackingNumber}
    </p>

    <button
      onClick={() =>
        setTrackingInputs({
          ...trackingInputs,
          [order._id]: order.trackingNumber,
        })
      }
      className="bg-orange-500 text-white px-3 py-2 rounded"
    >
      Update Tracking
    </button>

    {trackingInputs[order._id] !== undefined && (
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={trackingInputs[order._id]}
          onChange={(e) =>
            setTrackingInputs({
              ...trackingInputs,
              [order._id]: e.target.value,
            })
          }
          className="border rounded px-3 py-2"
        />

        <button
          onClick={() =>
            updateTracking(order._id)
          }
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Save
        </button>
      </div>
    )}
  </div>
) : (
  <div className="flex items-center gap-2 mt-3">
    <input
      type="text"
      placeholder="Tracking Number"
      value={
        trackingInputs[order._id] || ""
      }
      onChange={(e) =>
        setTrackingInputs({
          ...trackingInputs,
          [order._id]: e.target.value,
        })
      }
      className="border rounded px-3 py-2"
    />

    <button
      onClick={() =>
        updateTracking(order._id)
      }
      className="bg-blue-600 text-white px-3 py-2 rounded"
    >
      Save Tracking
    </button>
  </div>
)}

  <select
    value={order.orderStatus}
    onChange={(e) =>
      updateStatus(
        order._id,
        e.target.value
      )
    }
    className="border rounded-lg px-3 py-2 mt-2"
  >
    <option value="Pending">
      Pending
    </option>


    <option value="Shipped">
      Shipped
    </option>

    <option value="Delivered">
      Delivered
    </option>

    <option value="Cancelled">Cancelled</option>

<option value="Return Requested">
Return Requested
</option>

<option value="Replacement Requested">
Replacement Requested
</option>
  </select>
</div>

<h4 className="font-semibold mt-4 mb-2">
  Ordered Products
</h4>
          <div className="mt-3">
            {order.items.map(item => (
              <div
                key={item._id}
                className="flex justify-between py-2 border-b last:border-b-0"
              >
               <div
key={item._id}
className="flex items-center gap-3 border-b py-3"
>

<img
src={
item.product?.images?.[0] ||
"/no-image.png"
}
className="w-14 h-14 rounded object-cover"
/>

<div className="flex-1">

<p className="font-medium">

{item.product?.title}

</p>

<p>

₹{item.price}

</p>

</div>

<p>

Qty :

{item.quantity}

</p>

</div>
                <span>
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
  
};

export default AdminOrdersPage;