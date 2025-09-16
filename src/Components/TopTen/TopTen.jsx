import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import diamond from "./Images/diamond-image1.png";
import gold from "./Images/glod-image1.png";
import silver from "./Images/silver-image.png";
import styles from "./TopTen.module.css";

const TopTen = () => {
  const [expanded, setExpanded] = useState(null);
  const [open, setOpen] = useState(false);
  const [topTenInvoices, setTopTenInvoices] = useState([]);
  const [topFiveProducts, setTopFiveProducts] = useState([]);
  const [topFiveDealers, setTopFiveDealers] = useState([]);
  const [topFiveSalesMan, setTopFiveSalesMan] = useState([]);
  const [topFiveCounters, setTopFiveCounters] = useState([]);
  // const [imagesData, setImagesData] = useState(localStorage.getItem("images"));
  // const [userArea, setUserArea] = useState(localStorage.getItem("city"));
  // const [userName, setUserName] = useState(localStorage.getItem("city"));
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const TopFiveInvoiceAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=BILL_MAST&where=BILLDATE='${dayjs().format(
          "MM/DD/YYYY"
        )}'&order=BILLNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const topFive = data.sort((a, b) => b.BillAmt - a.BillAmt).slice(0, 5);
      setTopTenInvoices(topFive);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TopFiveProductsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Erp/GetTopFiveProducts?fromDate=${dayjs().format(
          "MM/DD/YYYY"
        )}&toDate=${dayjs().format("MM/DD/YYYY")}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setTopFiveProducts(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TopFiveDealersAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Erp/GetTopFiveDealera?fromDate=${dayjs().format(
          "MM/DD/YYYY"
        )}&toDate=${dayjs().format("MM/DD/YYYY")}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setTopFiveDealers(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TopFiveSalesManAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Erp/GetTopFiveDealera?fromDate=${dayjs().format(
          "MM/DD/YYYY"
        )}&toDate=${dayjs().format("MM/DD/YYYY")}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setTopFiveSalesMan(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TopFiveCountersAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/ERP/GetTopFiveCounters?fromDate=${dayjs().format(
          "MM/DD/YYYY"
        )}&toDate=${dayjs().format("MM/DD/YYYY")}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setTopFiveCounters(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  // const userAPI = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=FIRM_CONFIGURE`,
  //       {
  //         headers: {
  //           tenantName: tenantName,
  //         },
  //       }
  //     );

  //     const data = response.data;

  //     if (Array.isArray(data) && data.length > 0) {
  //       const imageUrls = data[0]?.EPASS1.split(",");
  //       setImagesData(imageUrls);
  //       setUserName(data[0]?.FIRMNAME);
  //       setUserArea(data[0]?.CITY);
  //       setSingleImage(data[0]?.EPASS2);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching estimation count:", error);
  //   }
  // };

  useEffect(() => {
    TopFiveInvoiceAPI();
    TopFiveProductsAPI();
    TopFiveDealersAPI();
    TopFiveSalesManAPI();
    TopFiveCountersAPI();
    // userAPI();
  }, []);

  const handleExpandAll = () => {
    setExpanded("all");
    TopFiveInvoiceAPI();
    TopFiveProductsAPI();
    TopFiveDealersAPI();
    TopFiveSalesManAPI();
    TopFiveCountersAPI();
  };

  const handleCollapseAll = () => {
    setExpanded(null);
  };

  const handleChange = (panel) => {
    setExpanded((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (imagesData.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imagesData.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [imagesData]);

  return (
    <div>
      <Header setOpen={setOpen} />
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
      <div className={styles.carouselContainer}>
        <div
          className={styles.carouselSlider}
          style={{
            transform: `translateX(-${currentIndex * 33.33}%)`,
            width: `${imagesData.length * 100}%`,
          }}
        >
          {imagesData.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`img-${index}`}
              className={styles.carouselImage}
            />
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h3 className={styles.heading}>Top 5</h3>
          <div className={styles.buttonRow}>
            <button
              variant="outlined"
              type="default"
              className={styles.expandButton}
              onClick={handleExpandAll}
            >
              Expand All +
            </button>
            <button
              variant="outlined"
              type="default"
              className={styles.collapseButton}
              onClick={handleCollapseAll}
            >
              Collapse All -
            </button>
          </div>
        </div>

        {/* Date Filters */}
        {/* <div className={styles.dateFilters}>
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            className={styles.datePicker}
            inputReadOnly
            format="DD-MMM-YYYY"
          />
          <DatePicker
            value={toDate}
            onChange={setToDate}
            className={styles.datePicker1}
            inputReadOnly
            format="DD-MMM-YYYY"
          />
        </div> */}
        <div style={{ marginBottom: "5px", marginTop: "10px" }}>
          <Accordion
            expanded={expanded === "panel1" || expanded === "all"}
            onChange={() => {
              handleChange("panel1");
              TopFiveInvoiceAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel1" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel1" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Top 5 Invoices
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel1" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel1" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {topTenInvoices.map((invoice, index) => (
                <div
                  key={invoice.id}
                  style={{
                    background:
                      invoice.JewelType?.split(" ")[0] === "GOLD"
                        ? " #fef6e4"
                        : invoice.JewelType?.split(" ")[0] === "SILVER"
                        ? "rgba(246, 191, 248, 0.18)"
                        : invoice.JewelType?.split(" ")[0] === "DIAMOND" ||
                          invoice.JewelType?.split(" ")[0] === "DIAMONDS"
                        ? " #c4b8ca"
                        : "lightblue",
                    // background:
                    //   "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    //   padding: "16px",
                    // borderRadius: "12px",
                    // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                    color: "#1a1a1a",
                    position: "relative",
                    color: "#1a1a1a",
                    fontFamily: "sans-serif",
                  }}
                >
                  <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Invoice No:{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {invoice.BillNo}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Name:{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {invoice.CustName}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Pieces:{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {" "}
                      {invoice.TotPieces}{" "}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>
                      Nwt:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {invoice.TotNwt.toFixed(3)}g
                      </span>
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      Gwt:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {invoice.TotGwt.toFixed(3)}g
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>
                      Dia.Cts:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {invoice.Item_Diamonds.toFixed(3)}
                      </span>
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      Dia.Amt:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        ₹ {invoice.Diamond_Amount.toFixed(2)}
                      </span>
                    </span>
                  </div>

                  <hr
                    style={{ borderTop: "2px solid #aaa", margin: "10px 0" }}
                  />

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: "12px" }}>
                      Amount:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        ₹ {invoice.BillAmt.toFixed(2)}
                      </span>
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      Time:
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {dayjs(invoice.BillTime).format("HH:mm")}
                      </span>
                    </span>
                  </div>
                  {invoice.JewelType?.split(" ")[0] === "GOLD" ||
                  invoice.JewelType?.split(" ")[0] === "SILVER" ||
                  invoice.JewelType?.split(" ")[0] === "DIAMOND" ||
                  invoice.JewelType?.split(" ")[0] === "DIAMONDS" ? (
                    <img
                      src={
                        invoice.JewelType?.split(" ")[0] === "GOLD"
                          ? gold
                          : invoice.JewelType?.split(" ")[0] === "SILVER"
                          ? silver
                          : diamond
                      }
                      alt="Gold"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "70px",
                        height: "auto",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel2" || expanded === "all"}
            onChange={() => {
              handleChange("panel2");
              TopFiveProductsAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel2" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel2" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Top 5 Products
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel2" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel2" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {topFiveProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {product.ProductName || "-"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {product.JewelType}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Pieces:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {product.Pieces}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {product.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {product.Nwt.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        ₹ {product.Totamt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel3" || expanded === "all"}
            onChange={() => {
              handleChange("panel3");
              TopFiveDealersAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel3" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel3" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Top 5 Dealers
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel3" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel3" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {topFiveDealers.map((dealer, index) => (
                <div
                  key={dealer.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {dealer.DEALERNAME || "-"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {dealer.JewelType}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Pieces:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {dealer.Pieces}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {dealer.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {dealer.Nwt.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        ₹ {dealer.Totamt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel4" || expanded === "all"}
            onChange={() => {
              handleChange("panel4");
              TopFiveSalesManAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel4" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel4" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Top 5 Sales Man
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel4" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel4" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {topFiveSalesMan.map((sales, index) => (
                <div
                  key={sales.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {sales.SMCODE || "-"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {sales.JewelType}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Pieces:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {sales.Pieces}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {sales.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {sales.Nwt.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        ₹ {sales.Totamt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel5" || expanded === "all"}
            onChange={() => {
              handleChange("panel5");
              TopFiveCountersAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel5" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel5" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Top 5 Counters
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel5" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel5" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {topFiveCounters.map((counter, index) => (
                <div
                  key={counter.id}
                  style={{
                    background:
                      "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                    marginBottom: "8px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #52bd91",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {counter.COUNTERNAME || "-"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {counter.JewelType}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Pieces:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {counter.Pieces}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {counter.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#595a60",
                          fontWeight: "bold",
                        }}
                      >
                        {counter.Nwt.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#555",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        ₹ {counter.Totamt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default TopTen;
