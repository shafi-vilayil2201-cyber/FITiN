import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import footervid from "/assets/footervid.mp4";

const Footer = () => {
  return (
    <footer className="relative text-gray-300 pt-16 pb-8 overflow-hidden">

      <video
        className="absolute top-0 pb-17 left-0 w-full h-full object-fit opacity-40 z-0 hidden sm:block"
        src={footervid}
        autoPlay
        loop
        muted
        playsInline
      ></video>

 
      <div className="absolute inset-0 bg-black bg-opacity-60 -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative z-10">

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">FitN</h2>
          <p className="text-gray-300 mb-4">
            Empowering your fitness journey with premium products and trusted guidance.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-green-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-green-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-green-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-green-400 transition"><FaLinkedinIn /></a>
          </div>
        </div>

   
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Product Categories</h3>
          <ul className="space-y-2">
            <li><a href="/Search" className="hover:text-green-400 transition">Supplements</a></li>
            <li><a href="/Search" className="hover:text-green-400 transition">Protein Bars</a></li>
            <li><a href="/Search" className="hover:text-green-400 transition">Energy Drinks</a></li>
            <li><a href="/Search" className="hover:text-green-400 transition">Fitness Equipment</a></li>
            <li><a href="/Search" className="hover:text-green-400 transition">Accessories</a></li>
          </ul>
        </div>


        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/About" className="hover:text-green-400 transition">About Us</a></li>
            <li><a href="/Contact" className="hover:text-green-400 transition">Contact</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-green-400 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-green-400 transition">FAQs</a></li>
          </ul>
        </div>

 
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li>📍 673642, Malappuram, Kerala</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@fitn.com</li>
          </ul>
        </div>
      </div>


      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400 relative z-10">
        <p>© 2025 FITiN. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;