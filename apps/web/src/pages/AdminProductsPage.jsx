import React, { useEffect, useState } from "react";




const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  sku: "",
  images: [],
});

const [uploading, setUploading] = useState(false);

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

  const saveProduct = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

const url = editingId
  ? `http://localhost:5000/api/products/${editingId}`
  : "http://localhost:5000/api/products";

const method = editingId
  ? "PUT"
  : "POST";

const response = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});

const data = await response.json();

if (data.success) {
  fetchProducts();

  setEditingId(null);

  setFormData({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    sku: "",
  });

  alert(
    editingId
      ? "Product Updated Successfully"
      : "Product Added Successfully"
  );
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

const uploadImage = async (file) => {
  try {
    setUploading(true);

    const imageData = new FormData();

    imageData.append("image", file);

    const response = await fetch(
      "http://localhost:5000/api/upload",
      {
        method: "POST",
        body: imageData,
      }
    );

    const data = await response.json();

    if (data.success) {
      setFormData(prev => ({
        ...prev,
        images: [data.imageUrl],
      }));
    }

    setUploading(false);
  } catch (error) {
    console.error(error);
    setUploading(false);
  }
};



  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Admin Products Dashboard
      </h1>

      <form
  onSubmit={saveProduct}
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

 <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    uploadImage(e.target.files[0])
  }
/>

{uploading && (
  <p>Uploading image...</p>
)}

{formData.images.length > 0 && (
  <img
    src={formData.images[0]}
    alt="Preview"
    className="w-32 h-32 object-cover rounded"
  />
)}

  <button
    type="submit"
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    {editingId ? "Update Product" : "Add Product"}
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
  onClick={() => {
    setEditingId(product._id);

    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      images: [],
    });
  }}
  className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
>
  Edit
</button>

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