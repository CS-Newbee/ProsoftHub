import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
