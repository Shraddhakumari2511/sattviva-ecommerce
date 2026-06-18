import React, {useEffect, useState,} from "react";

const MyAddressesPage = () => {

    const [showForm, setShowForm] =
  useState(false);

const [formData, setFormData] =
  useState({
    nickname: "Home",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [editingId, setEditingId] =
  useState(null);

  const [addresses, setAddresses] =
    useState([]);



  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
  const { name, value, type, checked } =
    e.target;

  setFormData({
    ...formData,
    [name]:
      type === "checkbox"
        ? checked
        : value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const url = editingId
      ? `http://localhost:5000/api/addresses/${editingId}`
      : "http://localhost:5000/api/addresses";

    const method = editingId
      ? "PUT"
      : "POST";

    const response = await fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      fetchAddresses();

      setEditingId(null);

      setShowForm(false);

      setFormData({
        nickname: "Home",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this address?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/addresses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchAddresses();
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDefault =
  async (id) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          `http://localhost:5000/api/addresses/${id}/default`,
          {
            method: "PUT",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (data.success) {
        fetchAddresses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (
  address
) => {
  setEditingId(address._id);

  setFormData({
    nickname:
      address.nickname,

    fullName:
      address.fullName,

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

    isDefault:
      address.isDefault,
  });

  setShowForm(true);
};
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          My Addresses
        </h1>

        <button
  onClick={() =>
    setShowForm(!showForm)
  }
  className="bg-green-600 text-white px-5 py-2 rounded-lg"
>
  + Add New Address
</button>
      </div>

      {
  showForm && (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-5 mb-8"
    >

    <select
  name="nickname"
  value={formData.nickname}
  onChange={handleChange}
  className="border p-2 w-full mb-3"
>
  <option value="Home">
    Home
  </option>

  <option value="Office">
    Office
  </option>

  <option value="Hostel">
    Hostel
  </option>

  <option value="Other">
    Other
  </option>
</select>

      <input
        className="border p-2 w-full mb-3"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
      />

      <input
        className="border p-2 w-full mb-3"
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={handleChange}
      />

      <div className="flex gap-3">
  <button
    type="submit"
    className="bg-green-600 text-white px-5 py-2 rounded"
  >
    {editingId
      ? "Update Address"
      : "Save Address"}
  </button>

  <button
    type="button"
    onClick={() => {
      setShowForm(false);
      setEditingId(null);

      setFormData({
        nickname: "Home",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }}
    className="border px-5 py-2 rounded"
  >
    Cancel
  </button>
</div>
    </form>
  )
}

      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        addresses.map((address) => (
          <div
            key={address._id}
            className="border rounded-xl p-5 mb-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-bold text-lg">
                {address.nickname}
              </h2>

              {address.isDefault && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>

            <p>
              {address.fullName}
            </p>

            <p>
              {address.phone}
            </p>

            <p>
              {address.address}
            </p>

            <p>
              {address.city},{" "}
              {address.state} -
              {address.pincode}
            </p>

            <div className="flex gap-4 mt-4">
              <button
  onClick={() =>
    handleEdit(address)
  }
  className="text-blue-600"
>
  Edit
</button>

              <button
  onClick={() =>
    handleDelete(address._id)
  }
  className="text-red-600"
>
  Delete
</button>

              {!address.isDefault && (
                <button
  onClick={() =>
    handleDefault(address._id)
  }
  className="text-green-600"
>
  Set Default
</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAddressesPage;