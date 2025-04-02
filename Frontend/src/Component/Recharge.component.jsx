import { useState, useEffect } from "react";
import axios from "axios";

const RechargePage = ({ user, onClose }) => {
  const [amount, setAmount] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const predefinedAmounts = [100, 300, 500, 1000, 2000, 5000, 10000, 15000, 20000];
  const [error, setError] = useState('');
  const [phoneNo, setPhoneNo] = useState(user.phoneNo || "");
  const [email, setEmail] = useState(user.email || "");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [countdown, setCountdown] = useState(900);

  const API_URL = import.meta.env.VITE_API_URL || "https://perplexity-bd2d.onrender.com";

  useEffect(() => {
    // Load Cashfree SDK
    const script = document.createElement('script');
    script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          `${API_URL}/api/v1/users/current-user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = response.data.data;
        setUserId(userData._id);
        setUserName(userData.username);
        setPhoneNo(userData.phoneNo);
        setName(userData.username);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [API_URL]);

  useEffect(() => {
    if (showPopup) {
      const interval = setInterval(() => {
        setCountdown(prev => prev <= 1 ? (setShowPopup(false), 900) : prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showPopup]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    setError('');
  };

  const handleProceedToPayment = () => {
    if (!amount || amount < 100) {
      setError("Minimum amount is ₹100");
      return;
    }
    setCountdown(900);
    setShowPopup(true);
  };

  const handleCashfreePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to continue");

      const { data } = await axios.post(
        `${API_URL}/api/v1/users/cashfree/create-order`,
        { amount, customerName: name, customerEmail: email, customerPhone: phoneNo, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!window.Cashfree) {
        alert("Cashfree SDK not loaded. Please try again later.");
        return;
      }

      const cashfree = window.Cashfree({
        mode: import.meta.env.VITE_CASHFREE_MODE || "sandbox"
      });

      if (!cashfree || typeof cashfree.redirect !== "function") {
        alert("Cashfree SDK initialization failed. Please try again later.");
        return;
      }

      cashfree.redirect({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal"
      });

      cashfree.trackPaymentStatus(({ status, reason, orderId }) => {
        if (status === "SUCCESS") {
          verifyCashfreePayment(orderId);
        } else {
          alert(`Payment failed: ${reason || "Unknown error"}`);
        }
      });

    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setShowPopup(false);
    }
  };

  const verifyCashfreePayment = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/v1/users/cashfree/verify-payment`,
        { orderId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert("Payment successful!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Payment verification failed");
    }
  };

  const paymentMethods = ["Pay Now"];

  return (
    <div style={styles.container}>
      {!showPopup ? (
        <>
          <button style={styles.closeButton} onClick={onClose}>
            X
          </button>
          <h2 style={styles.heading}>Recharge Wallet</h2>
          <div style={styles.amountGrid}>
            {predefinedAmounts.map(amt => (
              <button
                key={amt}
                style={{
                  ...styles.amountButton,
                  ...(amount === amt && styles.selectedAmount),
                }}
                onClick={() => handleAmountSelect(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom Amount"
            style={styles.customInput}
            value={amount || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setAmount(isNaN(value) ? null : Math.max(value, 0));
            }}
            min="100"
          />
          {error && <div style={styles.errorMessage}>{error}</div>}
          <button style={styles.rechargeButton} onClick={handleProceedToPayment}>
            Recharge Now
          </button>
        </>
      ) : (
        <div style={styles.popupOverlay}>
          <div style={styles.confirmationPopup}>
            <h3 style={styles.popupHeader}>
              Confirm Payment
              <span style={styles.timerText}>{formatTimer(countdown)}</span>
            </h3>
            <div style={styles.scrollableContainer}>
              <div style={styles.userDetails}>
                <input
                  style={styles.inputField}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  style={styles.inputField}
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                  placeholder="Phone"
                  type="tel"
                />
                <input
                  style={styles.inputField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                />
                <p style={styles.amountConfirm}>Amount: ₹{amount}</p>
              </div>
              <div style={styles.paymentMethods}>
                {paymentMethods.map(method => (
                  <button
                    key={method}
                    style={styles.methodButton}
                    onClick={() => method === "Pay Now" && handleCashfreePayment()}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.popupFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    backgroundColor: "#f5f7fa",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#2d3748",
    fontSize: "2rem",
    marginBottom: "2rem",
  },
  inputField: {
    width: "100%",
    padding: "0.8rem",
    margin: "0.5rem 0",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "1rem",
  },
  amountGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  closeButton: {
    position: "relative",
    right: "20px",
    top: "-27px",
    width: "100px",
    height: "40px",
    fontSize: "24px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    borderRadius: "8px",
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  timerText: {
    color: "#e53e3e",
    marginLeft: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  amountButton: {
    padding: "1rem",
    backgroundColor: "#fff",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  selectedAmount: {
    backgroundColor: "#4a5568",
    color: "#fff",
    borderColor: "#4a5568",
  },
  customInput: {
    width: "100%",
    padding: "1rem",
    marginBottom: "1.5rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  rechargeButton: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#48bb78",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationPopup: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "400px",
    maxWidth: "90%",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  scrollableContainer: {
    overflowY: "auto",
    paddingRight: "10px",
    maxHeight: "70vh",
  },
  methodButton: {
    width: "100%",
    padding: "1rem",
    margin: "0.5rem 0",
    backgroundColor: "#f7fafc",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cancelButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#4a5568",
    cursor: "pointer",
    marginTop: "1.5rem",
  },
};

export default RechargePage;