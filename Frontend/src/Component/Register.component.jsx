import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

function RegisterPage() {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
        fullname: "",
        phoneNo: "",
        referralCode: "" ,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async () => {
        setIsSubmitting(true); // Start loading
        setError(""); // Clear previous errors

        console.log("Using API URL:", API_URL);
        try {
            const response = await axios.post(`${API_URL}/api/v1/users/register`, credentials, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Register Response:", response.data);
            console.log("Using API URL:", process.env.REACT_APP_API_URL);
            const { accessToken } = response.data.data;

            // Store the token in localStorage
            localStorage.setItem("token", accessToken);
            console.log("Token stored:", accessToken);
            // Redirect user to the homepage
            navigate("/prediction");
        } catch (error) {
            console.error("Registration failed:", error);
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                        setError("All fields are required.");
                        break;
                    case 410:
                        setError("Username or email already exists.");
                        break;
                    case 412:
                        setError("Invalid referral code");
                        break;
                    default:
                        setError("An unknown error occurred. Please try again.");
                        break;
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        } finally {
            setIsSubmitting(false); // Stop loading regardless of success/error
        }
        
        
        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center mb-8">
                        USER SIGNUP
                    </h1>

                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">USERNAME</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="Your Good Name"
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">EMAIL</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="Your Email"
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">PASSWORD</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">FULL NAME</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="Your Full Name"
                                onChange={(e) => setCredentials({ ...credentials, fullname: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">PHONE NUMBER</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="Your Phone Number"
                                onChange={(e) => setCredentials({ ...credentials, phoneNo: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">REFERRAL ID (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="Referral ID (if any)"
                                onChange={(e) => setCredentials({ ...credentials, referralCode: e.target.value })}
                            />
                        </div>

                        <button
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-gray-900 py-3.5 rounded-lg
                    font-bold hover:from-cyan-400 hover:to-purple-500 transition-all transform hover:scale-[1.02]
                    shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleRegister}
                    disabled={isSubmitting} // Disable button during submission
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            ACTIVATING ACCOUNT...
                        </span>
                    ) : (
                        "ACTIVATE ACCOUNT"
                    )}
                </button>

                        {error && <div className="text-red-500 mt-4">{error}</div>}
                        {success && <div className="text-green-500 mt-4">{success}</div>}

                        <p className="text-center text-gray-400 mt-6">
                            Existing user?{" "}
                            <a
                                href="/login"
                                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 hover:underline-offset-2 transition-all"
                            >
                                Access Terminal
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;