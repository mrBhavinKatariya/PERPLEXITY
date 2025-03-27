import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import { FaTrophy } from "react-icons/fa";
import RechargePage from "./Recharge.component";
import { FaTrophy, FaSyncAlt } from "react-icons/fa";

export default function ColorPredictionGame() {
  const [timeLeft, setTimeLeft] = useState(120);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [contractMoney, setContractMoney] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [showRecharge, setShowRecharge] = useState(false);
  const [userBalance, setUserBalance] = useState(0); // User's available balance
  const [error, setError] = useState(""); // Error message for insufficient balance
  const [userId, setUserId] = useState(null); // Changed to null initial state
  const [user, setUser] = useState({
    id: "", // Initialize with an empty string or fetch from authentication
    name: "",
    phone: "",
    email: "",
  });
  // Add this state
  const [serverTime, setServerTime] = useState(120);
  const [userHistory, setUserHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authError, setAuthError] = useState("");

  const [disabledButtons, setDisabledButtons] = useState(() => {
    const saved = localStorage.getItem('disabledButtons');
    return saved ? JSON.parse(saved) : {
      joinGreen: false,
      joinRed: false,
      joinViolet: false,
      digits: [],
    };
  });

  const API_URL =
    import.meta.env.REACT_APP_API_URL || "https://perplexity-bd2d.onrender.com";

  // Modified fetchUser effect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthError("Error fetching current user: Error: No token found");
          setShowLoginPopup(true);
          return;
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
        const userData = response.data.data;
        setUserId(userData._id); // Set userId directly from response
        console.log("User ID", userData._id);

        setUser({
          // Update user state with correct ID
          id: userData._id,
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
        });
      } catch (err) {
        console.error("Error fetching current user:", err);
        setAuthError(err.message);
        setShowLoginPopup(true);
      }
    };

    fetchUser();
  }, []);

  // Fetch user balance

  // Add login popup JSX
  const renderLoginPopup = () => (
    <div style={styles.popupOverlay}>
      <div style={styles.loginPopup}>
        <h3 style={styles.popupHeader}>Login Required</h3>
        <div style={styles.errorMessage}>{authError}</div>
        <button
          style={styles.loginButton}
          onClick={() => (window.location.href = "/login")} // Update with your login route
        >
          Log In
        </button>
      </div>
    </div>
  );

  // Add refresh handler function in the component
  const handleRefresh = async () => {
    try {
      // Refresh all data
      await fetchUserBalance();
      await fetchLastTenRandomNumbers(1);
      await fetchUserHistory();
      setPage(1);
      setHistoryPage(1);
      await fetchUserHistory(1);
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const fetchUserBalance = useCallback(async () => {
    try {
      if (!userId) {
        console.log("Waiting for user ID...");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/users/get-balance/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Balance API response:", response.data);

      if (response.data.success) {
        setUserBalance(response.data.data.balance);
        console.log("uuserBa", response.data.data.balance);
      } else {
        console.error("Balance fetch error:", response.data.message);
      }
    } catch (error) {
      console.error("Balance fetch failed:", {
        message: error.response?.data?.message,
        status: error.response?.status,
      });
    }
  }, [userId]); // Changed dependency to userId

  // Modified balance fetch effect
  useEffect(() => {
    if (userId) {
      fetchUserBalance();
    }
  }, [userId, fetchUserBalance]);

  // Add this function to fetch user history
  const fetchUserHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/users/bet-history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: historyPage,
            limit: 10,
          },
        }
      );
  
      if (response.data.success) {
        setUserHistory(response.data.data);
        // Add total pages if available from API
        // setTotalHistoryPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  }, [userId, historyPage]);

const handlePrevHistory = () => {
  setHistoryPage((prev) => Math.max(1, prev - 1));
};

  // Add these pagination handlers
  const handleNextHistory = () => {
    setHistoryPage((prev) => prev + 1);
  };

// In the JSX for pagination buttons
<div style={historyStyles.pagination}>
  <button
    style={styles.paginationButton}
    onClick={handlePrevHistory}
    disabled={historyPage === 1}
  >
    Previous
  </button>
  <button
    style={styles.paginationButton}
    onClick={handleNextHistory}
    disabled={userHistory.length <= historyPage * 10}
  >
    Next
  </button>
  <div className="mb-[20px]"></div>
</div>




  // Add this useEffect to fetch history when page or user changes
  useEffect(() => {
    if (userId) {
      fetchUserHistory();
    }
  }, [userId, historyPage, fetchUserHistory]);

  useEffect(() => {
    localStorage.setItem('disabledButtons', JSON.stringify(disabledButtons));
  }, [disabledButtons]);
 
  const handleConfirmBet = async () => {
    // Remove isLoading check to allow multiple submissions
    setShowPopup(false);
    const totalAmount = quantity * contractMoney;

    // if(totalAmount < 100)
    // const charge = totalAmount *  1;

    const totalDeduction = totalAmount;

    // Create a copy of current balance for this transaction
    const currentBalance = userBalance;

    console.log("userbalances", userBalance);

    if (currentBalance < totalDeduction) {
      setError("Insufficient balance. Please recharge.");
      setShowPopup(true);
      return;
    }

    // Optimistic update with local balance copy
    setUserBalance((prev) => prev - totalDeduction);
    setSelectedNumbers((prev) => [
      ...prev,
      { number: selectedNumber, quantity, contractMoney, total: totalAmount },
    ]);
    setError("");
    setShowPopup(false);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/v1/users/invest`,
        {
          userId: userId,
          number: selectedNumber,
          quantity: quantity,
          contractMoney: contractMoney,
          totalAmount: totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update bet status on success
      await fetchUserBalance();
    } catch (error) {
      // Revert balance on error
      console.error("Error placing bet:", error);
      setError("An error occurred. Please try again.");
      setShowPopup(true);
    } finally {
      setQuantity(1);
      setContractMoney(10);
    }
  };

  // Fetch countdown time from the API
  useEffect(() => {
    let timerId;
    const updateTimer = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/users/countdownTime`
        );
        const newTime = response.data.data.countdownTime;
        setServerTime(newTime);
        setTimeLeft(newTime);
      } catch (error) {
        console.error("Error updating timer:", error);
      }
    };

    // Initial fetch
    updateTimer();

    // Set up interval for updates
    timerId = setInterval(updateTimer, 100000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let timerId;

    const startTimer = () => {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerId);
            return 120; // Reset timer to 120 seconds
          }
          return prev - 1;
        });
      }, 100000);
    };

    startTimer();
    return () => clearInterval(timerId);
  }, []);

  // Reset timer after 1 minute when it reaches 0
  // useEffect(() => {
  //   if (timeLeft === 0) {
  //     setDisabledButtons({
  //       joinGreen: false,
  //       joinRed: false,
  //       joinViolet: false,
  //       digits: [],
  //     });
  //   }
  // }, [timeLeft]);;

  useEffect(() => {
    if (timeLeft === 0) {
      setDisabledButtons({
        joinGreen: false,
        joinRed: false,
        joinViolet: false,
        digits: [],
      });
      localStorage.removeItem('disabledButtons'); // Optional: Clear localStorage entry
      setTimeout(() => {
        setTimeLeft(120);
      }, 120000);
    }
  }, [timeLeft]);

  // Rules Popup JSX
  const renderRulesPopup = () => (
    <div style={styles.popupOverlay}>
      <div style={styles.rulesPopup}>
        <h3 style={styles.popupHeader}>Game Rules</h3>
        <div style={styles.rulesContent}>
          <div style={styles.ruleSection}>
            <p style={styles.ruleTime}>
              ⏰ 3 minutes per issue, 2m 30s to order, 30s to show result
              <br />
              🕒 480 issues/day | 💰 Contract amount after 2% fee: 98
            </p>

            <div style={styles.ruleItem}>
              <span style={styles.ruleTitle}>🎯 JOIN GREEN (1,3,7,9)</span>
              <span style={styles.rulePayout}>Win: 196 (98×2)</span>
              <span style={styles.ruleSpecial}>If 5 appears: 147 (98×1.5)</span>
            </div>

            <div style={styles.ruleItem}>
              <span style={styles.ruleTitle}>🎯 JOIN RED (2,4,6,8)</span>
              <span style={styles.rulePayout}>Win: 196 (98×2)</span>
              <span style={styles.ruleSpecial}>If 0 appears: 147 (98×1.5)</span>
            </div>

            <div style={styles.ruleItem}>
              <span style={styles.ruleTitle}>🎯 JOIN VIOLET (0,5)</span>
              <span style={styles.rulePayout}>Win: 441 (98×4.5)</span>
            </div>

            <div style={styles.ruleItem}>
              <span style={styles.ruleTitle}>🎯 SELECT NUMBER</span>
              <span style={styles.rulePayout}>Win: 882 (98×9)</span>
            </div>

            <p style={styles.ruleNote}>
              * Service fee: 2% deducted from all trades
              <br />* All payouts based on 98 contract amount after fee
              deduction
            </p>
          </div>
        </div>
        <button
          style={styles.closeButton}
          onClick={() => setShowRulesPopup(false)}
        >
          Close Rules
        </button>
      </div>
    </div>
  );

  // Fetch last 10 random numbers based on the   page
  const fetchLastTenRandomNumbers = useCallback(async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/users/lastrandomenumber?page=${page}&limit=10`
      );
      console.log("API Response:", response.data); // Debugging: Log API response
      if (response.data.success) {
        setRecords(response.data.data); // Set records from the API response
        console.log("Records after update:", response.data.data); // Debugging: Log updated records
        if (response.data.data.length > 0) {
          setCurrentPeriod(response.data.data[0].period + 1); // Update current period
        }
      }
    } catch (error) {
      console.error("Error fetching last 10 random numbers:", error);
    }
  }, []);

  // Fetch records when the page changes
  useEffect(() => {
    console.log("Fetching records for page:", page); // Debugging: Log current page
    fetchLastTenRandomNumbers(page);
  }, [fetchLastTenRandomNumbers, page]);

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle "Next 10 Records" button click
  const handleNextRecords = () => {
    console.log("Next Page:", page + 1); // Debugging: Log next page
    setPage((prev) => prev + 1);
  };

  // Handle "Previous" button click
  const handlePreviousRecords = () => {
    console.log("Previous Page:", page - 1); // Debugging: Log previous page
    setPage((prev) => Math.max(1, prev - 1));
  };

  const deleteOldRandomNumbers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/api/v1/users/delete-old-random-numbers`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Old random numbers deleted:", response.data);
    } catch (error) {
      console.error("Error deleting old random numbers:", error);
    }
  };

  useEffect(() => {
    let intervalId;

    const fetchRandomNumber = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/users/randomeNumber`);
        const newNumber = response.data.data.number;
        console.log("New Random Number:", newNumber);
    
        // Immediately fetch the latest records
        await fetchLastTenRandomNumbers(1);
        
        // Refresh user history to show settled bets
        await fetchUserHistory(1);
        setHistoryPage(1);
      } catch (error) {
        console.error("Error fetching random number:", error);
      }
    };

    const handleCountdownEnd = () => {
      fetchRandomNumber();
      deleteOldRandomNumbers();
      setTimeLeft(120); // Reset the countdown to 90 seconds
      intervalId = setInterval(fetchRandomNumber, 120000);
    };

    if (timeLeft === 0) {
      handleCountdownEnd();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timeLeft, fetchLastTenRandomNumbers, selectedNumbers, fetchUserHistory]);

 

  // Handle number click
  const handleNumberClick = (num) => {
    if (timeLeft > 20) {
      setSelectedNumber(num);
      setShowPopup(true);
  
      // Disable buttons based on selection
      if (num === 'green') {
        setDisabledButtons(prev => ({
          ...prev,
          joinGreen: true,
          digits: Array.from(new Set([...prev.digits, 1, 3, 7, 9]))
        }));
      } else if (num === 'red') {
        setDisabledButtons(prev => ({
          ...prev,
          joinRed: true,
          digits: Array.from(new Set([...prev.digits, 2, 4, 6, 8]))
        }));
      } else if (num === 'violet') {
        setDisabledButtons(prev => ({
          ...prev,
          joinViolet: true,
          digits: Array.from(new Set([...prev.digits, 0, 5]))
        }));
      } else if (typeof num === 'number') {
        setDisabledButtons(prev => ({
          ...prev,
          digits: Array.from(new Set([...prev.digits, num]))
        }));
      }
    }
  };

  // Handle quantity change
  const handleQuantityChange = (operation) => {
    setQuantity((prev) =>
      Math.max(1, operation === "increment" ? prev + 1 : prev - 1)
    );
  };

  const getBackgroundColor = (num) => {
    if ([1, 3, 7, 9].includes(num)) return "#4CAF50";
    if ([2, 4, 6, 8].includes(num)) return "#FF0000";
    if ([0, 5].includes(num)) return "#800080";
    return "#fff";
  };

  // Render number circle
  const renderNumberCircle = (number) => {
    const num = parseInt(number, 10);
    const backgroundColor = getBackgroundColor(num);

    return (
      <div
        style={{
          backgroundColor,
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          margin: "0 auto",
        }}
      >
        {number}
      </div>
    );
  };

  return (
    <div style={styles.container}>
            {showLoginPopup && renderLoginPopup()}
      {/* Balance and Recharge Section */}
      <div style={styles.balanceContainer}>
        <div style={styles.balanceGroup}>
          <span style={styles.balanceLabel}>Available Balance:</span>
          <span style={styles.balanceAmount}>₹{userBalance.toFixed(2)}</span>
        </div>
        <div style={styles.buttonGroup}>
          <button
            style={styles.rechargeButton}
            onClick={() => setShowRecharge(true)}
          >
            ➕ Recharge
          </button>
          <button
            style={styles.rulesButton}
            onClick={() => setShowRulesPopup(true)}
          >
            📖 Read Rules
          </button>
        </div>
      </div>
      {showRecharge && (
        <div style={styles.popupOverlay}>
          <RechargePage
            user={user}
            onClose={() => setShowRecharge(false)}
            currentPeriod={currentPeriod}
            timeLeft={timeLeft}
          />
        </div>
      )}

      {showRulesPopup && renderRulesPopup()}

      {/* Rest of the game UI remains same */}
      <div style={styles.combinedBox}>
        <FaSyncAlt
          style={styles.refreshIcon}
          onClick={handleRefresh}
          title="Refresh Data"
        />
        <div style={styles.combinedContent}>
          <div style={styles.periodSection}>
            <FaTrophy style={styles.trophyIcon} />
            <span style={styles.periodText}>Period #{currentPeriod}</span>
          </div>
          <div style={styles.timerSection}>
            <div style={styles.timerLabel}>Countdown</div>
            <div style={styles.timer}>
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}{" "}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ justifyContent: "space-around" }}
        className="flex justify-space-evenly"
      >
        <button
          style={{
            ...styles.gridTitle,
            backgroundColor: "#800080",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            opacity: (disabledButtons.joinViolet || timeLeft <= 20) ? 0.6 : 1,
            cursor: (disabledButtons.joinViolet || timeLeft <= 20) ? "not-allowed" : "pointer",
          }}
          onClick={() => handleNumberClick("violet")}
          disabled={disabledButtons.joinViolet || timeLeft <= 20}
        >
          Join Violet
        </button>

        <button
          style={{
            ...styles.gridTitle,
            backgroundColor: "#4caf50",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            opacity: (disabledButtons.joinGreen || timeLeft <= 20) ? 0.6 : 1,
    cursor: (disabledButtons.joinGreen || timeLeft <= 20) ? "not-allowed" : "pointer",
          }}
          onClick={() => handleNumberClick("green")}
          disabled={disabledButtons.joinGreen || timeLeft <= 20}
        >
          Join Green
        </button>
        <button
          style={{
            ...styles.gridTitle,
            backgroundColor: "#FF0000",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            opacity: (disabledButtons.joinRed || timeLeft <= 20) ? 0.6 : 1,
            cursor: (disabledButtons.joinRed || timeLeft <= 20) ? "not-allowed" : "pointer",
          }}
          onClick={() => handleNumberClick("red")}
          disabled={disabledButtons.joinRed || timeLeft <= 20}
        >
          Join Red
        </button>
      </div>

      <div style={styles.numberGrid}>
        <div style={styles.numberRow}>
          {[0, 1, 2, 3, 4].map((num) => (
            <button
              key={num}
              disabled={disabledButtons.digits.includes(num) || timeLeft <= 20}
              style={{
                ...styles.numberButton,
                background: [0, 5].includes(num)
                  ? "linear-gradient(135deg, rgb(128, 0, 128) 50%, rgb(255, 0, 0) 50%)"
                  : getBackgroundColor(num),
                border: [0, 5].includes(num)
                  ? "2px solid rgb(255, 0, 0)"
                  : "none",
                 opacity: (disabledButtons.digits.includes(num) || timeLeft <= 20) ? 0.6 : 1,
      cursor: (disabledButtons.digits.includes(num) || timeLeft <= 20) ? "not-allowed" : "pointer",
              }}
              onClick={() => handleNumberClick(num)}
             
            >
              {num}
            </button>
          ))}
        </div>
        <div style={styles.numberRow}>
  {[5, 6, 7, 8, 9].map((num) => (
    <button
      key={num}
      disabled={disabledButtons.digits.includes(num) || timeLeft <= 20}
      style={{
        ...styles.numberButton,
        background: [0, 5].includes(num)
          ? "linear-gradient(135deg, rgb(128, 0, 128) 50%, rgb(76, 175, 80) 50%)"
          : getBackgroundColor(num),
        border: [0, 5].includes(num)
          ? "2px solid rgb(76, 175, 80)"
          : "none",
        opacity: (disabledButtons.digits.includes(num) || timeLeft <= 20) ? 0.6 : 1,
        cursor: (disabledButtons.digits.includes(num) || timeLeft <= 20) ? "not-allowed" : "pointer",
      }}
      onClick={() => handleNumberClick(num)}
    >
      {num}
    </button>
  ))}
</div>
      </div>

      {/* Popup for selecting numbers */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h3 style={styles.popupHeader}>Select {selectedNumber}</h3>

            <div style={styles.section}>
              <h4>Contract Money</h4>

              <div style={styles.moneyOptions}>
                {[10, 100, 1000, 10000].map((amount) => (
                  <button
                    key={amount}
                    style={
                      contractMoney === amount
                        ? styles.activeMoneyButton
                        : styles.moneyButton
                    }
                    onClick={() => setContractMoney(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h4>Quantity</h4>
              <div style={styles.quantitySelector}>
                <button
                  style={styles.quantityButton}
                  onClick={() => handleQuantityChange("decrement")}
                >
                  -
                </button>
                <span style={styles.quantityDisplay}>{quantity}</span>
                <button
                  style={styles.quantityButton}
                  onClick={() => handleQuantityChange("increment")}
                >
                  +
                </button>
              </div>
            </div>

            <div style={styles.totalSection}>
              Total contract money: ₹{quantity * contractMoney}
            </div>

            {/* Error message for insufficient balance */}
            {error && <div style={styles.errorMessage}>{error}</div>}
            <div style={styles.terms}>
              <label>
                <input type="checkbox" /> I agree to PRESALE RULES
              </label>
            </div>

            <div style={styles.popupActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowPopup(false)}
              >
                CLOSE
              </button>
              <button style={styles.confirmButton} onClick={handleConfirmBet}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Records section */}
      <div style={styles.recordsContainer}>
        <span className="flex items-center justify-center mt-[5px] pb-[10px] [border-bottom:1px_solid_#0067CC]">
          <FaTrophy /> &nbsp; Parity Record
        </span>
        <div className="mt-[10px]" style={styles.recordsHeader}>
          <span> Period</span>
          <span>Price</span>
          {/* <span>Number</span> */}
          <span>Result</span>
        </div>

        {records.slice((page - 1) * 10, page * 10).map((record, index) => (
          <div key={index} style={styles.recordRow}>
            <span style={{ opacity: timeLeft <= 20 ? 0.6 : 1 }}>
              {record.period}
            </span>
            <span>{record.price}</span>
            {/* <span>{renderNumberCircle(record.number)}</span> */}
            <span>{renderNumberCircle(record.result)}</span>
          </div>
        ))}
        <div style={styles.paginationContainer}>
          <button
            style={styles.paginationButton}
            onClick={handlePreviousRecords}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            style={styles.paginationButton}
            onClick={handleNextRecords}
            disabled={records.length <= page * 10}
          >
            Next
          </button>
        </div>
      </div>

      <div style={historyStyles.container}>
  <span className="flex items-center justify-center mt-[5px] pb-[10px] [border-bottom:1px_solid_#0067CC]">
    <FaTrophy /> &nbsp; User History
  </span>
  <div className="mt-[10px] " style={historyStyles.header}>
    <span>Amount</span>
    <span>Selection</span>
    {/* <span>Result</span> */}
    <span>P/L</span>
  </div>

  {userHistory.slice((historyPage - 1) * 10, historyPage * 10)
  .map((history, index) => {
    const betAmount = parseFloat(history.betAmount) || 0;
    const winnings = parseFloat(history.winnings) || 0

    // Calculate profit based on result
    const profit = history.result === "WIN" ? winnings : -betAmount;

    return (
      <div key={index} style={historyStyles.row}>
        {/* Display bet amount */}
        <span style={{ color: "#000" }}>₹{betAmount.toFixed(2)}</span>

        {/* Display selection (number or color) */}
        <span>
          {history.selectedColor === 'number' ? (
            renderNumberCircle(history.randomNumber) // Display the random number
          ) : (
            <span
              style={{
                color: "#000",
                backgroundColor: getBackgroundColor(history.selectedColor), // Use selectedColor for background
                padding: "2px 8px",
                borderRadius: "4px",
                display: "inline-block",
                minWidth: "60px",
              }}
            >
              {history.selectedColor?.toUpperCase() || ""} 
            </span>
          )}
        </span>

        {/* Display profit/loss */}
        <span style={{ color: profit >= 0 ? "green" : "red" }}>
          ₹{profit.toFixed(2)}
        </span>
      </div>
    );
  })}

  <div style={historyStyles.pagination}>
    <button
      style={styles.paginationButton}
      onClick={handlePrevHistory}
      disabled={historyPage === 1}
    >
      Previous
    </button>
    <button
      style={styles.paginationButton}
      onClick={handleNextHistory}
      disabled={userHistory.length <= historyPage * 10}
    >
      Next
    </button>

    <div className="mb-[20px]"></div>
  </div>
</div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  combinedBox: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "25px",
    position: "relative",
    paddingTop: "40px",
  },
  popupPeriod: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  popupTimer: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  combinedContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "relative",
  },
  refreshIcon: {
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "#3498db",
    fontSize: "20px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "rotate(360deg)",
    },
  },

  trophyIcon: {
    color: "#FFD700",
    fontSize: "24px",
  },
  periodText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  timerSection: {
    textAlign: "center",
  },
  timerLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px",
  },

  balanceContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "15px 20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "25px",
  },
  balanceGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  balanceLabel: {
    color: "#666",
    fontSize: "14px",
  },
  balanceAmount: {
    color: "#2ecc71",
    fontSize: "22px",
    fontWeight: "bold",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  rechargeButton: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  rulesButton: {
    backgroundColor: "#2980b9",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  rulesPopup: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    position: "relative",
    zIndex: 1001, // Higher than overlay
  },
  popupTimerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  popupHeader: {
    textAlign: "center",
    fontSize: "24px",
    color: "#2c3e50",
    marginBottom: "20px",
    fontWeight: "600",
  },
  rulesContent: {
    lineHeight: "1.6",
    fontSize: "15px",
  },
  ruleSection: {
    marginBottom: "25px",
  },
  ruleTime: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    margin: "15px 0",
    textAlign: "center",
    fontSize: "14px",
    color: "#7f8c8d",
  },
  ruleItem: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    margin: "10px 0",
  },
  ruleTitle: {
    color: "#e74c3c",
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "8px",
  },
  rulePayout: {
    color: "#27ae60",
    fontWeight: "500",
    margin: "5px 0",
  },
  ruleSpecial: {
    color: "#f39c12",
    fontWeight: "500",
    margin: "5px 0",
  },
  ruleNote: {
    color: "#7f8c8d",
    fontSize: "13px",
    marginTop: "20px",
    lineHeight: "1.5",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "12px 30px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
    width: "100%",
    fontSize: "16px",
    fontWeight: "500",
  },
  gameSections: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },
  gameBox: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  gameTitle: {
    color: "#2c3e50",
    fontSize: "18px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  timer: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#3498db",
    // marginTop: "10px",
  },

  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
  timerText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: "18px",
  },
  numberGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  numberRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
  },
  numberButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
    minWidth: "50px",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  recordsContainer: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
 // Update the recordsHeader and recordRow styles in the 'styles' object
recordsHeader: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr", // Three equal columns
  marginBottom: "12px",
  fontWeight: "bold",
  color: "#333",
  textAlign: "center", // Center align header text
},
recordRow: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr", // Three equal columns
  marginBottom: "8px",
  color: "#666",
  alignItems: "center",
  textAlign: "center", // Center align cell content
},
  navContainer: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: "16px",
    borderTop: "1px solid #ddd",
  },
  navButton: {
    border: "none",
    background: "none",
    color: "#666",
    fontSize: "14px",
    cursor: "pointer",
  },
  gridTitle: {
    color: "#666",
    marginBottom: "12px",
    fontWeight: "bold",
    minWidth: "100px",
    textAlign: "center",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Increased opacity
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000, // Higher z-index to cover everything
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  section: {
    margin: "15px 0",
    padding: "15px",
    backgroundColor: "#f8f8f8",
    borderRadius: "8px",
  },
  moneyOptions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  moneyButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",

    borderRadius: "6px",
    backgroundColor: "white",
    cursor: "pointer",
  },
  activeMoneyButton: {
    flex: 1,
    padding: "10px",
    border: "2px solid #4CAF50",
    borderRadius: "6px",
    backgroundColor: "#e8f5e9",
    cursor: "pointer",
  },
  quantitySelector: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "10px",
  },
  quantityButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  quantityDisplay: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  totalSection: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "#e3f2fd",
    borderRadius: "8px",
    fontWeight: "bold",
    textAlign: "center",
  },
  terms: {
    margin: "15px 0",
    fontSize: "14px",
    color: "#666",
  },
  popupActions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#e0e0e0",
    cursor: "pointer",
  },
  confirmButton: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  paginationButton: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    flex: 1,
    margin: "0 5px",
  },
  loginPopup: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  loginButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "15px",
    width: "100%",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#2980b9",
    }
  },
};

const historyStyles = {
  container: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginTop: "20px",
    overflowX: "auto", // मोबाइल पर horizontal scroll
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontWeight: "bold",
    color: "#333",
    minWidth: "300px", // मोबाइल पर minimum width
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: "#666",
    alignItems: "center",
    minWidth: "300px", // मोबाइल पर minimum width
    "& > span": {
      // सभी span elements के लिए
      flex: 1,
      textAlign: "center",
      padding: "0 5px",
    },
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
};
