// src/Component/AdminRegister.component.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    fullname: '',
    username: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  const validateCredentials = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if(credentials.fullname.trim().length < 3) {
      toast.error('Full name must be at least 3 characters');
      return false;
    }

    if(credentials.username !== 'Bhavins') {
      toast.error('Invalid admin username');
      return false;
    }

    if(!emailRegex.test(credentials.email)) {
      toast.error('Invalid email address');
      return false;
    }

    if(!phoneRegex.test(credentials.phoneNo)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    
    if(credentials.password !== 'Bhavins@123') {
      toast.error('Password must be Bhavins@123');
      return false;
    }

    if(credentials.password !== credentials.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateCredentials()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/v1/users/admin/register`, {
        fullname: credentials.fullname,
        username: credentials.username,
        email: credentials.email,
        phoneNo: credentials.phoneNo,
        password: credentials.password
      });

      toast.success('Admin registration successful!');
      navigate('/admin/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Registration
        </h2>

        {/* Full Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.fullname}
            onChange={(e) => setCredentials({...credentials, fullname: e.target.value})}
            required
          />
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.phoneNo}
            onChange={(e) => setCredentials({...credentials, phoneNo: e.target.value})}
            pattern="[0-9]{10}"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.confirmPassword}
            onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Registering...' : 'Register Admin'}
        </button>

        <div className="mt-4 text-center">
          <Link 
            to="/admin/login"
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminRegister;