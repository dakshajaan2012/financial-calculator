import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
//import { makeStyles } from "@mui/styles";

/* const useStyles = makeStyles((theme) => ({
  button: {
    color: "red", // Initial color for the button text
    "&.Mui-disabled": {
      color: "lightgrey", // Color for disabled state with high specificity
    },
  },
})); */

const Navbar = () => {
  //const classes = useStyles();
  const location = useLocation();

  return (
    <AppBar position="fixed" style={{ backgroundColor: "lightgrey" }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, color: "#1976D2" }}>
          Financial Calculator
        </Typography>
        <Button
          component={Link}
          to="/future-value"
          disabled={location.pathname === "/future-value"}
        >
          Future Value
        </Button>
        <Button
          component={Link}
          to="/mortgage-calculator"
          disabled={location.pathname === "/mortgage-calculator"}
        >
          Mortgage
        </Button>
        <Button
          component={Link}
          to="/effective-interest-rate"
          disabled={location.pathname === "/effective-interest-rate"}
        >
          Effective Interest
        </Button>
        <Button
          component={Link}
          to="/npv-calculator"
          disabled={location.pathname === "/npv-calculator"}
        >
          NPV & IRR
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
