import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import 

const ResetnewPassword = () => {
    const { token } = useParams();
    const [newPassword, setnewPassword] = useState('');
    const [confirmNewPassword, setconfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [shownewPassword, setShownewPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

  const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${API_URL}/api/v1/users/current-user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data.data);
        // Set balance from API response (adjust according to your API structure)
        setBalance(response.data.data.balance || 0);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const EyeIcon = ({ show }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {show ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </>
      )}
    </svg>
  );

  const validateForm = () => {
    const newErrors = {};
   

  
    if (!newPassword) {
        newErrors.newPassword = 'newPassword is required';
      } else if (newPassword.length < 4) {  // Changed '>' to '<'
        newErrors.newPassword = 'newPassword must contain at least 4 characters';
      }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'newPasswords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/users/change-password`,
        {
          newPassword,
          confirmNewPassword
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Add this line
          },
        }
      );

      setIsSubmitted(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message || 'newPassword reset failed';
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';
      }
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {!isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <button
              onClick={() => navigate('/setting')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeftIcon />
              <span className="font-medium">Back to Setting</span>
            </button>

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {apiError}
              </div>
            )}

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset newPassword</h1>
              <p className="text-gray-500">Create a new secure newPassword</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New newPassword
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <LockIcon />
                  </div>
                  <input
                    type={shownewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setnewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors"
                    placeholder="Enter new Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShownewPassword(!shownewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                  >
                    <EyeIcon show={shownewPassword} />
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm newPassword
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <LockIcon />
                  </div>
                  <input
                    type={shownewPassword ? "text" : "newPassword"}
                    value={confirmNewPassword}
                    onChange={(e) => setconfirmNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors"
                    placeholder="Confirm new Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShownewPassword(!shownewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                  >
                    <EyeIcon show={shownewPassword} />
                  </button>
                </div>
                {errors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Reset newPassword'}
              </button>
            </form>

            <div className="text-center">
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Back to Login
              </a>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <CheckIcon />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">newPassword Updated!</h2>
            <p className="text-gray-500 mb-6">
              Your newPassword has been successfully reset
            </p>
            <a
              href="/login"
              className="w-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
            >
              Login Now
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetnewPassword;