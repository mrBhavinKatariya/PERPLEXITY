import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiCurrencyRupee,
  HiLockClosed,
  HiShieldCheck,
  HiDocumentText,
  HiCreditCard,
  HiGift,
  HiInformationCircle,
  HiChevronDown,
  HiArrowRight,
  HiUsers,
  HiChat,
} from "react-icons/hi";
import axios from "axios";
import RechargePage from "./Recharge.component";
import UserPay from "./UserPay.component.jsx";

const API_URL =
  import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showPromotionsDropdown, setShowPromotionsDropdown] = useState(false);
  const [showRechargeDropdown, setShowRechargeDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [showDailyBonusModal, setShowDailyBonusModal] = useState(false);
  const [showEarningsDropdown, setShowEarningsDropdown] = useState(false);
  const [showAccountSecurityDropdown, setShowAccountSecurityDropdown] =
    useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleLogin = () => {
    window.location.href = "/login"; // Adjust login route as needed
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }
  };
  
  useEffect(() => {
    if (showDailyBonusModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    };
  }, [showDailyBonusModal]);
  
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Available Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <HiCurrencyRupee className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Available Balance</h2>
          </div>
          <div className="text-3xl font-bold">₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 }) }</div>
        </div>

        {/* Read Section - Modified Button */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
  <div className="flex items-center mb-4">
    <HiDocumentText className="w-6 h-6 text-purple-500 mr-2" />
    <h2 className="text-xl font-semibold">Important Reads</h2>
  </div>
  <button
    onClick={() => setShowRulesModal(true)}
    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-3"
  >
    Read Rules
  </button>
  
  {/* Add Referral Code Section Here */}
  <div className="border-t pt-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-gray-600 mr-2">Referral ID:</span>
        <span className="font-medium">{user?.referralCode || "XXXXXX"}</span>
      </div>
      <button
        onClick={copyReferralCode}
        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm flex items-center"
      >
        <HiDocumentText className="w-4 h-4 mr-1" />
        Copy
      </button>
    </div>
    
    {/* Copied Message */}
    {showCopiedMessage && (
      <div className="text-green-600 text-sm mt-2 text-center">
        Code copied to clipboard!
      </div>
    )}
  </div>
</div>

        {/* Promotions Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowPromotionsDropdown(!showPromotionsDropdown)}
          >
            <div className="flex items-center">
              <HiGift className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Promotions</h2>
            </div>
            <HiChevronDown
              className={`transform transition-transform ${
                showPromotionsDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {showPromotionsDropdown && (
            <div className="space-y-3">
             <button 
  onClick={() => setShowDailyBonusModal(true)}
  className="w-full p-3 bg-yellow-100 rounded-lg hover:bg-yellow-200"
>
  Daily Bonuses
</button>
              <button className="w-full p-3 bg-purple-100 rounded-lg hover:bg-purple-200">
                Special Offers
              </button>
            </div>
          )}
        </div>

        {showDailyBonusModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[95vh] border border-white/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 shrink-0 rounded-[15px]">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-full">
            <HiGift className="w-8 h-8 text-white/90" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Referral Benefits
          </h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Commission Section */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-3 bg-green-100 rounded-full">
            <HiCurrencyRupee className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-lg text-gray-800 leading-relaxed">
            Earn <span className="font-bold text-purple-600">10% commission</span> on 
            every recharge made by your referred users. 
            Instant rewards, lifetime benefits!
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <HiInformationCircle className="w-5 h-5" />
            <span className="font-semibold">How It Works</span>
          </div>
          <div className="space-y-4 text-gray-700">
            {[
              {
                title: "User signs up with your referral code",
                desc: "Your unique code connects them to your network"
              },
              {
                title: "They make any recharge",
                desc: "Applies to every top-up they perform"
              },
              {
                title: "You instantly get 10% of each recharge",
                desc: "Lifetime benefits - Earn from every transaction they make"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-green-500 text-xl mt-1">✓</span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Example */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-3">Example Calculation</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-purple-600">₹1000</span>
            <HiArrowRight className="w-5 h-5 text-gray-400" />
            <span className="text-2xl font-bold text-green-600">₹100</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            10% commission on ₹1000 recharge
          </p>
        </div>
      </div>

      {/* Close Button */}
      <div className="p-6 shrink-0 border-t border-purple-100">
        <button
          onClick={() => setShowDailyBonusModal(false)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md"
        >
          Got It!
        </button>
      </div>
    </div>
  </div>
)}

        {/* Recharge Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowRechargeDropdown(!showRechargeDropdown)}
          >
            <div className="flex items-center">
              <HiCreditCard className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Recharge</h2>
            </div>
            <HiChevronDown
              className={`transform transition-transform ${
                showRechargeDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {showRechargeDropdown && (
            <button
              onClick={() => setShowRechargeModal(true)}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Add Funds
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
          >
            <div className="flex items-center">
              <HiCreditCard className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Wallet</h2>
            </div>
            <HiChevronDown
              className={`transform transition-transform ${
                showWalletDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {showWalletDropdown && (
            <div className="space-y-3">
              <button
                onClick={() => setShowRechargeModal(true)}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Recharge
              </button>
              <button
                 onClick={() => {
                  navigate("/withdrawal");
                  window.scrollTo(0, 0);
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Withdrawal
              </button>
              <button
               onClick={() => {
                navigate("/transaction-history");
                window.scrollTo(0, 0);
              }}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Transaction History
              </button>
            </div>
          )}
        </div>


        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowEarningsDropdown(!showEarningsDropdown)}
          >
            <div className="flex items-center">
              <HiCurrencyRupee className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Earnings</h2>
            </div>
            <HiChevronDown
              className={`transform transition-transform ${
                showEarningsDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {showEarningsDropdown && (
            <div className="space-y-3">
              <button
                onClick={() => navigate("/referral-earnings")}
                className="w-full p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center space-x-2"
              >
                <HiUsers className="w-5 h-5" />
                <span>Referral Earnings</span>
              </button>
              <button
                onClick={() => window.open("https://t.me/wavelinastore", "_blank")}
                className="w-full p-3 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 flex items-center justify-center space-x-2"
              >
                <HiChat className="w-5 h-5" />
                <span>Telegram Channel</span>
              </button>
            </div>
          )}
        </div>
        {/* About Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm  mb-[15px]">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => setShowAboutDropdown(!showAboutDropdown)}
          >
            <div className="flex items-center">
              <HiInformationCircle className="w-6 h-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold">About</h2>
            </div>
            <HiChevronDown
              className={`transform transition-transform ${
                showAboutDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {showAboutDropdown && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigate("/privacy-policy");
                  window.scrollTo(0, 0);
                }}
                className="w-full p-3 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <HiDocumentText className="w-5 h-5" />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => {
                  navigate("/risk-Disclosure-agreement");
                  window.scrollTo(0, 0);
                }}
                className="w-full p-3 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <HiShieldCheck className="w-5 h-5" />
                <span>Risk Disclosure Agreement</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() =>
              setShowAccountSecurityDropdown(!showAccountSecurityDropdown)
            }
          >
            <div className="flex items-center">
              <HiShieldCheck className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Account Security</h2>
            </div>
            <HiChevronDown
              className={`transform transition-transform ${
                showAccountSecurityDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
          {showAccountSecurityDropdown && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    navigate(`/reset-password/${token}`);
                  } else {
                    console.error("Token not found. Please log in again.");
                  }
                }}
                className="w-full p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 font-semibold"
              >
                Reset Password
              </button>

              <button
                onClick={() => {
                  navigate("/forgot-password");
                  window.scrollTo(0, 0);
                }}
                className="w-full p-3 text-gray-600 hover:text-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 text-sm"
              >
                Forgot Password? <span className="ml-1">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Logout/Login Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="space-y-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* <RechargePage
            user={user}
            onClose={() => setShowRechargeModal(false)}
          /> */}


          <UserPay
            user={user}
            onClose={() => setShowRechargeModal(false)} 
            />
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-4">Game Rules</h3>
            <div className="space-y-4">
              <p>1. All players must be 18 years or older</p>
              <p>2. No multiple accounts allowed</p>
              <p>3. Minimum recharge amount is ₹100</p>
              <p>4. Winnings are subject to platform fees</p>
              <p>5. Any fraudulent activity will result in permanent ban</p>
            </div>
            <button
              onClick={() => setShowRulesModal(false)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;