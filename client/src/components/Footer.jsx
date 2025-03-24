import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import {Link} from "react-router-dom"
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-teal-400 text-xl font-bold mb-4">UrbanNest Estate</h3>
            <p className="text-gray-400">
              Your trusted partner in finding the perfect home. We specialize in modern, sustainable, and smart living spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h4 className="text-teal-400 text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-teal-400 transition duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-teal-400 transition duration-300">
                  About Us
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-8 md:mb-0">
            <h4 className="text-teal-400 text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="text-gray-400 space-y-2">
              <li>123 Urban Street, City</li>
              <li>Email: info@urbanneststate.com</li>
              <li>Phone: +123 456 7890</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-teal-400 text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition duration-300"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition duration-300"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition duration-300"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition duration-300"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} UrbanNest Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;