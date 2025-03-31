// src/Component/AdminDashboard.component.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 


export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [color, setColor] = useState('red');
  const [status, setStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); 

  const API_URL = process.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  useEffect(() => {
   // In AdminDashboard.component.jsx
// AdminDashboard.component.jsx में fetchCurrentUser को अपडेट करें
const fetchCurrentUser = async () => {
    try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("No admin token found!");
            logout();
            return;
        }

        const response = await axios.get(`${API_URL}/api/v1/users/current-admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        setCurrentUser(response.data);
    } catch (err) {
        console.error("Error fetching current user:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Session expired!');
        // logout(); // Uncomment करें
    }
};
    
    fetchCurrentUser();
  }, [API_URL, logout]);


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/users/admin/override-status`);
        setStatus(data);
      } catch (error) {
        toast.error('Status fetch failed');
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [API_URL]);

  const handleSetColor = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/users/admin/set-color`, { color });
      toast.success(`Color set to ${color}`);
    } catch (error) {
      toast.error('Failed to set color');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <nav className="bg-white shadow-sm mb-8 p-4 rounded-lg flex justify-between items-center">
  <div>
    <h1 className="text-xl font-bold">Admin Dashboard</h1>
    {currentUser && (
      <p className="text-sm text-gray-600">Logged in as: {currentUser.username}</p>
    )}
  </div>
  <button
    onClick={logout}
    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
  >
    Logout
  </button>
</nav>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Set Next Color</h2>
          <div className="flex gap-4 mb-4">
            {['red', 'green', 'violet'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-md text-white ${
                  color === c ? 'ring-2 ring-black' : ''
                } ${
                  c === 'red' ? 'bg-red-500' :
                  c === 'green' ? 'bg-green-500' : 'bg-purple-500'
                }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleSetColor}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Confirm Color
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Active Status</p>
              <p className="text-xl font-bold">{status?.active ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Selected Color</p>
              <p className="text-xl font-bold capitalize">{status?.color || 'None'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Time Remaining</p>
              <p className="text-xl font-bold">
                {status?.expiresAt 
                  ? `${Math.ceil((status.expiresAt - Date.now())/60000)}m` 
                  : '0m'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}