import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/future-value", label: "Future Value" },
    { path: "/mortgage-calculator", label: "Mortgage" },
    { path: "/effective-interest-rate", label: "Effective Interest" },
    { path: "/npv-calculator", label: "NPV & IRR" },
    { path: "/money-withdrawal", label: "Money Withdrawals" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "lightgray",
        boxShadow: "none",
        //borderBottom: "0.5px solid gray",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "#000" }}>
          Financial Calculator, Developer: Sunil
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              disabled={location.pathname === item.path}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
