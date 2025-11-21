import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

const App = () => {
  const location = useLocation();
  const path = location.pathname;
  const hideLayoutRoutes = ["/login", "/signup"];
  const isAdminRoute = path.startsWith("/admin");
  const shouldHideLayout = hideLayoutRoutes.includes(path) || isAdminRoute;
  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <Outlet />
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default App;