import { useState , useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timeoutRef = useRef(null);
    
    const API_URL = import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

    // Clear timeout on component unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    const setErrorWithTimeout = (message) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setErrorMessage(message);
        timeoutRef.current = setTimeout(() => setErrorMessage(""), 5000);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validate input fields
        if (!credentials.username.trim()) {
            setErrorWithTimeout("Please enter a username.");
            return;
        }
        if (!credentials.password.trim()) {
            setErrorWithTimeout("Please enter a password.");
            return;
        }

        setIsSubmitting(true);
        // Prepare login data
        const loginData = credentials.username.includes("@")
            ? { email: credentials.username, password: credentials.password }
            : { username: credentials.username, password: credentials.password };

        try {
            // Send login request to the server
            const response = await axios.post(
                `${API_URL}/api/v1/users/login`,
                loginData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Login response:", response.data);

            const { accessToken } = response.data.data;

            // Store the token in localStorage
            localStorage.setItem("token", accessToken);
            console.log("Token stored:", accessToken);

            // Redirect to the home page after 2 seconds
            setTimeout(() => navigate("/prediction"));
        } catch (error) {
            // Handle errors
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setErrorWithTimeout("Invalid password.");
                        break;
                    case 404:
                        setErrorWithTimeout("User not found.");
                        break;
                    case 500:
                        setErrorWithTimeout("A server error occurred. Please try again later.");
                        break;
                    case 400:
                        setErrorWithTimeout("Username or email required.");
                        break;
                    default:
                        setErrorWithTimeout("An unknown error occurred. Please try again.");
                        break;
                }
            } else {
                setErrorWithTimeout("Network error. Please check your connection.");
            }

            console.error("Login error:", error);
        }
        finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    // Example of a protected route request
    const fetchProtectedData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErrorMessage("No token found. Please log in again.");
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/v1/protected-endpoint`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Protected data:", response.data);
        } catch (error) {
            console.error("Error fetching protected data:", error);
            setErrorMessage("Failed to fetch protected data.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="relative bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl z-0 blur-sm opacity-20 animate-pulse"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-10">
                        Welcome Back
                    </h1>

                    {errorMessage && (
                        <div className="text-red-400 bg-red-700/30 p-3 rounded-lg text-center mb-[20px]">{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div className="text-green-400 bg-green-700/30 p-3 rounded-lg text-center">{successMessage}</div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                className="peer w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="Username, Email or Phone"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                            <label
                                htmlFor="username"
                                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                            >
                                Username, Email or Phone
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                className="peer w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                            >
                                Password
                            </label>
                        </div>

                        <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 rounded-lg 
                        font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] 
                        active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg 
                                    className="animate-spin h-5 w-5 text-white" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                    ></circle>
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                SIGNING IN...
                            </span>
                        ) : (
                            "SIGN IN"
                        )}
                    </button>
                    </form>

                    <div className="flex items-center justify-center space-x-4 my-4">
                        <div className="w-full h-px bg-gray-600"></div>
                        <span className="text-gray-400 text-sm">OR</span>
                        <div className="w-full h-px bg-gray-600"></div>
                    </div>

                    <div className="flex justify-center space-x-6">
                        <button className="p-3 rounded-full border-2 border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all">
                            <FaGoogle className="text-xl" />
                        </button>
                        <button className="p-3 rounded-full border-2 border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-all">
                            <FaGithub className="text-xl" />
                        </button>
                    </div>

                    <p className="text-center text-gray-400 mt-4">
                        New here?{" "}
                        <a href="/register" className="text-blue-400 hover:underline hover:text-blue-300 transition-all">
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;