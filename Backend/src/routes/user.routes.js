import { Router } from "express";
import { loginUser, logOutUser, registerUser,getCurrentUser, registerAdmin,
  loginAdmin,
  setNextColor,
  getOverrideStatus
 } from "../controllers/user.controllers.js";
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyAdmin, verifyJWT, verifyJWTS } from "../middlewares/auth.middlewares.js";

// import { getCurrentUser } from "../controllers/user.controllers.js";
import { deductUserBalance, deleteOldRandomNumbers, getCountdownTimeEndpoint, getLastTenRandomNumbersEndpoint, getRandomNumberEndpoint, getUserBalanceEndpoint, getUserBetHistoryEndpoint, handleUserBetEndpoint, RazorPayCreatePaymentOrder, RazorpayPaymentAndUpdateBalance, storeUTRNumberEndpoint, updateUserBalanceEndpoint , changeCurrentPassword, createFundAccount, initiateWithdrawal, handlePayoutWebhook, transactionHistory, getReferralEarnings} from "../controllers/prediction.controllers.js";
import { AdminOverride } from "../models/AdminOverrideColor.js";
// import { generateRandomNumber, generateRandomNumberEndpoint, getCountdownTimeEndpoint, handleRandomNumberGeneration } from "../controllers/prediction.controllers.js";


const checkAdmin = (req, res, next) => {
    if(req.user.role !== "admin") throw new Error("Unauthorized");
    next();
  };

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser); // Removed verifyJWT middleware
// router.route("/logout").post(verifyJWT, logOutUser);
router.route("/admin/register").post(registerAdmin);
router.route("/admin/login").post(loginAdmin);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/randomeNumber").get(handleRandomNumberGeneration)
router.route("/randomenumber").get(getRandomNumberEndpoint);
router.route("/countdowntime").get(getCountdownTimeEndpoint);
router.route("/lastrandomenumber").get(getLastTenRandomNumbersEndpoint)
router.route("/delete-old-random-numbers").delete(deleteOldRandomNumbers);
router.route('/utr-number').post(storeUTRNumberEndpoint);
router.route('/update-balance').post(updateUserBalanceEndpoint);
router.route('/get-balance/:userId').get(verifyJWT,getUserBalanceEndpoint);
router.route('/deduct-balance').post(deductUserBalance); // user re jyare bet mari te  amount confirm button
router.route('/invest').post(handleUserBetEndpoint); // kya button par ketla paisa malse user ne
router.route("/bet-history/:userId").get(getUserBetHistoryEndpoint)
router.route("/create-razorpay-order").post(verifyJWT,RazorPayCreatePaymentOrder);
router.route("/verify-razorpay-payment").post(RazorpayPaymentAndUpdateBalance);
router.route("/change-password").post(verifyJWTS, changeCurrentPassword)
router.route("/fund-account").post(createFundAccount);
router.route("/withdraw").post(initiateWithdrawal);
router.route("/transactions-history/:userid").get(verifyJWT,transactionHistory)
router.route('/referral/earnings').get(getReferralEarnings);

// ----------- Admin routes ---------------

router.use(verifyAdmin);
router.route("/admin/set-color").post(setNextColor);
router.route("/admin/override-status").get(getOverrideStatus);







export default router;