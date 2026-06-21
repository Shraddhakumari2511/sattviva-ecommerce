import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response =
await fetch(
"http://localhost:5000/api/contact",
{
method: "POST",

headers: {
"Content-Type":
"application/json",
},

body:
JSON.stringify(formData),
}
);

const data =
await response.json();

if (data.success) {

alert(
"Message sent successfully 🎉"
);

}

    // Backend API baad me connect karenge

    alert(
      "Thank you for contacting SattViva Naturals. We'll get back to you soon."
    );

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">

      <h1 className="text-4xl font-bold text-center mb-3">
        Contact Us
      </h1>

      <p className="text-center text-gray-500 mb-10">
        We'd love to hear from you. Please fill out the form below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-5"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-2 font-medium">
            Full Name *
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">
            Email Address *
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-2 font-medium">
            Mobile Number *
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-2 font-medium">
            Subject *
          </label>

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>General Inquiry</option>
            <option>Product Information</option>
            <option>Order Support</option>
            <option>Bulk / Wholesale Orders</option>
            <option>Distributor Inquiry</option>
            <option>Retailer Partnership</option>
            <option>Feedback & Suggestions</option>
            <option>Media & Collaborations</option>
            <option>Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block mb-2 font-medium">
            Message *
          </label>

          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;