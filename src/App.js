import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Components/Login/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import TopTen from "./Components/TopTen/TopTen";
import PointOfSales from "./Components/PointOfSales/PointOfSales";
import Inventory from "./Components/Inventory/Inventory";
import Accounts from "./Components/Accounts/Accounts";
import PurchasePlans from "./Components/PurchasePlans/PurchasePlans";
import Crm from "./Components/Crm/Crm";
import InvoiceWiseStock from "./Components/Inventory/InvoiceWiseStock";
import Graphs from "./Components/Graphs/Graphs";
import BarCodeCheck from "./Components/BarCodeCheck/BarCodeCheck";
import TagCheck from "./Components/TagCheck/TagCheck";
import Estimation from "./Components/Estimation2.jsx/Estimation";

function App() {
  const tenantName = localStorage.getItem("tenantName");
  const [isAuthenticated, setIsAuthenticated] = useState(
    // localStorage.getItem("isLoggedIn") === "true"
    tenantName,
  );

  const handleLogin = (name) => {
    // localStorage.setItem("isLoggedIn", "true"); // Store login status
    setIsAuthenticated(name);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Routes>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/point-of-sales" element={<PointOfSales />} />
                <Route path="/top-five" element={<TopTen />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/purchase-plans" element={<PurchasePlans />} />
                <Route path="/crm" element={<Crm />} />
                <Route path="/graphs" element={<Graphs />} />
                <Route path="/bar-code-check" element={<BarCodeCheck />} />
                <Route path="/estimation" element={<Estimation />} />
                <Route
                  path="/invoice-wise-stock"
                  element={<InvoiceWiseStock />}
                />
                <Route path="/tag-check" element={<TagCheck />} />
              </Routes>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
