import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showOtpInput, setShowOtpInput] = useState(false);

const [otp, setOtp] = useState("");

const [emailForOtp, setEmailForOtp] = useState("");

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
  formData.password !==
  formData.confirmPassword
) {
  alert("Passwords do not match");
  return;
}

    try {
      const response = await fetch(
        "http://sattviva-ecommerce.onrender.com/api/auth/register",
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

      alert("OTP sent to your email");

setEmailForOtp(formData.email);

setShowOtpInput(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
  try {
    const response = await fetch(
      "http://sattviva-ecommerce.onrender.com/api/auth/verify-otp",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email: emailForOtp,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert(
      "Email verified successfully 🎉"
    );

    navigate("/login");

  } catch (error) {
    console.error(error);
  }
};

const handleResendOtp = async () => {
  try {
    const response = await fetch(
      "http://sattviva-ecommerce.onrender.com/api/auth/resend-otp",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email: emailForOtp,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Create Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          disabled={showOtpInput}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={showOtpInput}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={showOtpInput}
          className="w-full border rounded-lg p-3"
        />

        <input
  type="password"
  name="confirmPassword"
  placeholder="Confirm Password"
  value={formData.confirmPassword}
  onChange={handleChange}
  disabled={showOtpInput}
  className="w-full border rounded-lg p-3"
/>

        {
  !showOtpInput && (
    <button
      type="submit"
      className="w-full bg-green-600 text-white py-3 rounded-lg"
    >
      Register
    </button>
  )
}
      </form>

      {showOtpInput && (
  <div className="mt-6 space-y-4">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) =>
        setOtp(e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
    <button
  onClick={handleResendOtp}
  className="w-full bg-gray-200 text-black py-3 rounded-lg"
>
  Resend OTP
</button>

    <button
      onClick={handleVerifyOtp}
      className="w-full bg-blue-600 text-white py-3 rounded-lg"
    >
      Verify OTP
    </button>
  </div>
)}

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-green-600 font-semibold"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;