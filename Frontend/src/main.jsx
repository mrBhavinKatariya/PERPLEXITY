import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./Component/Home.component";
import Layout from "./Component/Layout.component";
import Login from "./Component/Login.component";
// import ColorPredictionPage from "./Component/Prediction.component";
import ColorPredictionPage from "./Component/Prediction.component";
// import MyContent from "./Component/Mycontent.component";
// import Header from "./Component/Dashbord";
import Register from "./Component/Register.component";
import Setting from "./Component/Setting.component";
import PrivacyPolicy from "./Component/PrivactPolicy.component";
import RiskDisclosure from "./Component/RiskDiscloserAgrrmrnt";
import ForgotPassword from "./Component/ForgotPassword.component";
import ResetPassword from "./Component/ResetPassword.component";
import Withdrawal from "./Component/Withdrawal.component";
import TransactionHistory from "./Component/Transaction.component";
import JewelryWebsite from "./Component/Jewelry.component";
import Jewellery from "./Component/Jewellery.component";
// import VideoDetails from "./Component/Showvideo.component";
// import VideoDetails from "./Component/Showvideo";
// import Channel from "./Component/channel.component";
// import LikedVideos from "./Component/Liked.component";
// import History from "./Component/history.component";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      Redirect root URL to /home
      {/* <Route index element={<Navigate to="/" replace />} /> */}
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="/" element={<JewelryWebsite/>} />

      
      <Route path="/login" element={<Login />} />
      {/* <Route path="/create-video" element={<MyContent/>}/>  */}
      <Route path="/register" element={<Register/>}/>
      <Route path="/prediction" element={<ColorPredictionPage/>}/>
      <Route path="/setting" element={<Setting/>} />
      <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
      <Route path="/risk-Disclosure-agreement" element={<RiskDisclosure/> } />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      {/* <Route path="/reset-password" element={</rese>} /> */}
      <Route path="/reset-password/:token" element={<ResetPassword/>} />
      {/* <Route path="/video/:videoId" element={<VideoDetails/>} /> */}
      {/* <Route path="/channel" element={<Channel/>} /> */}
      {/* <Route path="/channel/:username" element={<Channel/>} />
      <Route path="/history/:username" element={<History/>} /> */}
      <Route path="/withdrawal" element={<Withdrawal/>} />
      <Route path="/Transaction-history" element={<TransactionHistory/>} />
      <Route path="/jewellery" element = {<Jewellery/>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
