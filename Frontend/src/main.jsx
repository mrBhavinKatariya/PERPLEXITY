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
// import VideoDetails from "./Component/Showvideo.component";
// import VideoDetails from "./Component/Showvideo";
// import Channel from "./Component/channel.component";
// import LikedVideos from "./Component/Liked.component";
// import History from "./Component/history.component";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      Redirect root URL to /home
      <Route index element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      
      <Route path="/login" element={<Login />} />
      {/* <Route path="/create-video" element={<MyContent/>}/>  */}
      <Route path="/register" element={<Register/>}/>
      <Route path="/prediction" element={<ColorPredictionPage/>}/>

      {/* <Route path="/video/:videoId" element={<VideoDetails/>} /> */}
      {/* <Route path="/channel" element={<Channel/>} /> */}
      {/* <Route path="/channel/:username" element={<Channel/>} />
      <Route path="/history/:username" element={<History/>} /> */}


    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
