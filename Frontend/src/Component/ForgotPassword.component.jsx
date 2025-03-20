import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, CheckCircleIcon, ArrowLeftIcon  } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const API_URL =
    import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/v1/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send password reset email');
      }

      setIsSubmitted(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
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
              className="flex items-center text-purple-600 hover:text-purple-700 gap-1"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back to Setting</span>
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
              <p className="text-gray-500">Enter your email to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Sending...' : 'Reset Password'}
              </button>
            </form>

            <div className="text-center">
              <a
                href="/login"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Back to Login
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors duration-200">
              <FcGoogle className="h-5 w-5" />
                <span>Google</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors duration-200">
              <FaFacebook className="h-5 w-5 text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Sent!</h2>
            <p className="text-gray-500 mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
            >
              Resend Email
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}