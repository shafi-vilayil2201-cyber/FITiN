import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-16">
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 text-center animate-bounce">
        Get in Touch
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-3xl text-center mb-12">
        We’d love to hear from you! Whether you have questions, feedback, or just want to say hello, reach out to us and we’ll respond as soon as possible.
      </p>

      
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl text-center mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 hover:scale-105">
          <FaPhoneAlt className="mx-auto text-blue-500 text-4xl mb-4 animate-pulse" />
          <h2 className="text-xl font-bold mb-2 text-gray-800">Phone</h2>
          <p className="text-gray-600">+91 98765 43210</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 hover:scale-105">
          <FaEnvelope className="mx-auto text-green-500 text-4xl mb-4 animate-bounce" />
          <h2 className="text-xl font-bold mb-2 text-gray-800">Email</h2>
          <p className="text-gray-600">support@fitin.com</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-500 hover:scale-105">
          <FaMapMarkerAlt className="mx-auto text-red-500 text-4xl mb-4 animate-pulse" />
          <h2 className="text-xl font-bold mb-2 text-gray-800">Location</h2>
          <p className="text-gray-600">Kerala, India</p>
        </div>
      </div>

  
      <form className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Send a Message</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;