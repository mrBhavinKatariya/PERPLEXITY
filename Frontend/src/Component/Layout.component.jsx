import React from "react";
// import Header from "./Dashbord";
import Header from "./Dashbord.component";
import { Outlet } from "react-router-dom";
import Home from "./Home.component";

function Layout(){
    return(
        <>
        <Header/>
        <Outlet/>

        </>
    )
}

export default Layout;