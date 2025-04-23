import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import numeral from "numeral";

const UserPay = ({ user, onClose }) => {
  const [amount, setAmount] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const predefinedAmounts = [
    100, 300, 500, 1000, 2000, 5000, 10000, 15000, 20000,
  ];
  const [error, setError] = useState("");
  const [phoneNo, setPhoneNo] = useState(user?.phoneNo || "");
  const [email, setEmail] = useState(user?.email);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [countdown, setCountdown] = useState(900);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [payment, setPayment] = useState(null);
  const [utr, setUtr] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyCooldown, setVerifyCooldown] = useState(0);

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

        console.log("Current user:", response.data);
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
    if (verifyCooldown === 0 && isProcessingPayment) {
      verifyPayment();
    }
  }, [verifyCooldown, isProcessingPayment]);


  // Remove this problematic useEffect
useEffect(() => {
    if (setPaymentProcessing) {
      createPayment();
    }
  }, [setPaymentProcessing]);


  const handleVerifyClick = () => {
    if (isProcessingPayment || !utr) return;

    // Start 5-second cooldown
    setIsProcessingPayment(true);
    setVerifyCooldown(5);

    const interval = setInterval(() => {
      setVerifyCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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

  const CloseButton = () => (
    <button style={styles.closeButton} onClick={onClose}>
      ×
    </button>
  );

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
    if (!amount || amount < 100) {
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
      setPaymentProcessing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please login to continue");
        setPaymentProcessing(false);
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
      error.response?.data?.message || "Payment creation failed"
    } finally {
        setPaymentProcessing(false);
    }
  };

  const verifyPayment = async () => {
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

      if (!utr || utr.trim() === "") {
        setErrorMessage("Please enter UTR number"); 
        return;
      }

      if (!/^[a-zA-Z0-9]{10,20}$/.test(utr)) {
        setErrorMessage("Invalid UTR Number");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/v1/users/payments/verify`,
        {
          paymentId: payment.paymentId,
          utrNumber: utr,
          amount: parseFloat(amount),
        },
        authConfig
      );

      setPayment((prev) => ({
        ...prev,
        ...response.data.payment,
        status: "completed",
      }));
      setSuccessMessage("Payment verified successfully!");
      setErrorMessage("");

      setTimeout(() => {
        setSuccessMessage("");
        setShowPopup(false);
        onClose();
      }, 3000);

      window.location.reload();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Payment verification failed"
      );
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
      backgroundColor: paymentProcessing 
        ? "#e2e8f0" 
        : "#f7fafc",
      cursor: paymentProcessing 
        ? "not-allowed" 
        : "pointer",
    }}
    onClick={() => {
      if (method === "Pay Now") {
        createPayment();
      }
    }}
    disabled={paymentProcessing}  // Corrected
  >
    {paymentProcessing ? "Processing..." : method}  
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
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <h4 style={{ marginBottom: "10px" }}>
                        Scan QR Code to Pay
                      </h4>
                      <QRCodeSVG
                        value={`upi://pay?pa=${payment.bankDetails.upiId}&am=${payment.amount}`}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        style={{ margin: "0 auto" }}
                      />
                    </div>
                  )}

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
                            (window.location.href = `phonepe://pay?pa=${
                              payment.bankDetails.upiId
                            }&pn=${encodeURIComponent(
                              payment.bankDetails.name
                            )}&am=${payment.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
                              `Payment to ${payment.bankDetails.name}`
                            )}`)
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
                            (window.location.href = `upi://pay?pa=${
                              payment.bankDetails.upiId
                            }&pn=${encodeURIComponent(
                              payment.bankDetails.name
                            )}&am=${payment.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
                              `Payment to ${payment.bankDetails.name}`
                            )}`)
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
                            (window.location.href = `paytmmp://upi/pay?pa=${
                              payment.bankDetails.upiId
                            }&pn=${encodeURIComponent(
                              payment.bankDetails.name
                            )}&am=${payment.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
                              `Payment to ${payment.bankDetails.name}`
                            )}`)
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
                    </div>
                  )}

                  {payment.status === "pending" && (
                    <div
                      style={{
                        paddingTop: "15px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <h4 style={{ marginBottom: "10px" }}>Verify Payment</h4>
                      <input
                        type="text"
                        placeholder="Enter UTR Number"
                        value={utr}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");

                          setUtr(value.slice(0, 20));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-indigo-500"
                        style={{ textTransform: "uppercase" }}
                        pattern="[A-Z0-9]{10,20}"
                        title="10-20 alphanumeric characters in uppercase"
                        required
                      />
                      <button
                        onClick={handleVerifyClick}
                        disabled={isProcessingPayment || !utr}
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor:
                            isProcessingPayment || !utr ? "#9ca3af" : "#16a34a",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor:
                            isProcessingPayment || !utr
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {isProcessingPayment
                          ? `Verifying... `
                          : "Verify Payment"}
                      </button>
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
      {errorMessage && (
  <div style={{ 
    color: "red", 
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#ffe5e5",
    border: "1px solid #ffcccc"
  }}>
    ⚠️ {errorMessage}
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
    maxHeight: "75vh",
    marginTop:"100px"
  },
  scrollableContainer: {
    overflowY: "auto",
    paddingRight: "10px",
    maxHeight: "70vh",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
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

export default UserPay;
