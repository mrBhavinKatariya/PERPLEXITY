import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function RegisterPage() {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
        fullname: "",
        phoneNo: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        console.log("Using API URL:", process.env.REACT_APP_API_URL);
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
                    case 400:
                        setError("All fields are required.");
                        break;
                    case 409:
                        setError("Username or email already exists.");
                        break;
                    default:
                        setError("An unknown error occurred. Please try again.");
                        break;
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center mb-8">
                        CYBER SIGNUP
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

                        <button
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-gray-900 py-3.5 rounded-lg
                            font-bold hover:from-cyan-400 hover:to-purple-500 transition-all transform hover:scale-[1.02]
                            shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95"
                            onClick={handleRegister}
                        >
                            ACTIVATE ACCOUNT
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