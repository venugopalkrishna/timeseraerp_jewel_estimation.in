import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./PurchasePlans.module.css";

const sections = [
  "Commodity Wise Purchase",
  "Product Wise Purchase",
  "Dealer Wise Purchase",
  "HSN Wise Purchase",
  "Brand Wise Purchase",
  "Tax Wise Purchase",
];

const PurchasePlans = () => {
  const [expanded, setExpanded] = useState([]);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [todayJoiningsData, setTodayJoiningsData] = useState([]);
  const [dailyCollectionData, setDailyCollectionData] = useState([]);
  const [schemeSettlementData, setSchemeSettlementData] = useState([]);
  const [schemeDiscontinueData, setSchemeDiscontinueData] = useState([]);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalRecAmt, setTotalRecAmt] = useState(0);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const todayJoiningAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=SCHEME_MEMBER&where=SCHEMEJOINDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND SCHEMEJOINDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setTodayJoiningsData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const dailyCollectionsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPT_MAST&where=RECDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND RECDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setDailyCollectionData(data);
      const totalAmount = data.reduce((acc, item) => {
        const recAmt = Number(item.RecAmount) || 0;
        return acc + recAmt;
      }, 0);
      setTotalRecAmt(totalAmount);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const schemeSettlementsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=SCHEME_END&where=RECDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND RECDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setSchemeSettlementData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const schemeDiscontinueAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=SCHEME_MIDDLEDROP&where=SMDRECDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND SMDRECDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setSchemeDiscontinueData(data);
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
    todayJoiningAPI();
    dailyCollectionsAPI();
    schemeSettlementsAPI();
    schemeDiscontinueAPI();
    // userAPI();
  }, [fromDate, toDate]);

  const handleExpandAll = () => {
    setExpanded("all");
    todayJoiningAPI();
    dailyCollectionsAPI();
    schemeSettlementsAPI();
    schemeDiscontinueAPI();
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
          <h3 className={styles.heading}>Saving Scheme</h3>
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
        <div className={styles.dateFilters}>
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
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Accordion
            expanded={expanded === "panel1" || expanded === "all"}
            onChange={() => {
              handleChange("panel1");
              todayJoiningAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "15px",
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
              Today Joinings
              {/* {todayJoiningsData.length > 0 && ( */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "60px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  border:
                    expanded === "panel1" || expanded === "all"
                      ? "3px solid #162566"
                      : "3px solid #52bd91",
                  color:
                    expanded === "panel1" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "4px 8px",
                  borderRadius: "50%",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color:
                      expanded === "panel1" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel1" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {todayJoiningsData.length || 0}
                </span>
              </div>
              {/* )} */}
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
              {todayJoiningsData.map((today, index) => (
                <div
                  key={today.id}
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
                      fontSize: "14px",
                      color: "#555",
                      background: " #162566",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Card No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {today.CardNo || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        Date:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {dayjs(today.SchemeJoinDate).format("DD-MMM-YYYY") ||
                            "-"}
                        </span>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        {/* Months:{" "} */}
                        <span
                          style={{
                            color: "#52bd91",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          {today.SchemeMember || "-"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <hr
                    style={{
                      borderTop: "1px solidrgb(37, 40, 39)",
                      marginBottom: "5px",
                      marginTop: "5px",
                      width: "100%",
                    }}
                  />
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
                      Area:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {today.area || "-"}
                      </span>
                    </span>
                    <span>
                      Phone:{" "}
                      <span
                        style={{
                          color: "#52bd91",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {today.Mobile1 || "-"}
                      </span>
                    </span>
                  </div>
                  <hr
                    style={{
                      borderTop: "1px solidrgb(37, 40, 39)",
                      marginBottom: "5px",
                      marginTop: "5px",
                      width: "100%",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      background: " #98d1b9",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Group:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {today.SchemeGroup || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Name:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          {today.SchemeName || "-"}
                        </span>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Months:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {today.SchemeDuration || 0}
                        </span>
                      </span>
                      <span style={{ color: "black" }}>
                        Amount:{" "}
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          ₹ {today.SchemeAmount.toFixed(2)}
                        </span>
                      </span>
                    </div>
                  </div>
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
              dailyCollectionsAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "15px",
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
              Daily Collections
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  backgroundColor:
                    expanded === "panel2" || expanded === "all"
                      ? "white"
                      : "#52bd91",
                  color:
                    expanded === "panel2" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "8px 10px 5px 10px",
                  borderRadius: "8px",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color:
                      expanded === "panel2" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel2" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {"₹" + totalRecAmt?.toFixed(2)}
                </span>
              </div>
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
              {dailyCollectionData.map((daily, index) => (
                <div
                  key={daily.id}
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
                      fontSize: "14px",
                      color: "#555",
                      background: " #162566",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Rec No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {daily.RecNo || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        Date:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {dayjs(daily.RecDate).format("DD-MMM-YYYY") || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Card No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {daily.CardNo || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        {/* Date:{" "} */}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {daily.SchemeMember || "-"}
                        </span>
                      </span>
                    </div>
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
                      Phone:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {daily.Phno || "-"}
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
                      Paid Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {daily.RecAmount.toFixed(2) || 0}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      background: " #98d1b9",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Group:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {daily.SchemeGroup || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Name:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          {daily.SchemeName || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Months:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {daily.SchemeDuration || 0}
                        </span>
                      </span>
                    </div>
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
              schemeSettlementsAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "15px",
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
              Scheme Settlements
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  border:
                    expanded === "panel3" || expanded === "all"
                      ? "3px solid #162566"
                      : "3px solid #52bd91",
                  color:
                    expanded === "panel3" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "4px 8px",
                  borderRadius: "50%",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color:
                      expanded === "panel3" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel3" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {schemeSettlementData.length || 0}
                </span>
              </div>
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
              {schemeSettlementData.map((scheme, index) => (
                <div
                  key={scheme.id}
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
                      fontSize: "14px",
                      color: "#555",
                      background: " #162566",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Rec No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {scheme.RecNo || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        Date:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {dayjs(scheme.RecDate).format("DD-MMM-YYYY") || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Card No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {scheme.CardNo || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        {/* Date:{" "} */}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {scheme.SchemeMember || "-"}
                        </span>
                      </span>
                    </div>
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
                      Phone:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {scheme.Phno || "-"}
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
                      Settle.Amt:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {scheme.TotSValue.toFixed(2) || 0}
                      </span>
                    </span>
                    <span>
                      Gold.Wt:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {scheme.GoldWt.toFixed(3) || 0}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      background: " #98d1b9",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Group:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {scheme.SchemeGroup || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Name:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          {scheme.SchemeName || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Months:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {scheme.SchemeDuration || 0}
                        </span>
                      </span>
                    </div>
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
              schemeDiscontinueAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "15px",
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
              Scheme Discontinue
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "30px",
                  fontSize: "12px",
                  // marginLeft: "50px",
                  // background: "#fff",
                  border:
                    expanded === "panel4" || expanded === "all"
                      ? "3px solid #162566"
                      : "3px solid #52bd91",
                  color:
                    expanded === "panel4" || expanded === "all"
                      ? "#52bd91"
                      : "black",
                  padding: "4px 8px",
                  borderRadius: "50%",
                }}
              >
                {/* Pending Dues:{" "} */}
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color:
                      expanded === "panel4" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel4" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {schemeDiscontinueData.length || 0}
                </span>
              </div>
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
              {schemeDiscontinueData.map((dis, index) => (
                <div
                  key={dis.id}
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
                      fontSize: "14px",
                      color: "#555",
                      background: " #162566",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Rec No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {dis.SMDRecno || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        Date:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {dayjs(dis.SMDRecDate).format("DD-MMM-YYYY") || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        Card No:{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#52bd91",
                            fontWeight: "bold",
                          }}
                        >
                          {dis.CardNo || 0}
                        </span>
                      </span>
                      <span style={{ color: "#FFFFFF" }}>
                        {/* Date:{" "} */}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#52bd91",
                          }}
                        >
                          {dis.SchemeMember || "-"}
                        </span>
                      </span>
                    </div>
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
                      Phone:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dis.Phno || "-"}
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
                      Settle.Amt:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {dis.RecAmount.toFixed(2) || 0}
                      </span>
                    </span>
                    <span>
                      Gold.Wt:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {dis.GoldWt.toFixed(3) || 0}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      background: " #98d1b9",
                      borderRadius: "8px",
                      padding: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Group:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {dis.SchemeGroup || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Scheme Name:{" "}
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          {dis.SchemeName || "-"}
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        Months:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          {dis.SchemeDuration || 0}
                        </span>
                      </span>
                    </div>
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

export default PurchasePlans;
