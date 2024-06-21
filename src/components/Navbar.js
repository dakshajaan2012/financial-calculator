import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    color: "black",
    "&:disabled": {
      color: "grey",
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <AppBar position="fixed" style={{ backgroundColor: "lightgrey" }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, color: "black" }}>
          Financial Calculator
        </Typography>
        <Button
          className={classes.button}
          component={Link}
          to="/future-value"
          disabled={location.pathname === "/future-value"}
        >
          Future Value
        </Button>
        <Button
          className={classes.button}
          component={Link}
          to="/mortgage-calculator"
          disabled={location.pathname === "/mortgage-calculator"}
        >
          Mortgage
        </Button>
        <Button
          className={classes.button}
          component={Link}
          to="/effective-interest-rate"
          disabled={location.pathname === "/effective-interest-rate"}
        >
          Effective Interest
        </Button>
        <Button
          className={classes.button}
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
