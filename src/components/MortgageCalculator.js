import React, { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addMonths } from "date-fns";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import { Payment } from "@mui/icons-material";

/* const formatNumberWithCommas = (number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}; */

const MortgageCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: "",
    totalInterest: "",
    totalPrincipal: "",
  });

  const handleCalculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(annualInterestRate) / 100 / 12;
    const n = parseInt(loanTermYears) * 12;

    if (isNaN(P) || isNaN(r) || isNaN(n)) {
      alert("Please enter valid inputs");
      return;
    }

    const monthlyPayment = (P * r) / (1 - (1 + r) ** -n);
    let balance = P;
    const paymentSchedule = [];

    let cumulativeInterest = 0;
    let cumulativePayment = 0;

    for (let i = 1; i <= n; i++) {
      const interestPaid = balance * r;
      const principalPaid = monthlyPayment - interestPaid;
      balance -= principalPaid;
      cumulativeInterest += interestPaid;
      cumulativePayment += monthlyPayment;

      paymentSchedule.push({
        Period: i,
        "Payment Date": format(addMonths(startDate, i - 1), "MMMM yyyy"),
        "Monthly Payment": monthlyPayment.toFixed(2),
        "Beginning Balance": (balance + principalPaid).toFixed(2),
        "Principal Paid": principalPaid.toFixed(2),
        "Interest Paid": interestPaid.toFixed(2),
        "Cumulative Payment": cumulativePayment.toFixed(2),
        "Cumulative Interest": cumulativeInterest.toFixed(2),
        Balance: balance.toFixed(2),
      });
    }

    setSchedule(paymentSchedule);

    setSummary({
      totalPayments: `$${(monthlyPayment * n).toFixed(2)}`,
      totalInterest: `$${cumulativeInterest.toFixed(2)}`,
      totalPrincipal: `$${P.toFixed(2)}`,
    });
  };

  const handleClear = () => {
    setPrincipal("");
    setAnnualInterestRate("");
    setLoanTermYears("");
    setStartDate(new Date());
    setSchedule([]);
    setSummary({
      totalPayments: "",
      totalInterest: "",
      totalPrincipal: "",
    });
  };

  const groupByYear = (schedule) => {
    return schedule.reduce((acc, curr) => {
      const year = curr["Payment Date"].split(" ")[1];
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(curr);
      return acc;
    }, {});
  };

  const groupedSchedule = groupByYear(schedule);

  //const totalPrincipal = parseFloat(principal);

  const totalPrincipal = isNaN(parseFloat(principal))
    ? 0
    : parseFloat(principal);

  //const totalInterest = parseFloat(summary.totalInterest.replace("$", ""));
  const totalInterest = isNaN(
    parseFloat(summary.totalInterest.replace("$", ""))
  )
    ? 0
    : parseFloat(summary.totalInterest.replace("$", ""));

  const totalPayments = totalPrincipal + totalInterest;
  const data =
    totalPayments > 0
      ? [
          ((totalPrincipal / totalPayments) * 100).toFixed(1),
          ((totalInterest / totalPayments) * 100).toFixed(1),
        ]
      : [0, 0];

  /*  const data = [
    ((totalPrincipal / totalPayments) * 100).toFixed(1),
    ((totalInterest / totalPayments) * 100).toFixed(1),
  ]; */
  return (
    <Paper
      style={{
        padding: 20,
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#f0f4f8",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom paddingTop="50px">
        Mortgage Calculator
      </Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Loan Amount"
            fullWidth
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Annual Interest Rate (%)"
            fullWidth
            type="number"
            value={annualInterestRate}
            onChange={(e) => setAnnualInterestRate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Loan Term (Years)"
            fullWidth
            type="number"
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(e.target.value)}
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
        Payment Summary:
      </Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Total Payments"
            fullWidth
            value={summary.totalPayments}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Total Interest"
            fullWidth
            value={summary.totalInterest}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Total Principal"
            fullWidth
            value={summary.totalPrincipal}
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
        Payment Schedule:
      </Typography>
      {Object.keys(groupedSchedule).map((year, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography>{year}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Monthly Payment</TableCell>
                    <TableCell>Beginning Balance</TableCell>
                    <TableCell>Principal Paid</TableCell>
                    <TableCell>Interest Paid</TableCell>
                    <TableCell>Cumulative Payment</TableCell>
                    <TableCell>Cumulative Interest</TableCell>
                    <TableCell>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedSchedule[year].map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        height: "10px",
                        backgroundColor:
                          /*     index % 2 === 0 ? "#f5f5f5" : "#ffffff", */
                          index % 2 === 0 ? "#f5f5f5" : "#ffffff",
                      }}
                    >
                      <TableCell>{item.Period}</TableCell>
                      <TableCell>{item["Payment Date"]}</TableCell>
                      <TableCell>${item["Monthly Payment"]}</TableCell>
                      <TableCell>${item["Beginning Balance"]}</TableCell>
                      <TableCell>${item["Principal Paid"]}</TableCell>
                      <TableCell>${item["Interest Paid"]}</TableCell>
                      <TableCell>${item["Cumulative Payment"]}</TableCell>
                      <TableCell>${item["Cumulative Interest"]}</TableCell>
                      <TableCell>${item.Balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

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
                labels: schedule.map((item) => item.Period),
                datasets: [
                  {
                    label: "Cumulative Payment",
                    data: schedule.map((item) =>
                      parseFloat(item["Cumulative Payment"])
                    ),
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    borderWidth: 1.5,
                    tension: 0.1,
                    pointRadius: 0,
                  },
                  {
                    label: "Cumulative Interest",
                    data: schedule.map((item) =>
                      parseFloat(item["Cumulative Interest"])
                    ),
                    fill: false,
                    borderColor: "rgb(153, 102, 255)",
                    borderWidth: 1.5,
                    tension: 0.1,
                    pointRadius: 0,
                  },
                  {
                    label: "Balance",
                    data: schedule.map((item) => parseFloat(item.Balance)),
                    fill: false,
                    borderColor: "rgb(255, 99, 132)",
                    borderWidth: 1.5,
                    tension: 0.1,
                    pointRadius: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Period",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Amount ($)",
                    },
                  },
                },
                plugins: {
                  datalabels: false, // Disable data labels
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: 16, height: "380px" }}>
            <Doughnut
              data={{
                labels: ["Principal Paid", "Interest Paid"],
                datasets: [
                  {
                    label: "Principal vs Interest",
                    data: data,

                    backgroundColor: [
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

export default MortgageCalculator;
