import React, { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Import the necessary Chart.js components
import ChartDataLabels from "chartjs-plugin-datalabels";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { addMonths, format } from "date-fns";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from "@mui/material";
//import { ExpandLess, ExpandMore } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const FutureValue = () => {
  const [startAmount, setStartAmount] = useState("");
  const [yearlyDeposit, setYearlyDeposit] = useState("");
  const [annualInterest, setAnnualInterest] = useState("");
  const [noOfYears, setNoOfYears] = useState("");
  const [depositTiming, setDepositTiming] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [results, setResults] = useState({
    totalReturns: "",
    totalInterest: "",
    totalDeposit: "",
    presentValue: "",
  });

  const [yearlySchedule, setYearlySchedule] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});

  const handleCalculate = () => {
    let prin_x1 = parseFloat(startAmount);
    if (isNaN(prin_x1)) {
      alert('Please enter a valid "Starting Amount"');
      return;
    }

    let pmt_x1 = parseFloat(yearlyDeposit);
    if (isNaN(pmt_x1)) {
      alert('Please enter a valid "Yearly Deposit"');
      return;
    }

    let rate_x = parseFloat(annualInterest);
    if (isNaN(rate_x)) {
      alert('Please enter a valid "Annual Interest"');
      return;
    }

    let yrs_x = parseFloat(noOfYears);
    if (isNaN(yrs_x)) {
      alert('Please enter a valid "No of Years"');
      return;
    }

    let b_e_x = parseInt(depositTiming);
    if (isNaN(b_e_x) || (b_e_x !== 0 && b_e_x !== 1)) {
      alert("Please enter 1 for Beginning or 0 for End");
      return;
    }

    let ir = rate_x / 100;
    let fv = 0;
    let totalInterest = 0;
    let totalDeposit = 0;
    let periodicDeposit = 0;

    const schedule = [];
    let balance = prin_x1;

    for (let i = 1; i <= yrs_x; i++) {
      /*   let startBalance = balance; */
      let startBalance = b_e_x === 1 ? balance + pmt_x1 : balance;

      // Calculate yearly deposit based on timing
      //let yearlyDepositWithInterest = b_e_x === 1 ? pmt_x1 * (1 + ir) : pmt_x1;
      let yearlyDepositWithInterest = b_e_x === 1 ? 0 : pmt_x1; // yearly deposit is added earlier to the starting balance, so its zero
      //let endDeposit = startBalance + yearlyDepositWithInterest;

      // Calculate interest
      let interest = startBalance * ir;
      //let interest = b_e_x === 1 ? startBalance * ir : startBalance * ir;
      totalInterest += interest;

      // Accumulate total deposit

      let periodicTotal = (periodicDeposit += pmt_x1);
      totalDeposit = prin_x1 + periodicTotal;

      // Yearly balance includes starting amount, yearly deposits, and interest
      balance = startBalance + yearlyDepositWithInterest + interest;

      const monthlySchedule = [];
      let monthlyBalance = startBalance;

      for (let j = 0; j < 12; j++) {
        let monthlyInterest =
          (startBalance + (b_e_x === 1 && j === 0 ? pmt_x1 : 0)) * (ir / 12);
        monthlyBalance += monthlyInterest;
        monthlySchedule.push({
          Month: format(addMonths(startDate, (i - 1) * 12 + j), "MMMM yyyy"),
          "Monthly Interest": monthlyInterest.toFixed(2),
          "Monthly Balance": monthlyBalance.toFixed(2),
        });
      }

      schedule.push({
        Year: i,
        "Starting Deposit": startBalance.toFixed(2),
        "Yearly Deposit": pmt_x1.toFixed(2),
        //"Ending Deposit": endDeposit.toFixed(2),
        Interest: interest.toFixed(2),
        "Yearly Balance": balance.toFixed(2),
        MonthlySchedule: monthlySchedule,
      });
    }

    // Calculate total returns (including interest)
    fv = balance; // Final balance after all years
    let totalReturns = fv.toFixed(0);

    // Calculate present value
    let presentValue = fv * (1 / (1 + ir) ** yrs_x);

    setResults({
      totalReturns: `$${totalReturns}`,
      totalInterest: `$${totalInterest.toFixed(0)}`,
      totalDeposit: `$${totalDeposit.toFixed(0)}`,
      presentValue: `$${presentValue.toFixed(0)}`,
    });

    setYearlySchedule(schedule);
  };

  const handleClear = () => {
    setStartAmount("");
    setYearlyDeposit("");
    setAnnualInterest("");
    setNoOfYears("");
    setDepositTiming("");
    setStartDate(new Date());
    setResults({
      totalReturns: "",
      totalInterest: "",
      totalDeposit: "",
      presentValue: "",
    });

    setYearlySchedule([]);
  };

  const toggleYear = (year) => {
    setExpandedYears((prevExpandedYears) => ({
      ...prevExpandedYears,
      [year]: !prevExpandedYears[year],
    }));
  };
  const totalStartingAmount = isNaN(parseFloat(startAmount))
    ? 0
    : parseFloat(startAmount);

  const totalYearlyDeposits = isNaN(yearlyDeposit * noOfYears)
    ? 0
    : yearlyDeposit * noOfYears; // Use the computed value, not the condition

  const totalInterest = isNaN(
    parseFloat(results.totalInterest.replace("$", ""))
  )
    ? 0
    : parseFloat(results.totalInterest.replace("$", ""));

  const totalAmount = isNaN(
    totalStartingAmount + totalYearlyDeposits + totalInterest
  )
    ? 0
    : totalStartingAmount + totalYearlyDeposits + totalInterest;

  const data =
    totalAmount > 0
      ? [
          ((totalStartingAmount / totalAmount) * 100).toFixed(1),
          ((totalYearlyDeposits / totalAmount) * 100).toFixed(1),
          ((totalInterest / totalAmount) * 100).toFixed(1),
        ]
      : [0, 0, 0]; // Avoid dividing by 0 or showing NaN percentages

  /*   const totalStartingAmount = isNaN(parseFloat(startAmount))
    ? 0
    : parseFloat(startAmount);
  const totalYearlyDeposits = isNaN(yearlyDeposit * noOfYears)
    ? 0
    : isNaN(yearlyDeposit * noOfYears);
  const totalInterest = isNaN(
    parseFloat(results.totalInterest.replace("$", ""))
  )
    ? 0
    : parseFloat(results.totalInterest.replace("$", ""));
  const totalAmount = isNaN(
    totalStartingAmount + totalYearlyDeposits + totalInterest
  )
    ? 0
    : totalStartingAmount + totalYearlyDeposits + totalInterest;

  const data = [
    ((totalStartingAmount / totalAmount) * 100).toFixed(1),
    ((totalYearlyDeposits / totalAmount) * 100).toFixed(1),
    ((totalInterest / totalAmount) * 100).toFixed(1),
  ]; */

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Paper
        style={{
          padding: 20,
          maxWidth: "100%",
          margin: "0 auto",
          backgroundColor: "#f0f4f8",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom paddingTop="50px">
          Future Value
        </Typography>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Starting Amount"
              fullWidth
              type="number"
              value={startAmount}
              onChange={(e) => setStartAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Yearly Deposit"
              fullWidth
              type="number"
              value={yearlyDeposit}
              onChange={(e) => setYearlyDeposit(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Annual Interest Rate (%)"
              fullWidth
              type="number"
              value={annualInterest}
              onChange={(e) => setAnnualInterest(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Years"
              fullWidth
              type="number"
              value={noOfYears}
              onChange={(e) => setNoOfYears(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Deposit Timing (1 for Beginning, 0 for End)"
              fullWidth
              type="number"
              value={depositTiming}
              onChange={(e) => setDepositTiming(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Start Date:</Typography>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd MMMM yyyy"
              showDayMonthYearPicker
              customInput={<TextField fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              fullWidth
            >
              Calculate
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClear}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <br />

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          style={{ marginTop: 20 }}
        >
          Results Summary:
        </Typography>
        <br />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Returns"
              fullWidth
              value={results.totalReturns}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Interest"
              fullWidth
              value={results.totalInterest}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Deposit"
              fullWidth
              value={results.totalDeposit}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Present Value"
              fullWidth
              value={results.presentValue}
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
          style={{ marginTop: 20 }}
        >
          Yearly Schedule:
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Starting Deposit</TableCell>
                <TableCell>Yearly Deposit</TableCell>
                {/*  <TableCell>Ending Deposit</TableCell> */}
                <TableCell>Interest</TableCell>
                <TableCell>Yearly Balance</TableCell>
                <TableCell>Monthly Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearlySchedule.map((item, index) => (
                <React.Fragment key={index}>
                  {/*         <TableRow> */}
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        /*     index % 2 === 0 ? "#f5f5f5" : "#ffffff", */
                        index % 2 === 0 ? "#F4DF4EFF" : "#989398FF",
                    }}
                  >
                    <TableCell sx={{ height: 0.1 }}>{item.Year}</TableCell>
                    <TableCell sx={{ height: 0.1 }}>
                      ${item["Starting Deposit"]}
                    </TableCell>
                    <TableCell>${item["Yearly Deposit"]}</TableCell>
                    {/*        <TableCell>{yearlyData["Ending Deposit"]}</TableCell> */}
                    <TableCell>${item.Interest}</TableCell>
                    <TableCell>${item["Yearly Balance"]}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleYear(item.Year)}
                      >
                        {expandedYears[item.Year] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedYears[item.Year]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Month</TableCell>
                              <TableCell>Monthly Interest</TableCell>
                              <TableCell>Monthly Balance</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.MonthlySchedule.map((month, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  backgroundColor:
                                    index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                                }}
                              >
                                <TableCell>{month.Month}</TableCell>
                                <TableCell>
                                  ${month["Monthly Interest"]}
                                </TableCell>
                                <TableCell>
                                  ${month["Monthly Balance"]}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          style={{ marginTop: 20 }}
        >
          Charts:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16, height: "380px" }}>
              <Line
                data={{
                  labels: yearlySchedule.map((item) => item.Year),
                  datasets: [
                    {
                      label: "Starting Deposit",
                      data: yearlySchedule.map((item) =>
                        parseFloat(item["Starting Deposit"])
                      ),
                      fill: false,
                      borderColor: "rgb(75, 192, 192)",
                      borderWidth: 1.5,
                      tension: 0.1,
                      pointRadius: 0,
                    },
                    /*          {
                    label: "Ending Deposit",
                    data: yearlySchedule.map((item) =>
                      parseFloat(item["Ending Deposit"])
                    ),
                    fill: false,
                    borderColor: "rgb(153, 102, 255)",
                    tension: 0.1,
                    pointRadius: 0,
                  }, */
                    {
                      label: "Interest",
                      data: yearlySchedule.map((item) =>
                        parseFloat(item.Interest)
                      ),
                      fill: false,
                      borderColor: "rgb(255, 206, 86)",
                      borderWidth: 1.5,
                      tension: 0.1,
                      pointRadius: 0,
                    },
                    {
                      label: "Yearly Balance",
                      data: yearlySchedule.map((item) =>
                        parseFloat(item["Yearly Balance"])
                      ),
                      fill: false,
                      borderColor: "rgb(255, 99, 132)",
                      borderWidth: 1.5,
                      tension: 0.1,
                      pointRadius: 0,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        paddingRight: 10,
                      },
                    },
                    datalabels: false,
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Year",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Amount ($)",
                      },
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 16, height: "380px" }}>
              <Doughnut
                data={{
                  labels: [
                    "Starting Amount",
                    "Yearly Deposit",
                    "Total Interest",
                  ],
                  datasets: [
                    {
                      label: "Financial Overview",
                      data: data,

                      backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                      ],
                      cutout: "50%", // Makes it a donut chart
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        padding: 20, // Add spacing between the legend and the chart
                      },
                    },
                    datalabels: {
                      formatter: (value, context) => {
                        return value + "%";
                      },
                      color: "#000",
                      font: {
                        weight: "bold",
                      },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default FutureValue;
