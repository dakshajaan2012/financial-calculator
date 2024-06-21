import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import FutureValue from "./components/FutureValue";
import MortgageCalculator from "./components/MortgageCalculator";
import EffectiveInterestRate from "./components/EffectiveInterestRate";
import NPVCalculator from "./components/NPVCalculator";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ marginTop: "64px" }}>
          <Routes>
            <Route path="/" element={<FutureValue />} /> {/* Default route */}
            <Route path="/future-value" element={<FutureValue />} />
            <Route
              path="/mortgage-calculator"
              element={<MortgageCalculator />}
            />
            <Route
              path="/effective-interest-rate"
              element={<EffectiveInterestRate />}
            />
            <Route path="/npv-calculator" element={<NPVCalculator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
