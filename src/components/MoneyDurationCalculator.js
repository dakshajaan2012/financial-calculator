import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format } from "date-fns";
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  Grid,
  Collapse,
  TableContainer,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const MoneyDurationCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  //const [schedule, setSchedule] = useState({});
  const [yearlySummary, setYearlySummary] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [expandedYears, setExpandedYears] = useState({});
  const [result, setResult] = useState("");

  const calculateDuration = () => {
    const P = parseFloat(principal);
    const W = parseFloat(withdrawal);
    const R = parseFloat(interestRate);

    if (isNaN(P) || isNaN(W) || isNaN(R) || P <= 0 || W <= 0 || R < 0) {
      alert("Please enter valid numbers.");
      //setSchedule({});
      setYearlySummary([]);
      return;
    }

    let remainingBalance = P;
    let months = 0;
    const detailedSchedule = [];
    const summary = [];
    let currentDate = startDate;

    // Loop to calculate the schedule
    while (remainingBalance > 0) {
      months++;
      const interest = months % 12 === 0 ? (remainingBalance * R) / 100 : 0;
      // Add monthly entry to detailed schedule
      detailedSchedule.push({
        monthYear: format(currentDate, "MMMM yyyy"),
        startingBalance: remainingBalance.toFixed(2),
        withdrawal:
          remainingBalance >= W ? W.toFixed(2) : remainingBalance.toFixed(2),
        interestAdded: interest.toFixed(2),
      });

      // Deduct withdrawal and add interest annually
      remainingBalance -= W;
      currentDate = addMonths(currentDate, 1);

      if (months % 12 === 0 && remainingBalance > 0) {
        remainingBalance += interest;
      }

      // Ensure remaining balance doesn't go negative
      if (remainingBalance <= 0) {
        detailedSchedule[detailedSchedule.length - 1].withdrawal = (
          W + remainingBalance
        ).toFixed(2);
        remainingBalance = 0;
      }
    }

    // Group detailed schedule by year
    const groupedSchedule = detailedSchedule.reduce((acc, curr) => {
      const year = format(new Date(curr.monthYear), "yyyy");
      if (!acc[year]) acc[year] = [];
      acc[year].push(curr);
      return acc;
    }, {});

    // Generate yearly summary
    Object.keys(groupedSchedule).forEach((year) => {
      const yearData = groupedSchedule[year];
      const totalWithdrawals = yearData.reduce(
        (sum, entry) => sum + parseFloat(entry.withdrawal),
        0
      );
      const totalInterest = yearData.reduce(
        (sum, entry) => sum + parseFloat(entry.interestAdded),
        0
      );

      summary.push({
        year,
        startingBalance: yearData[0].startingBalance,
        totalWithdrawals: totalWithdrawals.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        monthlyDetails: yearData,
      });
    });

    // Update state
    //setSchedule(groupedSchedule);
    setYearlySummary(summary);
    setResult(
      `Your money will last for ${Math.floor(months / 12)} year(s) and ${
        months % 12
      } month(s).`
    );
  };

  const handleClear = () => {
    setPrincipal("");
    setWithdrawal("");
    setInterestRate("");
    //setSchedule({});
    setYearlySummary([]);
    setResult("");
  };

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // Total calculations
  const totalInterestEarned = yearlySummary.reduce(
    (sum, item) => sum + parseFloat(item.totalInterest),
    0
  );
  const finalInterest = totalInterestEarned.toFixed(0);
  const formattedFinalInterest = `$${finalInterest}`;
  const startingBalance = isNaN(parseFloat(principal))
    ? 0
    : parseFloat(principal); // Use the entered principal
  const formattedStartingBalance = `$${startingBalance}`;
  const finalSum = (startingBalance + totalInterestEarned).toFixed(0); // Total available funds
  const formattedFinalSum = `$${finalSum}`;
  // Calculate present value

  const data =
    finalSum > 0
      ? [
          ((startingBalance / finalSum) * 100).toFixed(1), // Balance percentage
          ((totalInterestEarned / finalSum) * 100).toFixed(1), // Interest percentage
        ]
      : [0, 0]; // Default to [0, 0] if finalSum is 0 to prevent NaN issues

  return (
    <Paper
      style={{
        padding: 20,
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#f0f4f8",
      }}
    >
      <br />
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          paddingTop="0px"
          paddingBottom="20px"
        >
          Monthly Withdrawal Schedule
        </Typography>
      </Box>
      {/* Form Inputs */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Available Balance"
            variant="outlined"
            type="number"
            fullWidth
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Monthly Withdrawals"
            variant="outlined"
            type="number"
            fullWidth
            value={withdrawal}
            onChange={(e) => setWithdrawal(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Annual Interest Rate (%)"
            variant="outlined"
            type="number"
            fullWidth
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Start Date:</Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd MMMM yyyy"
            customInput={<TextField fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateDuration}
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

      {/* Display Result */}
      {result && (
        <Typography
          variant="h6"
          align="center"
          mt={2}
          color={"red"}
          fontWeight={"bold"}
        >
          {result}
        </Typography>
      )}
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
        <Grid item xs={12} sm={4}>
          <TextField
            label="Starting Balance"
            fullWidth
            value={formattedStartingBalance}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Total Interest"
            fullWidth
            value={formattedFinalInterest}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Total Withdrawals"
            fullWidth
            value={formattedFinalSum}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        {/*        <Grid item xs={12} sm={6}>
          <TextField
            label="Present Value"
            fullWidth
            value={presentValue}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid> */}
      </Grid>
      <br />

      {/* Yearly Summary */}
      <br />
      {yearlySummary.length > 0 && (
        <Paper>
          <Typography variant="h6" align="center">
            Yearly Schedule:
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Starting Balance</TableCell>
                  <TableCell>Yearly Withdrawals</TableCell>
                  <TableCell>Yearly Interest Added</TableCell>
                  <TableCell>Monthly Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearlySummary.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          /*     index % 2 === 0 ? "#f5f5f5" : "#ffffff", */
                          index % 2 === 0 ? "#F4DF4EFF" : "#989398FF",
                      }}
                    >
                      <TableCell sx={{ height: 0.1 }}>{item.year}</TableCell>
                      <TableCell sx={{ height: 0.1 }}>
                        ${item.startingBalance}
                      </TableCell>
                      <TableCell>${item.totalWithdrawals}</TableCell>
                      <TableCell>${item.totalInterest}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleYear(item.year)}
                        >
                          {expandedYears[item.year] ? (
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
                          in={expandedYears[item.year]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Month</TableCell>
                                <TableCell>Starting Balance</TableCell>
                                <TableCell>Withdrawal</TableCell>
                                <TableCell>Interest Added</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.monthlyDetails.map((detail, index) => (
                                <TableRow
                                  key={detail.monthYear}
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0 ? "#f5f5f5" : "#ffffff", // Alternate colors
                                  }}
                                >
                                  <TableCell>{detail.monthYear}</TableCell>
                                  <TableCell>
                                    ${detail.startingBalance}
                                  </TableCell>
                                  <TableCell>${detail.withdrawal}</TableCell>
                                  <TableCell>${detail.interestAdded}</TableCell>
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
        </Paper>
      )}
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
          <Paper style={{ padding: 16, height: "300px", paddingBottom: 10 }}>
            <Line
              data={{
                labels: yearlySummary.map((item) => item.year),
                datasets: [
                  {
                    label: "Starting Balance",
                    data: yearlySummary.map((item) =>
                      parseFloat(item["startingBalance"])
                    ),
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    borderWidth: 1.5,
                    tension: 0.1,
                    pointRadius: 0,
                  },

                  {
                    label: "Yearly withdrawals",
                    data: yearlySummary.map((item) =>
                      parseFloat(item["totalWithdrawals"])
                    ),
                    fill: false,
                    borderColor: "rgb(255, 206, 86)",
                    borderWidth: 1.5,
                    tension: 0.1,
                    pointRadius: 0,
                  },
                  {
                    label: "Yearly Interest added",
                    data: yearlySummary.map((item) =>
                      parseFloat(item.totalInterest)
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
          <Paper style={{ padding: 16, height: "300px", paddingBottom: 10 }}>
            <Doughnut
              data={{
                labels: ["Starting Balance", "Total Interest"],
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
  );
};

export default MoneyDurationCalculator;
