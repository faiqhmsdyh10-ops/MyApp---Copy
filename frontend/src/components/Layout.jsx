import React from "react";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

import { Outlet } from "react-router-dom";
const Layout = () => {
  const location = useLocation();
  // Exclude admin pages from layout
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Outlet />
      {!isAdmin && <Footer />}
    </>
  );
};

export default Layout;
