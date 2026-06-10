import React, { useEffect, useState } from "react";




const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  sku: "",
});

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addProduct = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchProducts();

      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        sku: "",
      });

      alert("Product Added Successfully");
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchProducts();
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Admin Products Dashboard
      </h1>

      <form
  onSubmit={addProduct}
  className="border rounded-lg p-4 mb-6 space-y-3"
>
  <input
    placeholder="Title"
    value={formData.title}
    onChange={(e) =>
      setFormData({
        ...formData,
        title: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="Description"
    value={formData.description}
    onChange={(e) =>
      setFormData({
        ...formData,
        description: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="Category"
    value={formData.category}
    onChange={(e) =>
      setFormData({
        ...formData,
        category: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="Price"
    type="number"
    value={formData.price}
    onChange={(e) =>
      setFormData({
        ...formData,
        price: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="Stock"
    type="number"
    value={formData.stock}
    onChange={(e) =>
      setFormData({
        ...formData,
        stock: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="SKU"
    value={formData.sku}
    onChange={(e) =>
      setFormData({
        ...formData,
        sku: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <button
    type="submit"
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Add Product
  </button>
</form>

      <div className="space-y-4">
        {products.map(product => (
          <div
            key={product._id}
            className="border rounded-lg p-4"
          >
            <h3 className="font-bold">
              {product.title}
            </h3>

            <p>
              Price: ₹{product.price}
            </p>

            <p>
              Stock: {product.stock}
            </p>

            <p>
              Category: {product.category}
            </p>

            <button
  onClick={() => deleteProduct(product._id)}
  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
>
  Delete
</button>
          </div>

          
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;