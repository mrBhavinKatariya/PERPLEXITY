// src/Component/AdminLogin.component.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";


  useEffect(() => {
    console.log("isAuthenticated:",isAuthenticated );
    
    if (isAuthenticated) navigate(`/admin/dashboard`);

  }, [isAuthenticated, navigate]);


  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(credentials);  // <-- success check हटाएं
    toast.success('Login successful!');
    // useEffect स्वतः navigation करेगा
  } catch (error) {
    toast.error(error.message || 'Invalid credentials!');  // <-- specific error दिखाएं
  }
};

// AuthContext में useEffect जोड़ें
useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    // setIsAuthenticated(true);  // <-- पेज refresh पर भी state maintain करेगा
  }
}, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}