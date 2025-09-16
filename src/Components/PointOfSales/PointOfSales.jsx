import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { DatePicker, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import diamond from "./Images/diamond-image1.png";
import gold from "./Images/glod-image1.png";
import silver from "./Images/silver-image.png";
import styles from "./PointOfSales.module.css";

const sections = [
  "Sales Register",
  "Product Wise Sales",
  "Brand Wise Sales",
  "Dealer Wise Sales",
  "Sales Man Wise Sales",
  "Date Wise Sales",
  "Purchase Type Wise Sales",
  "Tax Wise Sales",
  "HSN Wise Sales",
];

const { Option } = Select;

const PointOfSales = () => {
  const [expanded, setExpanded] = useState([]);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [registerData, setRegisterData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [product, setProduct] = useState([]);
  const [counterData, setCounterData] = useState([]);
  const [metalData, setMetalData] = useState([]);
  const [purityData, setPurityData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [jewelType, setJewelType] = useState([]);
  const [selectJewelType, setSelectJewelType] = useState();
  const [dealerData, setDealerData] = useState([]);
  const [jewelTypeData, setJewelTypeData] = useState([]);
  const [tagTotalPieces, setTagTotalPieces] = useState(0);
  const [tagTotalGwt, setTagTotalGwt] = useState(0);
  const [tagTotalNwt, setTagTotalNwt] = useState(0);
  const [productTotalPieces, setProductTotalPieces] = useState(0);
  const [productTotalGwt, setProductTotalGwt] = useState(0);
  const [productTotalNwt, setProductTotalNwt] = useState(0);
  const [counterTotalPieces, setCounterTotalPieces] = useState(0);
  const [counterTotalGwt, setCounterTotalGwt] = useState(0);
  const [counterTotalNwt, setCounterTotalNwt] = useState(0);
  const [employeeTotalPieces, setEmployeeTotalPieces] = useState(0);
  const [employeeTotalGwt, setEmployeeTotalGwt] = useState(0);
  const [employeeTotalNwt, setEmployeeTotalNwt] = useState(0);
  const [registerTotalPieces, setRegisterTotalPieces] = useState(0);
  const [registerTotalGwt, setRegisterTotalGwt] = useState(0);
  const [registerTotalNwt, setRegisterTotalNwt] = useState(0);
  const [dealerTotalPieces, setDealerTotalPieces] = useState(0);
  const [dealerTotalGwt, setDealerTotalGwt] = useState(0);
  const [dealerTotalNwt, setDealerTotalNwt] = useState(0);
  const [purityTotalPieces, setPurityTotalPieces] = useState(0);
  const [purityTotalGwt, setPurityTotalGwt] = useState(0);
  const [purityTotalNwt, setPurityTotalNwt] = useState(0);
  const [purityTotalAmount, setPurityTotalAmount] = useState(0);
  const [jewelTotalPieces, setJewelTotalPieces] = useState(0);
  const [jewelTotalGwt, setJewelTotalGwt] = useState(0);
  const [jewelTotalNwt, setJewelTotalNwt] = useState(0);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectMetal, setSelectMetal] = useState();

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const productWiseSaleAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/POSReports/GetProductWiseSale?fromDate=${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}&toDate=${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}&saleCode=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.Pcs) || 0;
        return acc + pieces;
      }, 0);
      setProductTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.Gwt) || 0;
        return acc + Gwt;
      }, 0);
      setProductTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.Nwt) || 0;
        return acc + Nwt;
      }, 0);
      setProductTotalNwt(totalNwt);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const counterWiseSaleAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/POSReports/GetCounterWiseSale?fromDate=${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}&toDate=${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}&saleCode=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.Pcs) || 0;
        return acc + pieces;
      }, 0);
      setCounterTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.Gwt) || 0;
        return acc + Gwt;
      }, 0);
      setCounterTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.Nwt) || 0;
        return acc + Nwt;
      }, 0);
      setCounterTotalNwt(totalNwt);
      setCounterData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
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
      setMetalData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const purityWiseSalesAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BILL_DATA&where=BILLDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND BILLDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}' AND MNAME='${selectMetal}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const groupedData = Object.values(
        data.reduce((acc, item) => {
          const key = item.Prefix;

          if (!acc[key]) {
            acc[key] = {
              Prefix: key,
              Pieces: 0,
              Gwt: 0,
              Nwt: 0,
              Item_Diamonds: 0,
              Diamond_Amount: 0,
              count: 0,
            };
          }

          acc[key].Pieces += Number(item.Pieces || 0);
          acc[key].Gwt += Number(item.Gwt || 0);
          acc[key].Nwt += Number(item.Nwt || 0);
          acc[key].Item_Diamonds += Number(item.Item_Diamonds || 0);
          acc[key].Diamond_Amount += Number(item.Diamond_Amount || 0);
          acc[key].count += 1;

          return acc;
        }, {})
      );
      const totalPieces = groupedData.reduce((acc, item) => {
        const pieces = Number(item.Pieces) || 0;
        return acc + pieces;
      }, 0);
      setPurityTotalPieces(totalPieces);
      const totalGwt = groupedData.reduce((acc, item) => {
        const Gwt = Number(item.Gwt) || 0;
        return acc + Gwt;
      }, 0);
      setPurityTotalGwt(totalGwt);
      const totalNwt = groupedData.reduce((acc, item) => {
        const Nwt = Number(item.Nwt) || 0;
        return acc + Nwt;
      }, 0);
      setPurityTotalNwt(totalNwt);
      const totalAmount = groupedData.reduce((acc, item) => {
        const amount = Number(item.Diamond_Amount) || 0;
        return acc + amount;
      }, 0);
      setPurityTotalAmount(totalAmount);
      setPurityData(groupedData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const employeeWiseAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetEMPWiseSale?fromDate=${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}&toDate=${dayjs(toDate).format("MM/DD/YYYY")}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.Pieces) || 0;
        return acc + pieces;
      }, 0);
      setEmployeeTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.Gwt) || 0;
        return acc + Gwt;
      }, 0);
      setEmployeeTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.Nwt) || 0;
        return acc + Nwt;
      }, 0);
      setEmployeeTotalNwt(totalNwt);
      setEmployeeData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const saleRegisterAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BILL_MAST&where=BILLDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND BILLDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.TotPieces) || 0;
        return acc + pieces;
      }, 0);
      setRegisterTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.TotGwt) || 0;
        return acc + Gwt;
      }, 0);
      setRegisterTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.TotNwt) || 0;
        return acc + Nwt;
      }, 0);
      setRegisterTotalNwt(totalNwt);
      setRegisterData(data);
      const uniqueJewelTypes = [
        ...new Set(data.map((item) => item.JewelType)),
      ].filter(Boolean);

      setJewelType(uniqueJewelTypes);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const dealerWiseSalesAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetDealerWiseSale?fromDate=${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}&toDate=${dayjs(toDate).format("MM/DD/YYYY")}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.Pieces) || 0;
        return acc + pieces;
      }, 0);
      setDealerTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.Gwt) || 0;
        return acc + Gwt;
      }, 0);
      setDealerTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.Nwt) || 0;
        return acc + Nwt;
      }, 0);
      setDealerTotalNwt(totalNwt);
      setDealerData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const tagWiseSalesAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=BILL_DATA&where=BILLDATE>='${dayjs(
          fromDate
        ).format("MM/DD/YYYY")}' AND BILLDATE<='${dayjs(toDate).format(
          "MM/DD/YYYY"
        )}'&order=BILLDATE,BILLNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.Pieces) || 0;
        return acc + pieces;
      }, 0);
      setTagTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.Gwt) || 0;
        return acc + Gwt;
      }, 0);
      setTagTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.Nwt) || 0;
        return acc + Nwt;
      }, 0);
      setTagTotalNwt(totalNwt);
      setTagData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const jewelTypeWiseSalesAPI = async () => {
      try {
        const response = await axios.get(
          `${CREATE_jwel}/api/DashBoard/GetTotalSaleValue?fromBillDate=${dayjs(fromDate).format(
            "MM/DD/YYYY"
          )}&toBillDate=${dayjs(toDate).format("MM/DD/YYYY")}&saleCode=1`,
          {
            headers: {
              tenantName: tenantName,
            },
          }
        );
  
        const data = response.data;
        const totalPieces = data.reduce((acc, item) => {
        const pieces = Number(item.TotPieces) || 0;
        return acc + pieces;
      }, 0);
      setJewelTotalPieces(totalPieces);
      const totalGwt = data.reduce((acc, item) => {
        const Gwt = Number(item.TotGwt) || 0;
        return acc + Gwt;
      }, 0);
      setJewelTotalGwt(totalGwt);
      const totalNwt = data.reduce((acc, item) => {
        const Nwt = Number(item.TotNwt) || 0;
        return acc + Nwt;
      }, 0);
      setJewelTotalNwt(totalNwt);
          setJewelTypeData(data);
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
    saleRegisterAPI();
    productWiseSaleAPI();
    counterWiseSaleAPI();
    metalSelectAPI();
    purityWiseSalesAPI();
    employeeWiseAPI();
    dealerWiseSalesAPI();
    tagWiseSalesAPI();
    jewelTypeWiseSalesAPI();
    // userAPI();
  }, [fromDate, toDate, selectMetal]);

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
    saleRegisterAPI();
    productWiseSaleAPI();
    counterWiseSaleAPI();
    metalSelectAPI();
    purityWiseSalesAPI();
    employeeWiseAPI();
    dealerWiseSalesAPI();
    tagWiseSalesAPI();
    jewelTypeWiseSalesAPI();
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
    if (!selectMetal && metalData.length > 0) {
      setSelectMetal(metalData[0].MNAME);
    }
  }, [metalData, selectMetal]);

  const filteredRegisterData = selectJewelType
    ? registerData.filter((item) => item.JewelType === selectJewelType)
    : registerData;

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
          <h3 className={styles.heading}>Point Of Sales</h3>
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
            expanded={expanded === "panel7" || expanded === "all"}
            onChange={() => {
              handleChange("panel7");
              tagWiseSalesAPI();
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
              Tag Wise Sales
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
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(tagTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(tagTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(tagTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
              </div>
              {tagData.map((tag, index) => (
                <div
                  key={tag.id}
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
                      fontSize: "12px",
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      padding: "8px",
                      border: "1px solid #162566",
                      borderRadius: "8px",
                      background: " #162566",
                    }}
                  >
                    <span>
                      Inv No:{" "}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.BillNo}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {dayjs(tag.BillDate).format("DD-MMM-YYYY")}
                      </span>
                    </span>
                    <span>
                      Tag:{" "}
                      <span
                        style={{
                          color: "#52bd91",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {tag.TagNo}
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
                    }}
                  >
                    <span>
                      Jewel Type:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.JewelType}
                      </span>
                    </span>
                    <span>
                      MName:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.Mname}
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
                    }}
                  >
                    <span>
                      PName:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.ProductName}
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
                    }}
                  >
                    <span>
                      CName:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.CounterName}
                      </span>
                    </span>
                    <span>
                      Purity:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.Prefix}
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
                          fontSize: "12px",
                        }}
                      >
                        {tag.Pieces}
                      </span>
                    </span>
                    <span>
                      Gwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.Gwt?.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Nwt:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        {tag.Nwt?.toFixed(3)}
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
                        "radial-gradient(circle at center, #ffffff 40%,rgb(201, 245, 159) 60%, rgb(201, 245, 159) 80%)",
                      padding: "10px",
                      borderRadius: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span>
                      Stone Cost:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {tag.Itemamt?.toFixed(2)}
                      </span>
                    </span>
                    <span>
                      Amount:{" "}
                      <span
                        style={{
                          color: "#162566",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {tag.Totamt?.toFixed(2)}
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
              jewelTypeWiseSalesAPI();
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
              Jewel Type Wise Sales
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
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(jewelTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(jewelTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(jewelTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
              </div>
              {jewelTypeData.map((jewel, index) => (
                <div
                  key={jewel.id}
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
                        {jewel.JewelType || "-"}
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
                        {jewel.TotPieces}
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
                        {jewel.TotGwt.toFixed(3) || 0.0}
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
                        {jewel.TotNwt?.toFixed(3) || 0.0}
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
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {jewel.NetAmt.toFixed(2) || 0.0}
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
            expanded={expanded === "panel1" || expanded === "all"}
            onChange={() => {
              handleChange("panel1");
              productWiseSaleAPI();
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
              Product Wise Sales
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
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(productTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(productTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(productTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
              </div>
              {product.map((prod, index) => (
                <div
                  key={prod.id}
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
                      {/* Bill No:{" "} */}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {prod.PRODUCTNAME}
                      </span>
                    </span>
                    {/* <span
                      style={{
                        color: "#52bd91",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      #{index + 1}
                    </span> */}
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
                        {prod.Pcs}
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
                        {prod.Gwt.toFixed(3)}
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
                        {prod.Nwt.toFixed(3)}
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
              counterWiseSaleAPI();
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
              Counter Wise Sales
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
              <div
                style={{
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(counterTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(counterTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(counterTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
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
                      {/* Bill No:{" "} */}
                      <span
                        style={{
                          color: " #ffffff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {counter.CounterName}
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
                        {counter.Pcs}
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
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      padding: "10px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      Amount:{" "}
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {counter.Amount.toFixed(2)}
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
              purityWiseSalesAPI();
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
                  expanded === "panel3" || expanded === "all"
                    ? "#52bd91"
                    : "#d6d6d6",
                color:
                  expanded === "panel3" || expanded === "all"
                    ? "white"
                    : "black",
              }}
            >
              Purity Wise Sales
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
              >
                <div style={{ minWidth: "60px", fontWeight: "bold" }}>
                  Main Product :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Metal"
                  style={{ width: "60%", marginLeft: "10px" }}
                  value={selectMetal}
                  onChange={(value) => {
                    setSelectMetal(value);
                  }}
                >
                  {metalData.map((metal, index) => (
                    <Option key={index} value={metal.MNAME}>
                      {metal.MNAME}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(purityTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(purityTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(purityTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
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
                      {/* Purity:{" "} */}
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {purity.Prefix}
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
                        {purity.Item_Diamonds.toFixed(3)}
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
                        {purity.Diamond_Amount.toFixed(2)}
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
              employeeWiseAPI();
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
              Employee Wise Sales
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
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(employeeTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(employeeTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(employeeTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
              </div>
              {employeeData.map((employee, index) => (
                <div
                  key={employee.id}
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
                        {employee.SMCODE || "-"}
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
                        {employee.Mname || "-"}
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
                        {employee.Pieces}
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
                        {employee.Gwt.toFixed(3) || 0.0}
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
                        {employee.Nwt?.toFixed(3) || 0.0}
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
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {employee.Totamt.toFixed(2) || 0.0}
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
              saleRegisterAPI();
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
              Sales Register
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
                  JewelType :
                </div>
                <Select
                  allowClear
                  showSearch={false}
                  placeholder="Select Metal"
                  style={{ width: "60%", marginLeft: "10px" }}
                  onChange={(value) => {
                    setSelectJewelType(value);
                  }}
                >
                  {jewelType.map((metal, index) => (
                    <Option key={index} value={metal}>
                      {metal}
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                style={{
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(registerTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(registerTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(registerTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
              </div>
              {filteredRegisterData.map((sale, index) => (
                <div
                  key={sale.id}
                  style={{
                    background:
                      sale.JewelType?.split(" ")[0] === "GOLD"
                        ? " #fef6e4"
                        : sale.JewelType?.split(" ")[0] === "SILVER"
                        ? "rgba(246, 191, 248, 0.18)"
                        : sale.JewelType?.split(" ")[0] === "DIAMOND" ||
                          sale.JewelType?.split(" ")[0] === "DIAMONDS"
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
                    sale No:{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {sale.BillNo}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Name:{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {sale.CustName}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Pieces:{" "}
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {" "}
                      {sale.TotPieces}{" "}
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
                        {sale.TotNwt.toFixed(3)}g
                      </span>
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      Gwt:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {sale.TotGwt.toFixed(3)}g
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
                        {sale.Item_Diamonds.toFixed(3)}
                      </span>
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      Dia.Amt:{" "}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        ₹ {sale.Diamond_Amount.toFixed(2)}
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
                        ₹ {sale.BillAmt.toFixed(2)}
                      </span>
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      Time:
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {dayjs(sale.BillTime).format("HH:mm")}
                      </span>
                    </span>
                  </div>
                  {sale.JewelType?.split(" ")[0] === "GOLD" ||
                  sale.JewelType?.split(" ")[0] === "SILVER" ||
                  sale.JewelType?.split(" ")[0] === "DIAMOND" ||
                  sale.JewelType?.split(" ")[0] === "DIAMONDS" ? (
                    <img
                      src={
                        sale.JewelType?.split(" ")[0] === "GOLD"
                          ? gold
                          : sale.JewelType?.split(" ")[0] === "SILVER"
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
            expanded={expanded === "panel6" || expanded === "all"}
            onChange={() => {
              handleChange("panel6");
              dealerWiseSalesAPI();
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
              Dealer Wise Sales
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
                  background: "#add8e6",
                  marginBottom: "8px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "2px solid #add8e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "500px",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Pcs
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(dealerTotalPieces || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Gwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(dealerTotalGwt || 0).toFixed(3)}
                  </div>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#000",
                    }}
                  >
                    Tot.Nwt
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {Number(dealerTotalNwt || 0).toFixed(3)}
                  </div>
                </div>
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
                          fontSize: "16px",
                        }}
                      >
                        {dealer.DealerName || "-"}
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
                        {dealer.Mname || "-"}
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
                        {dealer.Gwt.toFixed(3) || 0.0}
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
                        {dealer.Nwt?.toFixed(3) || 0.0}
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
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ₹ {dealer.Totamt.toFixed(2) || 0.0}
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

export default PointOfSales;
