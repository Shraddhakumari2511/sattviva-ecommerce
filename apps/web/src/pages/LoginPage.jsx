import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Successful");

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold text-center mb-2">
  Welcome Back
</h1>

<p className="text-center text-gray-500 mb-8">
  Login to your account
</p>

      <form onSubmit={handleSubmit}>
        <input className="w-full border rounded-lg p-3 mb-4"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input className="w-full border rounded-lg p-3 mb-4"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
  type="submit"
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
>
  Login
</button>
      </form>

      <Link to="/register"> 
        Register
      </Link>
    </div>
  );
};

export default LoginPage;