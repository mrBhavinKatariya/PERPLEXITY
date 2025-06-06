import { Router } from "express";
import { loginUser, logOutUser, registerUser, getCurrentUser, createPayment, verifyPayment, getPaymentDetails } from "../controllers/user.controllers.js";


// import { upload } from "../middlewares/multer.middlewares.js";
import {  verifyJWT, verifyJWTS } from "../middlewares/auth.middlewares.js";

import { deductUserBalance, deleteOldRandomNumbers, getCountdownTimeEndpoint, getLastTenRandomNumbersEndpoint, getRandomNumberEndpoint, getUserBalanceEndpoint, getUserBetHistoryEndpoint, handleUserBetEndpoint, RazorPayCreatePaymentOrder, RazorpayPaymentAndUpdateBalance, updateUserBalanceEndpoint , changeCurrentPassword, createFundAccount, initiateWithdrawal, handlePayoutWebhook, transactionHistory, getReferralEarnings, CashfreeCreatePaymentOrder, CashfreePaymentVerification, initiateCashfreePayout, handleCashfreeWebhook} from "../controllers/prediction.controllers.js";
import { AdminOverride } from "../models/AdminOverrideColor.js";
// import { generateRandomNumber, generateRandomNumberEndpoint, getCountdownTimeEndpoint, handleRandomNumberGeneration } from "../controllers/prediction.controllers.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser); // Removed verifyJWT middleware
router.route("/logout").post(verifyJWT, logOutUser);

router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/randomeNumber").get(handleRandomNumberGeneration)
router.route("/randomenumber").get(getRandomNumberEndpoint);
router.route("/countdowntime").get(getCountdownTimeEndpoint);
router.route("/lastrandomenumber").get(getLastTenRandomNumbersEndpoint)
router.route("/delete-old-random-numbers").delete(deleteOldRandomNumbers);
// router.route('/utr-number').post(storeUTRNumberEndpoint);
router.route('/update-balance').post(updateUserBalanceEndpoint);
router.route('/get-balance/:userId').get(verifyJWT,getUserBalanceEndpoint);
router.route('/deduct-balance').post(deductUserBalance); // user re jyare bet mari te  amount confirm button
router.route('/invest').post(handleUserBetEndpoint); // kya button par ketla paisa malse user ne
router.route("/bet-history/:userId").get(getUserBetHistoryEndpoint)
router.route("/create-razorpay-order").post(verifyJWT,RazorPayCreatePaymentOrder);
router.route("/verify-razorpay-payment").post(verifyJWT,RazorpayPaymentAndUpdateBalance);
router.route("/change-password").post(verifyJWTS, changeCurrentPassword)
router.route("/fund-account").post(createFundAccount);
router.route("/withdraw").post(initiateWithdrawal);
router.route("/payout-webhook").post(handlePayoutWebhook);
router.route("/transactions-history/:userid").get(verifyJWT,transactionHistory)
router.route('/referral/earnings').get(verifyJWTS,getReferralEarnings);


// router.js में निम्नलिखित रूट्स ऐड करें

// पेमेंट संबंधित रूट्स
router.route("/cashfree/create-order")
  .post(verifyJWT, CashfreeCreatePaymentOrder);

router.route("/cashfree/verify-payment")
  .post(verifyJWT, CashfreePaymentVerification);

// पेआउट रूट्स  
router.route("/cashfree/initiate-payout")
  .post(verifyJWT, initiateCashfreePayout);

// वेबहुक हैंडलिंग
router.route("/cashfree/webhook")
  .post(handleCashfreeWebhook);




  // -------BANK PAY-------

  router.route('/payments').post(verifyJWTS,createPayment);
router.route('/payments/verify').post(verifyJWTS,verifyPayment);
router.route('/payments/:paymentId').get(verifyJWTS,getPaymentDetails);



export default router;