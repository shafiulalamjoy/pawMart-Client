import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="logo"
              className="w-8 h-8"
            />
            <span className="font-bold text-lg">PawMart</span>
          </div>
          <p className="text-sm text-blue-100">
            PawMart connects local pet owners and buyers for adoption and pet care products.
          </p>
          <p className="text-xs text-blue-200 mt-3">
            © {new Date().getFullYear()} PawMart. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Useful Links</h4>
          <ul className="space-y-1 text-blue-100 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm text-blue-100">Email: support@pawmart.example</p>
          <p className="text-sm text-blue-100 mt-1">Phone: +880 1XX-XXX-XXXX</p>
        </div>
      </div>
    </footer>
  );
}
