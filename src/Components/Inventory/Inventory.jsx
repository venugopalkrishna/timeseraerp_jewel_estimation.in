import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { DatePicker, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./Inventory.module.css";

const sections = [
  "Purchase Type Wise Stock",
  "Product Wise Stock",
  "HSN Wise Stock",
  "Brand Wise Stock",
  "Dealer Wise Stock",
  "Size Wise Stock",
  "Invoice Wise Stock",
];

const { Option } = Select;

const Inventory = () => {
  const [expanded, setExpanded] = useState([]);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [mainProductData, setMainProductData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [mainProduct, setMainProduct] = useState([]);
  const [selectProduct, setSelectProduct] = useState();
  const [counterData, setCounterData] = useState([]);
  const [selectCounter, setSelectCounter] = useState();
  const [purityData, setPurityData] = useState([]);
  const [selectPurity, setSelectPurity] = useState();
  const [dealerData, setDealerData] = useState([]);
  const [selectDealer, setSelectDealer] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [selectCategory, setSelectCategory] = useState();
  const [todayStockData, setTodayStockData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [dealerSummaryData, setDealerSummaryData] = useState([]);
  const [selectSummary, setSelectSummary] = useState();
  const [selectDealerProduct, setSelectDealerProduct] = useState();
  const [tryStockData, setTryStockData] = useState([]);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
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

  const metalSelectAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=MAIN_PRODUCT`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setMainProduct(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const todayStockEntryAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND TAGDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      // Group and aggregate by MNAME
      const groupedData = Object.values(
        data.reduce((acc, item) => {
          const key = item.MNAME;

          if (!acc[key]) {
            acc[key] = {
              MNAME: key,
              PIECES: 0,
              GWT: 0,
              NWT: 0,
              stonewt: 0,
              ITEM_TOTAMT: 0,
              Item_diamonds: 0,
              Diamond_Amount: 0,
              count: 0,
            };
          }

          acc[key].PIECES += Number(item.PIECES || 0);
          acc[key].GWT += Number(item.GWT || 0);
          acc[key].NWT += Number(item.NWT || 0);
          acc[key].stonewt += Number(item.stonewt || 0);
          acc[key].ITEM_TOTAMT += Number(item.ITEM_TOTAMT || 0);
          acc[key].Item_diamonds += Number(item.Item_diamonds || 0);
          acc[key].Diamond_Amount += Number(item.Diamond_Amount || 0);
          acc[key].count += 1;

          return acc;
        }, {})
      );

      setTodayStockData(groupedData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const mainProductStockAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/InventoryReports/GetStockBalances?suspennce=NO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setMainProductData(data);
      if (Array.isArray(data) && data.length > 0) {
        // setMainProductData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const productWiseStockAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/InventoryReports/GetStockSummary?mName=${selectProduct}&suspennce=NO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setProductData(data);
      if (Array.isArray(data) && data.length > 0) {
        // setProductData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const counterWiseStockAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/InventoryReports/GetCounterNetSummary?mName=${selectCounter}&suspennce=NO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setCounterData(data);
      if (Array.isArray(data) && data.length > 0) {
        // setCounterData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const purityWiseStockAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/InventoryReports/GetPrefixNetSummary?mName=${selectPurity}&suspennce=NO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setPurityData(data);
      if (Array.isArray(data) && data.length > 0) {
        // setPurityData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const dealerSummaryAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/InventoryReports/GetDealerNetSummary?mName=${selectDealer}&suspennce=NO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setDealerData(data);
      if (Array.isArray(data) && data.length > 0) {
        // setDealerData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const productCategorySummaryAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/InventoryReports/GetProductCategorySummary?mName=${selectCategory}&suspennce=NO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setCategoryData(data);
      if (Array.isArray(data) && data.length > 0) {
        // setCategoryData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const selectDealerAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DEALER_MASTER&where=CUSTTYPE='DEALER'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setDealerSummaryData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const productSummaryAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetDealerWithProdStock?DealerName=${selectSummary}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const tryStockSummaryAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TRAY='TRUE'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setTryStockData(data);
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
    selectDealerAPI();
    productSummaryAPI();
  }, [selectSummary]);

  useEffect(() => {
    todayStockEntryAPI();
  }, [fromDate, toDate]);

  useEffect(() => {
    mainProductStockAPI();
  }, []);

  useEffect(() => {
    productWiseStockAPI();
    metalSelectAPI();
  }, [selectProduct]);

  useEffect(() => {
    counterWiseStockAPI();
    metalSelectAPI();
  }, [selectCounter]);

  useEffect(() => {
    purityWiseStockAPI();
    metalSelectAPI();
  }, [selectPurity]);

  useEffect(() => {
    dealerSummaryAPI();
    metalSelectAPI();
  }, [selectDealer]);

  useEffect(() => {
    productCategorySummaryAPI();
    metalSelectAPI();
    // userAPI();
  }, [selectCategory]);

  useEffect(() => {
    tryStockSummaryAPI();
  }, []);

  // const handleExpandAll = () => {
  //   setExpanded(sections);
  // };

  // const handleCollapseAll = () => {
  //   setExpanded([]);
  // };

  // const handleChange = (section) => {
  //   setExpanded((prev) =>
  //     prev.includes(section)
  //       ? prev.filter((s) => s !== section)
  //       : [...prev, section]
  //   );
  // };

  const handleExpandAll = () => {
    setExpanded("all");
    mainProductStockAPI();
    productWiseStockAPI();
    counterWiseStockAPI();
    purityWiseStockAPI();
    dealerSummaryAPI();
    productCategorySummaryAPI();
    metalSelectAPI();
    todayStockEntryAPI();
    selectDealerAPI();
    productSummaryAPI();
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

  useEffect(() => {
    if (!selectProduct && mainProduct.length > 0) {
      setSelectProduct(mainProduct[0].MNAME);
    }
  }, [mainProduct, selectProduct]);

  useEffect(() => {
    if (!selectCounter && mainProduct.length > 0) {
      setSelectCounter(mainProduct[0].MNAME);
    }
  }, [mainProduct, selectCounter]);

  useEffect(() => {
    if (!selectPurity && mainProduct.length > 0) {
      setSelectPurity(mainProduct[0].MNAME);
    }
  }, [mainProduct, selectPurity]);

  useEffect(() => {
    if (!selectDealer && mainProduct.length > 0) {
      setSelectDealer(mainProduct[0].MNAME);
    }
  }, [mainProduct, selectDealer]);

  useEffect(() => {
    if (!selectCategory && mainProduct.length > 0) {
      setSelectCategory(mainProduct[0].MNAME);
    }
  }, [mainProduct, selectCategory]);

  useEffect(() => {
    if (!selectSummary && dealerSummaryData.length > 0) {
      setSelectSummary(dealerSummaryData[0].Dealername);
    }
  }, [dealerSummaryData, selectSummary]);

  useEffect(() => {
    if (!selectDealerProduct && mainProduct.length > 0) {
      setSelectDealerProduct(mainProduct[0].MNAME);
    }
  }, [mainProduct, selectDealerProduct]);

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
          <h3 className={styles.heading}>Inventory</h3>
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
        <div style={{ marginBottom: "5px", marginTop: "10px" }}>
          <Accordion
            expanded={expanded === "panel1" || expanded === "all"}
            onChange={() => {
              handleChange("panel1");
              selectDealerAPI();
              productSummaryAPI();
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
              Product & Dealer Summary
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Select Dealer :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Dealer"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectSummary}
                  onChange={(value) => {
                    setSelectSummary(value);
                  }}
                >
                  {dealerSummaryData.map((metal, index) => (
                    <Option key={index} value={metal.Dealername}>
                      {metal.Dealername}
                    </Option>
                  ))}
                </Select>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectDealerProduct}
                  onChange={(value) => {
                    setSelectDealerProduct(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div> */}
              {summaryData.map((summary, index) => (
                <div
                  key={summary.id}
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
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {summary.PRODUCTNAME || "-"}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {summary.PCS}
                      </span>
                    </span>
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {summary.GWT.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {summary.NWT.toFixed(3)}
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
                      Dia.Cts:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {summary.DIACTS.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹ {summary.DIAAMT.toFixed(2)}
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
                      St.Amt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹ {summary.STAMT.toFixed(2)}
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
            expanded={expanded === "panel2" || expanded === "all"}
            onChange={() => {
              handleChange("panel2");
              todayStockEntryAPI();
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
              Date Wise Stock Entry
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
              {todayStockData.map((today, index) => (
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
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {today.MNAME}
                      </span>
                    </span>
                    <span style={{ color: " #ffffff" }}>
                      Tags:{" "}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {today.count}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Pieces</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      {today.PIECES}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Gwt</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      {today.GWT.toFixed(3)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Stone.Wt</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      {today.stonewt.toFixed(3)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Nwt</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      {today.NWT.toFixed(3)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Stone Cost</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      {today.ITEM_TOTAMT.toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Dia.Cts</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      {today.Item_diamonds.toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1, textAlign: "left" }}>Dia.Atm</div>
                    <div style={{ width: "20px", textAlign: "center" }}>:</div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#162566",
                      }}
                    >
                      ₹ {today.Diamond_Amount.toFixed(2)}
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
              mainProductStockAPI();
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
              Main Product Stock
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
              {mainProductData.map((main, index) => (
                <div
                  key={main.id}
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
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {main.MNAME}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {main.PCS}
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
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {main.GWT.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {main.NWT.toFixed(3)}
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
              productWiseStockAPI();
              metalSelectAPI();
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
              Product Wise Stock
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectProduct}
                  onChange={(value) => {
                    setSelectProduct(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div>
              {productData.map((product, index) => (
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
                    <span>
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {product.PRODUCTNAME || "-"}
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
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {product.MNAME}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {product.PIECES}
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
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {product.GWT.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {product.NWT.toFixed(3)}
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
              counterWiseStockAPI();
              metalSelectAPI();
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
              Counter Wise Stock
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectCounter}
                  onChange={(value) => {
                    setSelectCounter(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div>
              {counterData.map((counter, index) => (
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
                    <span>
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {counter.CounterName || "-"}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
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
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {counter.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
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
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Dia.Cts:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {counter.DIACTS.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹ {counter.DIAAMT.toFixed(2)}
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
            expanded={expanded === "panel6" || expanded === "all"}
            onChange={() => {
              handleChange("panel6");
              purityWiseStockAPI();
              metalSelectAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel6" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel6" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Purity Wise Stock
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel6" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel6" || expanded === "all"
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
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectPurity}
                  onChange={(value) => {
                    setSelectPurity(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div>
              {purityData.map((purity, index) => (
                <div
                  key={purity.id}
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
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {purity.PREFIX}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {purity.Pieces}
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
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {purity.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {purity.Nwt.toFixed(3)}
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
                      Dia.Cts:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {purity.DIACTS.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹ {purity.DIAAMT.toFixed(2)}
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
            expanded={expanded === "panel7" || expanded === "all"}
            onChange={() => {
              handleChange("panel7");
              dealerSummaryAPI();
              metalSelectAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel7" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel7" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Dealer Stock Summary
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel7" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel7" || expanded === "all"
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
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectDealer}
                  onChange={(value) => {
                    setSelectDealer(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div>
              {dealerData.map((dealer, index) => (
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
                    <span>
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dealer.DEALERNAME || "-"}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
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
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dealer.Gwt.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
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
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Dia.Cts:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {dealer.DIACTS.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹ {dealer.DIAAMT.toFixed(2)}
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
            expanded={expanded === "panel8" || expanded === "all"}
            onChange={() => {
              handleChange("panel8");
              productCategorySummaryAPI();
              metalSelectAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel8" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel8" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Product Category Summary
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel8" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel8" || expanded === "all"
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
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Product"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectCategory}
                  onChange={(value) => {
                    setSelectCategory(value);
                  }}
                >
                  {mainProduct.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div>
              {categoryData.map((category, index) => (
                <div
                  key={category.id}
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
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {category.PRODUCTCATEGORY || "-"}
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
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {category.PRODUCTNAME || "-"}
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
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {category.PIECES}
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
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {category.GWT.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {category.NWT.toFixed(3)}
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
                      Dia.Cts:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {category.DIACTS.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹ {category.DIAAMT.toFixed(2)}
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
            expanded={expanded === "panel9" || expanded === "all"}
            onChange={() => {
              handleChange("panel9");
              tryStockSummaryAPI();
            }}
            style={{ border: "1px solid #52bd91" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor:
                  expanded === "panel9" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel9" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Try Stock Summary
            </AccordionSummary>
            <AccordionDetails
              style={{
                backgroundColor:
                  expanded === "panel9" || expanded === "all"
                    ? "#d9d9d9"
                    : "#d6d6d6",
                color:
                  expanded === "panel9" || expanded === "all"
                    ? "black"
                    : "black",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {tryStockData.map((stock, index) => (
                <div
                  key={stock.id}
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
                      color: "",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span style={{ color: " #ffffff" }}>
                      Tag No:{" "}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.TAGNO || 0}
                      </span>
                    </span>
                    <span>
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.MNAME || "-"}
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
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.PRODUCTNAME || "-"}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "12px",
                      color: "#555",
                      marginBottom: "10px",
                      background:
                        "radial-gradient(circle at center, #ffffff 40%, #f0f0f0 60%, #f0f0f0 80%)",
                      padding: "10px",
                      borderRadius: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span>
                      Pieces:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.PIECES}
                      </span>
                    </span>
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.GWT.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.NWT.toFixed(3)}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "12px",
                      color: "#555",
                      marginBottom: "10px",
                      background: "lightgray",
                        // "radial-gradient(circle at center, #ffffff 40%,rgb(237, 146, 146) 60%,rgb(216, 156, 156) 80%)",
                      padding: "10px",
                      borderRadius: "8px",
                      boxShadow: "0px 2px 4px lightgray",
                    }}
                  >
                    <span>
                      Counter:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.COUNTERNAME}
                      </span>
                    </span>
                    <span>
                      Purity:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {stock.PREFIX}
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

export default Inventory;
