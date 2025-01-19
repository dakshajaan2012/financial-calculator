import React from "react";

function Menu({ handleNavigation }) {
  return (
    <div>
      <h1>Calculator Menu</h1>
      <button onClick={() => handleNavigation("FutureValue")}>
        Future Value
      </button>
      <button onClick={() => handleNavigation("NPV")}>NPV & IRR</button>
      <button onClick={() => handleNavigation("Mortgage")}>Mortgage</button>
      <button onClick={() => handleNavigation("EffectiveInterest")}>
        Effective Interest
      </button>
      <button onClick={() => handleNavigation("MoneyDurationCalculator")}>
        Money Withdrawals
      </button>
    </div>
  );
}

export default Menu;
