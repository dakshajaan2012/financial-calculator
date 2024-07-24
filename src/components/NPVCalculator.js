import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper } from "@mui/material";
import { Line } from "react-chartjs-2";

const NPVCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [cashFlows, setCashFlows] = useState([""]);
  const [discountRate, setDiscountRate] = useState("");
  const [npvResult, setNpvResult] = useState("");
  const [irrResult, setIrrResult] = useState("");

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Yearly Cash Flows",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  /*   const handleCalculate = () => {
    if (
      !initialInvestment ||
      !cashFlows.every((cf) => cf !== "") ||
      !discountRate
    ) {
      alert("Please enter all fields");
      return;
    } */

  const handleCalculate = () => {
    if (isNaN(initialInvestment) || initialInvestment === "") {
      alert("Please fill out initial investment");
      return;
    }

    if (cashFlows.some((cf) => isNaN(cf) || cf === "")) {
      alert("Please add valid cashflow");
      return;
    }

    if (isNaN(discountRate) || discountRate === "") {
      alert("Please fill out discount rate");
      return;
    }

    const cfo_x = parseFloat(initialInvestment);
    const cfy_x1 = cashFlows.map((cf) => parseFloat(cf.trim()));
    const drate_x = parseFloat(discountRate) / 100;

    // Calculate NPV
    let npv = -cfo_x; // Start with the negative of initial investment
    for (let t = 0; t < cfy_x1.length; t++) {
      npv += cfy_x1[t] / Math.pow(1 + drate_x, t + 1);
    }

    // Calculate IRR using approximation method
    const tcf = [-cfo_x, ...cfy_x1];
    const irr = calculateIRR(tcf);

    // Format results for display
    setNpvResult(`$${npv.toFixed(2)}`);
    setIrrResult(`${(irr * 100).toFixed(2)}%`);

    // Update chart data
    const years = Array.from(
      { length: cfy_x1.length },
      (_, index) => index + 1
    );
    setChartData({
      labels: years,
      datasets: [
        {
          label: "Yearly Cash Flows",
          data: cfy_x1,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  };

  const handleClear = () => {
    setInitialInvestment("");
    setCashFlows([""]);
    setDiscountRate("");
    setNpvResult("");
    setIrrResult("");
    setChartData({
      labels: [],
      datasets: [
        {
          label: "Yearly Cash Flows",
          data: [],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
  };

  const handleAddCashFlow = () => {
    setCashFlows([...cashFlows, ""]);
  };

  const handleCashFlowChange = (index, value) => {
    const updatedCashFlows = [...cashFlows];
    updatedCashFlows[index] = value;
    setCashFlows(updatedCashFlows);
  };

  const calculateIRR = (cashFlows) => {
    const tolerance = 0.00001;
    let guess = 0.1;
    let limit = 1000;
    let npv = 0;

    for (let i = 0; i <= limit; i++) {
      npv = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + guess, t);
      }

      if (Math.abs(npv) < tolerance) {
        return guess;
      }

      const dnpv = derivativeNPV(cashFlows, guess);
      guess = guess - npv / dnpv;
    }

    return NaN; // If no solution found
  };

  const derivativeNPV = (cashFlows, rate) => {
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      dnpv -= (cashFlows[t] * t) / Math.pow(1 + rate, t + 1);
    }
    return dnpv;
  };

  return (
    <Paper
      style={{
        padding: 20,
        maxWidth: 1200,
        margin: "20px auto",
        marginTop: "20px",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom paddingTop="50px">
        NPV & IRR Calculator with Cash Flow Chart
      </Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Initial Investment"
            fullWidth
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
          />
        </Grid>
        {cashFlows.map((cashFlow, index) => (
          <Grid key={index} item xs={12}>
            <TextField
              label={`Yearly Cash Flow ${index + 1}`}
              fullWidth
              type="number"
              value={cashFlow}
              onChange={(e) => handleCashFlowChange(index, e.target.value)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddCashFlow}
          >
            Add Cash Flow
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Discount Rate (%)"
            fullWidth
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            fullWidth
          >
            Calculate NPV & IRR
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClear}
            fullWidth
          >
            Clear All
          </Button>
        </Grid>
      </Grid>

      <Typography
        variant="h5"
        align="center"
        gutterBottom
        style={{ marginTop: 50 }}
      >
        Results Summary
      </Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Calculated NPV"
            fullWidth
            value={npvResult}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Calculated IRR"
            fullWidth
            value={irrResult}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
      <br />
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        style={{ marginTop: 50 }}
      >
        Chart:
      </Typography>
      <Grid item xs={12}>
        <Line data={chartData} />
      </Grid>
    </Paper>
  );
};

export default NPVCalculator;
