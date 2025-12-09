import React from "react";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

import { Outlet } from "react-router-dom";
const Layout = () => {
  const location = useLocation();
  // Exclude admin pages and login pages from footer
  const isAdmin = location.pathname.startsWith("/admin");
  const isLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <Outlet />
      {!isAdmin && !isLoginOrRegister && <Footer />}
    </>
  );
};

export default Layout;
