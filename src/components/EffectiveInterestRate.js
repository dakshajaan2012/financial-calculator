import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

const EffectiveInterestRate = () => {
  const [fixedDeposit, setFixedDeposit] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [numberOfYears, setNumberOfYears] = useState("");
  const [results, setResults] = useState({
    yearly: { interest: "", total: "" },
    semiAnnual: { interest: "", total: "" },
    quarterly: { interest: "", total: "" },
    monthly: { interest: "", total: "" },
    daily: { interest: "", total: "" },
  });

  const [chartData, setChartData] = useState({
    labels: ["Yearly", "Semi-Annual", "Quarterly", "Monthly", "Daily"],
    datasets: [
      {
        label: "Interest Amount",
        backgroundColor: "#3f51b5",
        borderColor: "#1a237e",
        borderWidth: 1,
        hoverBackgroundColor: "#7986cb",
        hoverBorderColor: "#3949ab",
        data: [],
      },
      {
        label: "Total Amount",
        backgroundColor: "#f50057",
        borderColor: "#c51162",
        borderWidth: 1,
        hoverBackgroundColor: "#ff4081",
        hoverBorderColor: "#d81b60",
        data: [],
      },
    ],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "fixedDeposit") {
      setFixedDeposit(value);
    } else if (name === "annualInterestRate") {
      setAnnualInterestRate(value);
    } else if (name === "numberOfYears") {
      setNumberOfYears(value);
    }
  };

  const calculateResults = () => {
    const interest = parseFloat(annualInterestRate) / 100;
    const principal = parseFloat(fixedDeposit);
    const years = parseFloat(numberOfYears);

    const yearlyInterest =
      principal * Math.pow(1 + interest, years) - principal;
    const semiAnnualInterest =
      principal * Math.pow(1 + interest / 2, 2 * years) - principal;
    const quarterlyInterest =
      principal * Math.pow(1 + interest / 4, 4 * years) - principal;
    const monthlyInterest =
      principal * Math.pow(1 + interest / 12, 12 * years) - principal;
    const dailyInterest =
      principal * Math.pow(1 + interest / 365, 365 * years) - principal;

    const yearlyTotal = principal + yearlyInterest;
    const semiAnnualTotal = principal + semiAnnualInterest;
    const quarterlyTotal = principal + quarterlyInterest;
    const monthlyTotal = principal + monthlyInterest;
    const dailyTotal = principal + dailyInterest;

    setResults({
      yearly: {
        interest: yearlyInterest.toFixed(2),
        total: yearlyTotal.toFixed(2),
      },
      semiAnnual: {
        interest: semiAnnualInterest.toFixed(2),
        total: semiAnnualTotal.toFixed(2),
      },
      quarterly: {
        interest: quarterlyInterest.toFixed(2),
        total: quarterlyTotal.toFixed(2),
      },
      monthly: {
        interest: monthlyInterest.toFixed(2),
        total: monthlyTotal.toFixed(2),
      },
      daily: {
        interest: dailyInterest.toFixed(2),
        total: dailyTotal.toFixed(2),
      },
    });

    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: [
            yearlyInterest,
            semiAnnualInterest,
            quarterlyInterest,
            monthlyInterest,
            dailyInterest,
          ],
        },
        {
          ...chartData.datasets[1],
          data: [
            yearlyTotal,
            semiAnnualTotal,
            quarterlyTotal,
            monthlyTotal,
            dailyTotal,
          ],
        },
      ],
    });
  };

  const clearResults = () => {
    setFixedDeposit("");
    setAnnualInterestRate("");
    setNumberOfYears("");
    setResults({
      yearly: { interest: "", total: "" },
      semiAnnual: { interest: "", total: "" },
      quarterly: { interest: "", total: "" },
      monthly: { interest: "", total: "" },
      daily: { interest: "", total: "" },
    });
    setChartData({
      ...chartData,
      datasets: [
        { ...chartData.datasets[0], data: [] },
        { ...chartData.datasets[1], data: [] },
      ],
    });
  };

  return (
    <Container>
      <br />
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          paddingTop="20px"
          paddingBottom="20px"
        >
          Effective Interest Rate
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fixed Deposit"
            variant="outlined"
            fullWidth
            type="number"
            name="fixedDeposit"
            value={fixedDeposit}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Annual Interest Rate (%)"
            variant="outlined"
            fullWidth
            type="number"
            name="annualInterestRate"
            value={annualInterestRate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Number of Years"
            variant="outlined"
            fullWidth
            type="number"
            name="numberOfYears"
            value={numberOfYears}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateResults}
            fullWidth
          >
            Calculate
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={clearResults}
            fullWidth
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      <br />
      <Box mt={4}>
        <br />
        <Typography variant="h6" align="center">
          Results Summary:
        </Typography>
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Interest Amount</TableCell>
                <TableCell align="right">Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Yearly</TableCell>
                <TableCell align="right">{results.yearly.interest}</TableCell>
                <TableCell align="right">{results.yearly.total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Semi-Annual</TableCell>
                <TableCell align="right">
                  {results.semiAnnual.interest}
                </TableCell>
                <TableCell align="right">{results.semiAnnual.total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quarterly</TableCell>
                <TableCell align="right">
                  {results.quarterly.interest}
                </TableCell>
                <TableCell align="right">{results.quarterly.total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly</TableCell>
                <TableCell align="right">{results.monthly.interest}</TableCell>
                <TableCell align="right">{results.monthly.total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Daily</TableCell>
                <TableCell align="right">{results.daily.interest}</TableCell>
                <TableCell align="right">{results.daily.total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <br />
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography variant="h6" align="center">
          Chart:
        </Typography>
      </Box>
      <Paper style={{ padding: 16, height: "380px" }}>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20, // Add spacing between the legend and the chart
              },
            },
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20, // Add spacing between the legend and the chart
                },
              },
              datalabels: {
                anchor: "end",
                align: "top",
                formatter: function (value) {
                  return value.toFixed(2);
                },
                font: {
                  weight: "bold",
                },
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default EffectiveInterestRate;
