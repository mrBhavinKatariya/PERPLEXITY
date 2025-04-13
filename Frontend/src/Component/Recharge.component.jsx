import { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";

const RechargePage = ({ user, onClose }) => {
  const [amount, setAmount] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const predefinedAmounts = [
    100, 300, 500, 1000, 2000, 5000, 10000, 15000, 20000,
  ];
  const [error, setError] = useState("");
  const [phoneNo, setPhoneNo] = useState(user.phoneNo || "");
  const [email, setEmail] = useState(user.email);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [countdown, setCountdown] = useState(900);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [payment, setPayment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL =
    import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${API_URL}/api/v1/users/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserId(response.data.data._id);
        setUserName(response.data.data.username);
        setPhoneNo(response.data.data.phoneNo);
        setName(response.data.data.username);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (showPopup) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setShowPopup(false);
            clearInterval(interval);
            return 900;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showPopup]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    setError("");
  };

  const handleProceedToPayment = () => {
    if (!amount || amount < 0) {
      setError("Minimum amount is 100");
      return;
    }
    if (amount > 0) {
      setCountdown(900);
      setShowPopup(true);
    }
  };

  const createPayment = async () => {
    try {
      setIsProcessingPayment(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to continue");
        setIsProcessingPayment(false);
        return;
      }

      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/api/v1/users/payments`,
        {
          amount: parseFloat(amount),
          description: "Wallet Recharge",
          userId: userId,
        },
        authConfig
      );

      setPayment(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Payment creation failed");
    } finally {
      setIsProcessingPayment(false);
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
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                style={{
                  ...styles.amountButton,
                  ...(amount == amt && styles.selectedAmount),
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
            value={amount || ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setAmount(value);
              } else {
                setAmount(null);
              }
            }}
          />
          {error && <div style={styles.errorMessage}>{error}</div>}
          <button
            style={styles.rechargeButton}
            onClick={handleProceedToPayment}
          >
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
              {!payment ? (
                <>
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
                      onChange={(e) => setPhoneNo(e.target.value)}
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
                    {paymentMethods.map((method) => (
                      <button
                        key={method}
                        style={{
                          ...styles.methodButton,
                          backgroundColor: isProcessingPayment
                            ? "#e2e8f0"
                            : "#f7fafc",
                          cursor: isProcessingPayment
                            ? "not-allowed"
                            : "pointer",
                        }}
                        onClick={() => {
                          if (method === "Pay Now") {
                            createPayment();
                          }
                        }}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? "Processing..." : method}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: "10px" }}>
                  {successMessage && (
                    <div style={{ color: "green", marginBottom: "10px" }}>
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                      {errorMessage}
                    </div>
                  )}
                  <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
                    Payment Details
                  </h3>

                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>Amount:</p>
                      <p>₹{numeral(payment.amount).format("0,0.00")}</p>

                      <p style={{ fontWeight: "bold" }}>Status:</p>
                      <p
                        style={{
                          color:
                            payment.status === "completed" ? "green" : "orange",
                          fontWeight: "bold",
                        }}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>

                  {payment?.bankDetails?.upiId && (
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
                        Pay Using UPI Apps
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <button
                          onClick={() =>
                            (window.location.href = `upi://pay?pa=${
                              payment.bankDetails.upiId
                            }&pn=${encodeURIComponent(
                              payment.bankDetails.name
                            )}&am=${payment.amount}&cu=INR`)
                          }
                          style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          PhonePe
                        </button>

                        <button
                          onClick={() =>
                            (window.location.href = `tez://upi/pay?pa=${
                              payment.bankDetails.upiId
                            }&pn=${encodeURIComponent(
                              payment.bankDetails.name
                            )}&am=${payment.amount}&cu=INR`)
                          }
                          style={{
                            backgroundColor: "#4285F4",
                            color: "white",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Google Pay
                        </button>

                        <button
                          onClick={() =>
                            (window.location.href = `paytmmp://pay?pa=${
                              payment.bankDetails.upiId
                            }&pn=${encodeURIComponent(
                              payment.bankDetails.name
                            )}&am=${payment.amount}&cu=INR`)
                          }
                          style={{
                            backgroundColor: "#203F9E",
                            color: "white",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Paytm
                        </button>
                      </div>

                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          textAlign: "center",
                        }}
                      >
                       
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={styles.popupFooter}>
              <div style={styles.popupActions}>
                <button
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowPopup(false);
                    setCountdown(900);
                    setPayment(null);
                  }}
                >
                  Cancel
                </button>
              </div>
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
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
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