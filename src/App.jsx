// src/App.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

const App = () => {
  const location = useLocation();
  const path = location.pathname;

  // Routes where user navbar/footer must be hidden
  const hideLayoutRoutes = ["/login", "/signup"];

  // Hide user navbar/footer on admin routes
  const isAdminRoute = path.startsWith("/admin");

  // Final condition
  const shouldHideLayout = hideLayoutRoutes.includes(path) || isAdminRoute;

  return (
    <>
      {/* Show USER navbar only if not admin route and not login/signup */}
      {!shouldHideLayout && <Navbar />}

      <Outlet />

      {/* Show USER footer only if not admin route and not login/signup */}
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default App;