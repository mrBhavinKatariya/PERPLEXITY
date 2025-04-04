import React from "react";
// import Header from "./Dashbord";
import Header from "./Dashbord.component";
import { Outlet } from "react-router-dom";
import Home from "./Home.component";
import JewelryWebsite from "./Jewelry.component";
import Footer from "./Footer.component";

function Layout(){
    return(
        <>
        <Header/>
        <Outlet/>
        {/* <Footer/> */}

        </>
    )
}

export default Layout;