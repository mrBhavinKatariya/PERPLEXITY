import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOverride = () => {
  const [color, setColor] = useState('red');
  const [minutes, setMinutes] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentOverride, setCurrentOverride] = useState(null);


  const API_URL = process.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  // Current override status check
  useEffect(() => {
    const fetchOverride = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/users/admin/override`);
        setCurrentOverride(data);
      } catch (err) {
        setError('Override status fetch failed');
      }
    };
    fetchOverride();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/v1/users/admin/override`, 
        { color, minutes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCurrentOverride({ color, minutes });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set override');
    } finally {
      setLoading(false);
    }
  };

  const handleClearOverride = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/users/admin/override`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurrentOverride(null);
      setError('');
    } catch (err) {
      setError('Failed to clear override');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        ⚠️ Admin access required
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🛠 Color Override Control
      </h2>

      {/* Current Status */}
      {currentOverride && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold">
            Active Override: 
            <span 
              className={`ml-2 px-2 py-1 rounded 
                ${currentOverride.color === 'red' ? 'bg-red-500' : 
                  currentOverride.color === 'green' ? 'bg-green-500' : 
                  'bg-purple-500'} text-white`}
            >
              {currentOverride.color}
            </span>
          </p>
          <p className="mt-2">
            Expires in: {currentOverride.minutes} minutes
          </p>
          <button
            onClick={handleClearOverride}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Clear Override
          </button>
        </div>
      )}

      {/* Override Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Color
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="red">🔴 Red</option>
            <option value="green">🟢 Green</option>
            <option value="violet">🟣 Violet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white 
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
            transition-colors`}
        >
          {loading ? 'Processing...' : 'Set Color Override'}
        </button>
      </form>
    </div>
  );
};

export default AdminOverride;