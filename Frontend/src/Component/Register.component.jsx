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
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);


    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        const re = /^[6-9]\d{9}$/;
        return re.test(String(phone));
    };

    const handleRegister = async () => {
        setError("");
        setSuccess("");
        if (!credentials.username || !credentials.email || !credentials.password || !credentials.fullname || !credentials.phoneNo) {
            setError("All fields are required");
            return;
        }


        if (!validateEmail(credentials.email)) {
            return setError("Please enter a valid email address");
        }

        if (!validatePhone(credentials.phoneNo)) {
            return setError("Phone number must be 10 digits");
        }
        setIsSubmitting(true); // Start loading
        setError("")

        // console.log("Using API URL:", API_URL);
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
            setShowWelcomePopup(true);
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

    const handleRegistrationError = (error) => {
        console.error("Registration failed:", error);
        if (!error.response) {
            setError("Network error. Please check your connection.");
            return;
        }

        const { status } = error.response;
        const errorMessages = {
            409: "All fields are required.",
            410: "Username or email already exists.",
            412: "Invalid referral code",
            default: "Registration failed. Please try again."
        };

        setError(errorMessages[status] || errorMessages.default);
    };

    const handleClosePopup = () => {
        setShowWelcomePopup(false);
        navigate("/prediction");
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

                    {showWelcomePopup && (
                    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-cyan-500/30 w-full max-w-md relative">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-4">🎉 Registration Successful!</h2>
                            <p className="text-gray-300 mb-6">
                                Welcome to our community! Join our Telegram channel for updates and support.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => window.open("https://t.me/your_channel", "_blank")}
                                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.258-.534.258l.213-3.053 5.56-5.022c.24-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                                    </svg>
                                    Join Telegram Channel
                                </button>

                                <button
                                    onClick={handleClosePopup}
                                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 rounded-lg transition-all"
                                >
                                    Continue to App
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        
          
        
        </div>
    );
}

export default RegisterPage;