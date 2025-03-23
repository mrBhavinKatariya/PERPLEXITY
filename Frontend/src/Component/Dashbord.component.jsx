

import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  
  const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${API_URL}/api/v1/users/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Current user:", response.data);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };


  useEffect(() => {
    setMenuOpen(false); 
  }, [location]);

  return (
    <header className="shadow-lg sticky top-0 z-50">
      <nav className="bg-black px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between mx-auto max-w-screen-xl">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img src="/download (3).png" className=" mr-3 h-[80px] w-[90px] ml-[30px]" alt="Logo" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {[ 
                { to: "/", label: "Home" },
                { to: "/jewellery", label: "Jewellery" },
                // { to: "/prediction", label: "Prediction" }, ---------------- ACTIVE KRVANU
                // { to: "/setting", label: "Setting" },----------------ACTIVE KRVANU


                // { to: "/create-video", label: "My Content" },
                // { to: "/collections", label: "Collections" },
                // { to: `/channel/${currentUser?.username || "guest"}`, label: "Channel" },
              ].map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-lg transition-colors duration-300 ${isActive ? "text-orange-700" : "text-gray-300 hover:text-orange-700"}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {/* Login / Logout Button */}
              <li>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition"
                  >
                    Login
                  </NavLink>
                )}
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl p-2  text-gray-700 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AiOutlineMenu />
          </button>
        </div>

        {/* Mobile Navigation Links (This will appear when the menu is toggled) */}
        {menuOpen && (
  <div className="lg:hidden absolute top-16 left-0 w-full bg-black text-white px-6 py-4 space-y-4">
    <ul className="space-y-4">
      {[ 
        { to: "/", label: "Home" },
        { to: "/jewellery", label: "Jewellery" },
        // { to: "/home", label: "Home" },
        // { to: "/prediction", label: "prediction" }, ----------ACTIVE KRVANU CHE
        // { to: "/setting", label: "Setting" },-------------------ACTIVE KRVANU CHE
      ].map((link, index) => (
        <li key={index}>
          <NavLink
            to={link.to}
            onClick={() => setMenuOpen(false)} // यहाँ क्लिक हैंडलर जोड़ा
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition-colors duration-300 ${
                isActive ? "text-orange-700" : "text-gray-300 hover:text-orange-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}

      <li>
        {isLoggedIn ? (
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false); 
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition w-full"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition w-full"
          >
            Login
          </NavLink>
        )}
      </li>
    </ul>
  </div>
)}
      </nav>
    </header>
  );
}
