import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import {
  Home,
  EmojiEvents,
  PointOfSale,
  Inventory,
  People,
  ShoppingCart,
  Business,
  BarChart,
  Close,
  Person,
} from "@mui/icons-material";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import QrCodeScannerSharpIcon from "@mui/icons-material/QrCodeScannerSharp";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SellSharpIcon from "@mui/icons-material/SellSharp";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarDrawer = ({
  open,
  toggleDrawer,
  singleImage,
  userArea,
  userName,
  connectBluetoothPrinter,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const printModel = localStorage.getItem("printModel");
  const pdfModule = localStorage.getItem("pdfModule");
  const userType = localStorage.getItem("userType");

  const logOut = () => {
    navigate("/");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("images");
    localStorage.removeItem("city");
    localStorage.removeItem("singleImage");
    localStorage.removeItem("tenantName");
    localStorage.removeItem("userType");
    localStorage.removeItem("userType");
    localStorage.removeItem("ipAddress");
    localStorage.removeItem("printModel");
    localStorage.removeItem("loginName");
    localStorage.clear();
    window.location.reload();
  };

  let menuItems = [];

  const userType1 = [
    { text: "Home", icon: <Home />, path: "/home" },
    {
      text: "Estimation",
      icon: <QrCodeScannerSharpIcon />,
      path: "/bar-code-check",
    },
    {
      text: "Estimation-2",
      icon: <QrCodeScannerSharpIcon />,
      path: "/estimation",
    },
    // {
    //   text: "Purchase Estimation",
    //   icon: <QrCodeScannerSharpIcon />,
    //   path: "/purchase-estimation",
    // },
    {
      text: "Tag Check",
      icon: <SellSharpIcon />,
      path: "/tag-check",
    },
  ];

  const userType2 = [
    { text: "Home", icon: <Home />, path: "/home" },
    {
      text: "Estimation",
      icon: <QrCodeScannerSharpIcon />,
      path: "/bar-code-check",
    },
    // {
    //   text: "Purchase Estimation",
    //   icon: <QrCodeScannerSharpIcon />,
    //   path: "/purchase-estimation",
    // },
    {
      text: "Tag Check",
      icon: <SellSharpIcon />,
      path: "/tag-check",
    },
  ];

  const userType3 = [
    { text: "Home", icon: <Home />, path: "/home" },
    {
      text: "Estimation",
      icon: <QrCodeScannerSharpIcon />,
      path: "/bar-code-check",
    },
    {
      text: "Estimation-2",
      icon: <QrCodeScannerSharpIcon />,
      path: "/estimation",
    },
    // {
    //   text: "Purchase Estimation",
    //   icon: <QrCodeScannerSharpIcon />,
    //   path: "/purchase-estimation",
    // },
    {
      text: "Tag Check",
      icon: <SellSharpIcon />,
      path: "/tag-check",
    },
    {
      text: "Daily Rates",
      icon: <CurrencyExchangeOutlinedIcon />,
      path: "/daily-rates",
    },
  ];

  const userType4 = [
    { text: "Home", icon: <Home />, path: "/home" },
    {
      text: "Estimation",
      icon: <QrCodeScannerSharpIcon />,
      path: "/bar-code-check",
    },
    // {
    //   text: "Purchase Estimation",
    //   icon: <QrCodeScannerSharpIcon />,
    //   path: "/purchase-estimation",
    // },
    {
      text: "Tag Check",
      icon: <SellSharpIcon />,
      path: "/tag-check",
    },
    {
      text: "Daily Rates",
      icon: <CurrencyExchangeOutlinedIcon />,
      path: "/daily-rates",
    },
  ];

  if (Number(userType) > 1) {
    if (Number(printModel) === 5 || Number(printModel) === 6) {
      menuItems = userType3;
    } else {
      menuItems = userType4;
    }
  } else {
    if (Number(printModel) === 5 || Number(printModel) === 6) {
      menuItems = userType1;
    } else {
      menuItems = userType2;
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: "#203882",
          color: "white",
        },
      }}
    >
      <Box sx={{ backgroundColor: "#0c1439", height: "140px" }}>
        <Box display="flex" justifyContent="flex-end" mt={1} mb={1}>
          <IconButton onClick={toggleDrawer} sx={{ color: "red" }}>
            <CancelRoundedIcon style={{ fontSize: 32 }} />
          </IconButton>
        </Box>

        <Box display="flex" justifyContent="center" mt={-6} mb={1}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #52bd91",
            }}
          >
            <img
              src={singleImage}
              alt="img"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" marginBottom="5px">
          <span
            style={{ fontWeight: "bold", color: "#52bd91", fontSize: "14px" }}
          >
            {userName}
          </span>
        </Box>
        <Box display="flex" justifyContent="center">
          <span
            style={{ fontWeight: "bold", color: "white", fontSize: "11px" }}
          >
            {userArea}
          </span>
        </Box>
      </Box>

      <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => {
                  navigate(item.path);
                  toggleDrawer();
                }}
                // sx={{
                //   backgroundColor: isActive ? "#52bd91" : "transparent",
                //   "&:hover": { backgroundColor: "#52bd91" },
                // }}
              >
                <ListItemIcon sx={{ color: isActive ? "#52bd91" : "white" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: isActive ? "#52bd91" : "white",
                  }}
                />
              </ListItem>
              <Divider
                sx={{
                  backgroundColor: "white",
                  opacity: 0.9,
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              />
            </React.Fragment>
          );
        })}
      </List>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#52bd91",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "3px 25px",
          }}
          onClick={logOut}
        >
          Logout
        </Button>
        <Typography variant="body2" sx={{ color: "white" }}>
          V 1.0
        </Typography>
      </Box>
      {pdfModule === "BLUETOOTH" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
          mb={2}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#52bd91",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "6px 20px",
            }}
            onClick={connectBluetoothPrinter}
          >
            Connect BT Printer
          </Button>
        </Box>
      ) : (
        ""
      )}
    </Drawer>
  );
};

export default SidebarDrawer;
