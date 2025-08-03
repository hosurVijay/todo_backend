import React, { useState } from "react";
import { Input, Button } from "../components";

const Contact = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");
    setError("");

    const formData = new FormData(event.target);
    formData.append("access_key", "f0831ba6-8898-40e2-a6d2-e34124e9c4d9");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit.");
      } else {
        setResult("✅ Form Submitted Successfully");
        event.target.reset();
      }
    } catch (err) {
      setError("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white py-12 px-4 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          We'd love to hear from you. Fill out the form below and we’ll get back
          to you as soon as possible.
        </p>

        <ul className="mb-6 text-gray-700">
          <li>
            📧 Email:{" "}
            <a
              href="mailto:hosurVijayendra@gmail.com"
              className="text-blue-500"
            >
              hosurvijayendra.dev@gmail.com
            </a>
          </li>
        </ul>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Feedback / Message
            </label>
            <textarea
              name="message"
              rows="5"
              placeholder="Submit your feedback"
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>

          {result && <p className="text-green-600 font-medium">{result}</p>}
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
