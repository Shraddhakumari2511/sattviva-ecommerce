import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;
import { toast } from "sonner";


const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  
    const fetchOrders = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/orders/my-orders`,
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
  } finally {
    setLoading(false);
  }
};

   useEffect(() => {
  fetchOrders();
}, []);

  const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Order Cancelled Successfully");
      fetchOrders();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

const returnOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/orders/${orderId}/return`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Return Request Submitted");
      fetchOrders();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};


const replaceOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/orders/${orderId}/replace`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Replacement Request Submitted");
      fetchOrders();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

const downloadInvoice = async (orderId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/orders/${orderId}/invoice`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `Invoice-${orderId}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    toast.error("Failed to download invoice");
  }
};

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

     {loading ? (
  <div className="space-y-4">
    {[1,2,3].map((i) => (
      <div
        key={i}
        className="border rounded-lg p-6 animate-pulse"
      >
        <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-56 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
) : orders.length === 0 ? (
  <p>No orders found.</p>
) : (
        orders.map(order => (
          <div
key={order._id}
className="bg-white rounded-xl border shadow-sm p-5 mb-4 flex flex-col lg:flex-row items-center gap-6">

<div className="lg:w-[28%]">

{order.items.map((item)=>(

<div
key={item._id}
className="flex gap-4"
>

<img
src={
item.product?.images?.[0] ||
"/no-image.png"
}
className="w-24 h-24 rounded-lg object-cover border"
/>

<div>

<h2 className="font-semibold">

{item.product?.title || "Product Deleted"}

</h2>

<p>₹{item.price}</p>

<p>Qty : {item.quantity}</p>

</div>

</div>

))}

</div>

<div className="lg:w-[25%]">

<h3 className="font-bold">

Order ID

</h3>

<p className="text-xs break-all">

{order._id}

</p>

<p className="mt-2">

Date :

{new Date(order.createdAt).toLocaleDateString()}

</p>

<p>

Payment :

<span className="text-green-600 font-semibold">

{order.paymentStatus}

</span>

</p>

<p>

Status :

<span className="text-orange-600 font-semibold">

{order.orderStatus}

</span>

</p>

<p className="font-bold text-green-700">

₹{order.totalAmount}

</p>

</div>

<div className="lg:w-[22%]">

<h3 className="font-semibold mb-2">

Shipping Address

</h3>

<p>{order.shippingAddress.fullName}</p>

<p>{order.shippingAddress.phone}</p>

<p>{order.shippingAddress.address}</p>

<p>

{order.shippingAddress.city},

{" "}

{order.shippingAddress.state}

</p>

<p>

{order.shippingAddress.pincode}

</p>

</div>

<div className="lg:w-[20%] flex flex-col gap-3">

<button
onClick={() => downloadInvoice(order._id)}
className="border border-green-600 text-green-600 rounded-lg py-2"
>

Download Invoice

</button>

{(order.orderStatus==="Pending" ||
order.orderStatus==="Confirmed") && (

<button
onClick={()=>cancelOrder(order._id)}
className="bg-red-600 text-white rounded-lg py-2"
>

Cancel

</button>

)}

{order.orderStatus==="Delivered" && (

<>

<button
onClick={()=>returnOrder(order._id)}
className="border border-yellow-500 text-yellow-600 rounded-lg py-2"
>

Return

</button>

<button
onClick={()=>replaceOrder(order._id)}
className="border border-blue-600 text-blue-600 rounded-lg py-2"
>

Replace

</button>

</>

)}

</div>


            <div className="flex gap-3 mt-4 flex-wrap">

  {(order.orderStatus === "Pending" ||
    order.orderStatus === "Confirmed") && (

    <button
      onClick={() => cancelOrder(order._id)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Cancel Order
    </button>

  )}

  {order.orderStatus === "Delivered" && (

    <>
      <button
        onClick={() => returnOrder(order._id)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
      >
        Return
      </button>

      <button
        onClick={() => replaceOrder(order._id)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Replace
      </button>
    </>

  )}

</div>

         



          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;