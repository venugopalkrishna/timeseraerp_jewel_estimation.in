import { HeartOutlined } from "@ant-design/icons";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
} from "@mui/material";
import { DatePicker, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./Crm.module.css";

const { Option } = Select;

const sections = [
  "Today Birthdays",
  "Today Anniversaries",
  "Today Dues",
  "Total Dues",
];

const Crm = () => {
  const today = dayjs();

  const currentFinancialYearStart =
    today.month() >= 3
      ? dayjs(`${today.year()}-04-01`)
      : dayjs(`${today.year() - 1}-04-01`);

  const [fromDate, setFromDate] = useState(currentFinancialYearStart);
  const [toDate, setToDate] = useState(dayjs());
  const [expanded, setExpanded] = useState([]);
  const [open, setOpen] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [birthDayData, setBirthDayData] = useState([]);
  const [todayAnniversaryData, setTodayAnniversaryData] = useState([]);
  const [selectLedgerData, setSelectLedgerData] = useState([]);
  const [selectLedger, setSelectLedger] = useState();
  const [openingAmount, setOpeningAmount] = useState(0);
  const [ledgerData, setLedgerData] = useState([]);
  const [totalCreditAmount, setTotalCreditAmount] = useState(0);
  const [totalDebitAmount, setTotalDebitAmount] = useState(0);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDues, setTotalDues] = useState(0);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const customerAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetTotalDues`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      setCustomerData(data);
      const totalPay = data.reduce((acc, item) => {
        const jama = Number(item.BalanceAmt) || 0;
        return acc + jama;
      }, 0);
      setTotalDues(totalPay);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const birthDayAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DEALER_MASTER&where=CUSTTYPE='CUSTOMER' AND DOB='${dayjs().format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      setBirthDayData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const anniversaryAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DEALER_MASTER&where=CUSTTYPE='CUSTOMER' AND ANNVERSARY='${dayjs().format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      setTodayAnniversaryData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const selectLedgerAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/POSReports/GetOutStandingCustomers?cityName=%&custName=%&saleCode=1&mobileNo=%`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const filteredData = data.filter((item) => {
        const debit = Number(item.debit) || 0;
        const credit = Number(item.credit) || 0;
        return debit - credit !== 0;
      });
      setSelectLedgerData(filteredData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const openingLedgerAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=CUST_ACCDET&where=CUSTNAME='${selectLedger}' AND BillDATE<'${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.CREDIT) || 0;
        return acc + creditAmount;
      }, 0);

      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.DEBIT) || 0;
        return acc + debitAmount;
      }, 0);

      const totalOpenAmt = totalDebit - totalCredit;
      setOpeningAmount(totalOpenAmt || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const ledgerMainAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=CUST_ACCDET&where=CUSTNAME='${selectLedger}' AND BILLDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND BILLDATE>='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'&order=BILLDATE`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.CREDIT) || 0;
        return acc + creditAmount;
      }, 0);
      setTotalCreditAmount(totalCredit || 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.DEBIT) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalDebitAmount(totalDebit || 0);
      setLedgerData(data);
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
    customerAPI();
    birthDayAPI();
    anniversaryAPI();
    // userAPI();
  }, []);

  useEffect(() => {
    selectLedgerAPI();
    openingLedgerAPI();
    ledgerMainAPI();
  }, [selectLedger, fromDate, toDate]);

  const handleExpandAll = () => {
    setExpanded("all");
    customerAPI();
    birthDayAPI();
    anniversaryAPI();
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
          <h3 className={styles.heading}>CRM</h3>
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
            className={styles.datePicker}
            inputReadOnly
            format="DD-MMM-YYYY"
          />
        </div> */}
        <div style={{ marginBottom: "5px", marginTop: "10px" }}>
          <Accordion
            expanded={expanded === "panel1" || expanded === "all"}
            onChange={() => {
              handleChange("panel1");
              birthDayAPI();
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
              Today Birthdays
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  fontSize: "12px",
                  marginLeft: "50px",
                }}
              >
                <Badge badgeContent={birthDayData.length} color="warning">
                  <CakeOutlinedIcon
                    className={`${styles.occasionIcon} ${styles.birthdayIcon}`}
                  />
                </Badge>
              </div>
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
              {birthDayData.map((birth, index) => (
                <div
                  key={birth.id}
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "1px",
                      backgroundColor: "#000",
                      marginRight: "10px",
                    }}
                  />
                  <div
                    style={{
                      border: "1px solid #000",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      textAlign: "center",
                      backgroundColor: "#fff59d",
                      // background:
                      //   "radial-gradient(circle at center, #fff59d 40%, #ffe082 60%, #ffcc80 80%)",
                      boxShadow: "2px 2px 0px #000",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {birth.Dealername}
                    </div>
                    <div style={{ fontStyle: "italic", marginBottom: "5px" }}>
                      {birth.Street}
                    </div>
                    <div style={{ marginBottom: "5px" }}>{birth.Mobilenum}</div>
                    <div style={{ fontWeight: "bold", color: "#1a237e" }}>
                      {dayjs(birth.dob).format("DD-MMM-YYYY")}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "1px",
                      backgroundColor: "#000",
                      marginLeft: "10px",
                    }}
                  />
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
              anniversaryAPI();
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
              Today Anniversaries
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  fontSize: "12px",
                  marginLeft: "50px",
                }}
              >
                <Badge
                  badgeContent={todayAnniversaryData.length}
                  color="success"
                >
                  <HeartOutlined
                    className={`${styles.occasionIcon} ${styles.anniversaryIcon}`}
                  />
                </Badge>
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
              {todayAnniversaryData.map((anniversary, index) => (
                <div
                  key={anniversary.id}
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Left line */}
                  <div
                    style={{
                      width: "50px",
                      height: "1px",
                      backgroundColor: "#000",
                      marginRight: "10px",
                    }}
                  />

                  {/* Center box with data */}
                  <div
                    style={{
                      border: "1px solid #000",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      textAlign: "center",
                      backgroundColor: "#ef9a9a",
                      // background:
                      //   "radial-gradient(circle at center, #ef9a9a 40%, #f48fb1 60%, #ce93d8 80%)",
                      boxShadow: "2px 2px 0px #000",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      {anniversary.Dealername}
                    </div>
                    <div style={{ fontStyle: "italic", marginBottom: "5px" }}>
                      {anniversary.Street}
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      {anniversary.Mobilenum}
                    </div>
                    <div style={{ fontWeight: "bold", color: "#1a237e" }}>
                      {dayjs(anniversary.ANNVERSARY).format("DD-MMM-YYYY")}
                    </div>
                  </div>

                  {/* Right line */}
                  <div
                    style={{
                      width: "50px",
                      height: "1px",
                      backgroundColor: "#000",
                      marginLeft: "10px",
                    }}
                  />
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
              customerAPI();
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
              Total Dues
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  fontSize: "12px",
                  marginLeft: "50px",
                  // background: "#fff",
                  backgroundColor:
                    expanded === "panel3" || expanded === "all"
                      ? "white"
                      : "#52bd91",
                  color:
                    expanded === "panel3" || expanded === "all"
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
                      expanded === "panel3" || expanded === "all"
                        ? "white"
                        : "red",
                    color:
                      expanded === "panel3" || expanded === "all"
                        ? "red"
                        : "black",
                  }}
                >
                  {"₹" + totalDues?.toFixed(2)}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              ></div>
              {customerData.map((customer, index) => (
                <div
                  key={customer.id}
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
                    <span>
                      {/* Customer Name:{" "} */}
                      <span
                        style={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {customer.CustName}
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
                      {/* City:{" "} */}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {customer.CityName}
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
                      Balance:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {customer.BalanceAmt.toFixed(2)}
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
              selectLedgerAPI();
              openingLedgerAPI();
              ledgerMainAPI();
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
              Customer Ledger
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
                  className={styles.datePicker}
                  inputReadOnly
                  format="DD-MMM-YYYY"
                />
              </div>
              <div className={styles.dateFilters}>
                <div
                  style={{
                    minWidth: "50px",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Ledger:
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Ledger"
                  style={{ width: "80%", marginLeft: "5px" }}
                  value={selectLedger}
                  onChange={(value) => {
                    setSelectLedger(value);
                  }}
                >
                  {selectLedgerData.map((metal, index) => (
                    <Option key={index} value={metal.CustName}>
                      {metal.CustName}{" "}
                      <span style={{ color: "#52bd91" }}>
                        ({metal.MobileNum})
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#333d63",
                  marginBottom: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #333d63",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Opening</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {openingAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Debit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "rgb(244, 25, 25)",
                    }}
                  >
                    {totalDebitAmount.toFixed(2) || 0}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Credit</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#52bd91",
                    }}
                  >
                    {totalCreditAmount.toFixed(2) || 0}
                  </div>
                </div>

                {/* Closing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "left" }}>Balance</div>
                  <div style={{ width: "20px", textAlign: "center" }}>:</div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {(
                      openingAmount +
                      totalDebitAmount -
                      totalCreditAmount
                    ).toFixed(2) || 0}
                  </div>
                </div>
              </div>
              {ledgerData.map((ledger, index) => (
                <div
                  key={ledger.id}
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
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      VNo:{" "}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {ledger.BILLNO || 0} / <span style={{ fontSize: "12px" }}>{ledger.JEWELTYPE || "-"}</span>
                      </span>
                    </span>
                    <span>
                      {/* Date:{" "} */}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {dayjs(ledger.BILLDATE).format("DD-MM-YYYY") || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        visibility: ledger.CREDIT > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "2px 5px 2px 5px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#555" }}>
                        Credit:
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: " #2e7d32",
                        }}
                      >
                        ₹ {ledger.CREDIT.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        visibility: ledger.DEBIT > 0 ? "visible" : "hidden",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        padding: "2px 5px 2px 5px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#555" }}>
                        Debit
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: " #c62828",
                        }}
                      >
                        ₹ {ledger.DEBIT.toFixed(2)}
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

export default Crm;
