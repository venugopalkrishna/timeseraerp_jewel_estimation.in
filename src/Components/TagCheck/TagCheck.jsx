import { Button, Input } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./TagCheck.module.css";
import StonesDetailsDialog from "./StonesDetailsDialog";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import ImageDialog from "./ImageDialog";

const TagCheck = () => {
  const tagNoRef = useRef(null);
  const submitRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [barCode, setBarCode] = useState();
  const [barCodeData, setBarCodeData] = useState([]);
  const [stonesData, setStonesData] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState([]);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [changeCard, setChangeCard] = useState(true);
  const [stonesOpen, setStonesOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [makingAmount, setMakingAmount] = useState(0);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");
  const userType = localStorage.getItem("userType");
  const mcCalc = localStorage.getItem("mcCalc");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const tagNoAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGNO=${barCode}`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      const modifiedTotalData = data.map((item) => {
        const safeNumber = (val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        };

        const nwt = safeNumber(item?.NWT ?? 0);
        const rate = safeNumber(item?.RATE ?? 0);
        const cattotwast = safeNumber(item?.CATTOTWAST ?? 0);
        const cattotMc = safeNumber(item?.CATTOTMC ?? 0);
        const directWastage = safeNumber(item?.DIRECTWASTAGE ?? 0);
        const directMc = safeNumber(item?.DIRECTMC ?? 0);
        const stoneAmount = safeNumber(item?.ITEM_TOTAMT ?? 0);
        const gstNo = data[0]?.GSTRATE;
        let net = 0;
        const NWT = Number(item?.NWT || 0);
        const GWT = Number(item?.GWT || 0);
        const WAST = Number(item?.WASTAGE || 0);
        const making = Number(item?.MAKINGCHARGES) || 0;
        if (mcCalc === "NWT") {
          net = NWT;
        } else if (mcCalc === "GWT") {
          net = GWT;
        } else if (mcCalc === "GWT_WAST") {
          net = GWT + (NWT * WAST) / 100;
        } else {
          net = NWT + (NWT * WAST) / 100;
        }

        // const makingAmt =

        const wastageAmt = directWastage > 0 ? directWastage : cattotwast;
        const mcAmount = directMc > 0 ? directMc : Number(net * making);

        const rateAmount = Number(nwt + wastageAmt).toFixed(3);
        const amount = Number(rateAmount * rate).toFixed(0);
        const mcStone = mcAmount + stoneAmount;

        const totalAmount = safeNumber(amount) + safeNumber(mcStone);
        const gstAmount = (totalAmount * gstNo) / 100;
        const netAmount = totalAmount + gstAmount;

        return {
          TAGNO: item?.TAGNO ?? "",
          TOTALAMT: totalAmount,
          GSTTOTALAMT: gstAmount,
          NETAMT: netAmount,
        };
      });

      setTotalAmounts(modifiedTotalData);

      setBarCodeData(data);
      setBarCode();
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const stonesDetailsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_ITEMS&where=TAGNO=${barCode}`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      setStonesData(data);
      setBarCode();
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

  const handleOk = () => {
    setStonesOpen(true);
  };

  const handleCancel = () => {
    setStonesOpen(false);
  };

  const handleReset = () => {
    setBarCode("");
    setBarCodeData([]);
    setTotalAmounts([]);
    setMakingAmount(0);
  };

  const handleImageOk = () => {
    setImageOpen(true);
  };

  const handleImageCancel = () => {
    setImageOpen(false);
  };

  const handleTagNoKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitRef.current?.click();
    }
  };

  // useEffect(() => {
  //   userAPI();
  // }, []);

  useEffect(() => {
    if (imagesData.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imagesData.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [imagesData]);
  useEffect(() => {
    let net = 0;
    const NWT = Number(barCodeData[0]?.NWT || 0);
    const GWT = Number(barCodeData[0]?.GWT || 0);
    const WAST = Number(barCodeData[0]?.WASTAGE || 0);
    const making = Number(barCodeData[0]?.MAKINGCHARGES) || 0;
    if (mcCalc === "NWT") {
      net = NWT;
    } else if (mcCalc === "GWT") {
      net = GWT;
    } else if (mcCalc === "GWT_WAST") {
      net = GWT + (NWT * WAST) / 100;
    } else {
      net = NWT + (NWT * WAST) / 100;
    }
    const amt = Number(net * making);
    setMakingAmount(amt);
  }, [barCodeData]);

  return (
    <div style={{ background: "#F6F1E9", height: "100vh" }}>
      <Header setOpen={setOpen} />
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
      {/* <div className={styles.carouselContainer}>
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
      </div> */}
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h3 className={styles.heading}>Tag Check</h3>
        </div>
        <div className={styles.estimationTagContainer}>
          <div className={styles.tagNoSection}>
            <span className={styles.tagLabel}>Tag No</span>
            <Input
              className={styles.tagInput}
              ref={tagNoRef}
              onKeyDown={handleTagNoKeyDown}
              value={barCode}
              autoFocus={true}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setBarCode(value);
                }
                // setBarCode(e.target.value);
              }}
            />
          </div>

          <div className={styles.buttonSection}>
            <Button
              type="primary"
              htmlType="submit"
              ref={submitRef}
              className={styles.submitButton}
              onClick={() => {
                tagNoAPI();
                stonesDetailsAPI();
              }}
            >
              Show
            </Button>

            <Button
              type="primary"
              danger
              className={styles.resetButton}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
        {Number(userType) != 1 ? (
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={`${styles.buttonBase} ${
                changeCard === true ? styles.active : ""
              }`}
              onClick={() => setChangeCard(true)}
            >
              Sale
            </button>
            <button
              type="button"
              className={`${styles.buttonBase} ${
                changeCard === false ? styles.active1 : ""
              }`}
              onClick={() => setChangeCard(false)}
            >
              Purchase
            </button>
          </div>
        ) : (
          ""
        )}
        {changeCard === true ? (
          <>
            <div className={styles.card}>
              <div className={styles.header}>
                <div>
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    #{barCodeData[0]?.TAGNO ? barCodeData[0]?.TAGNO : "0"}
                  </span>
                  <br />
                  <small>Tag no</small>
                </div>
                {barCodeData?.length > 0 &&
                  barCodeData[0]?.VV != "-" &&
                  barCodeData[0]?.VV != null &&
                  barCodeData[0]?.VV != undefined &&
                  barCodeData[0]?.VV != "NO" && (
                    <div>
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
                        onClick={handleImageOk}
                      >
                        <img
                          src={barCodeData[0]?.VV}
                          alt="img"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                    </div>
                  )}
                <div>
                  Today Rate
                  <br />
                  <span className={styles.amount}>
                    ₹{" "}
                    {barCodeData[0]?.RATE
                      ? barCodeData[0]?.RATE.toFixed(2)
                      : 0.0}
                  </span>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.productHeader}>
                  <span className={styles.productName}>
                    {barCodeData[0]?.PRODUCTNAME
                      ? barCodeData[0]?.PRODUCTNAME
                      : "-"}
                  </span>
                  <span className={styles.qtyBox}>
                    {barCodeData[0]?.PIECES
                      ? `${barCodeData[0]?.PIECES} ${
                          barCodeData[0]?.PIECES === 1 ? "piece" : "pieces"
                        }`
                      : "0 pieces"}
                  </span>
                </div>
                <div className={styles.divider} />
                <div className={styles.details}>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Main Product</span>
                    <span className={styles.separator2}>:</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "16px",
                        textAlign: "right",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {barCodeData[0]?.MNAME ? barCodeData[0]?.MNAME : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Product Category</span>
                    <span className={styles.separator2}>:</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "16px",
                        textAlign: "right",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {barCodeData[0]?.PRODUCTCATEGORY
                        ? barCodeData[0]?.PRODUCTCATEGORY
                        : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>HSN Code</span>
                    <span className={styles.separator2}>:</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "16px",
                        textAlign: "right",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {barCodeData[0]?.HSNCODE ? barCodeData[0]?.HSNCODE : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Purity</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.PREFIX ? barCodeData[0]?.PREFIX : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Gwt</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.GWT
                        ? barCodeData[0]?.GWT?.toFixed(3) + "g"
                        : "0.000g"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Stone Wt</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.stonewt
                        ? barCodeData[0]?.stonewt?.toFixed(3) + "g"
                        : "0.000g"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Nwt</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.NWT
                        ? barCodeData[0]?.NWT?.toFixed(3) + "g"
                        : "0.000g"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>
                      Wastage (
                      {barCodeData[0]?.WASTAGE
                        ? Number(barCodeData[0]?.WASTAGE) + "%"
                        : "0%"}
                      )
                    </span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.CATTOTWAST
                        ? Number(barCodeData[0]?.CATTOTWAST)?.toFixed(3) + "g"
                        : "0.000g"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>
                      MC/Amt (
                      {barCodeData[0]?.MAKINGCHARGES
                        ? Number(barCodeData[0]?.MAKINGCHARGES) + "/g"
                        : "0/g"}
                      )
                    </span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      ₹{" "}
                      {makingAmount
                        ? Number(makingAmount).toFixed(2)
                        : Number(barCodeData[0]?.DIRECTMC).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.highlightBox2}>
                    <span className={styles.label2}>Mteal Value </span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      ₹{" "}
                      {(
                        (barCodeData[0]?.RATE ?? 0) * (barCodeData[0]?.NWT ?? 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div
                    className={styles.highlightBox1}
                    onClick={() => {
                      if (barCodeData[0]?.ITEM_TOTAMT > 0) {
                        handleOk();
                      }
                    }}
                  >
                    <span className={styles.label2}>
                      Stone Cost{" "}
                      {barCodeData[0]?.ITEM_TOTAMT > 0 && (
                        <span style={{ color: "blue", cursor: "pointer" }}>
                          (Click Me)
                        </span>
                      )}
                    </span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      ₹{" "}
                      {barCodeData[0]?.ITEM_TOTAMT
                        ? barCodeData[0]?.ITEM_TOTAMT.toFixed(2)
                        : 0.0}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginTop: "5px",
                      marginBottom: "5px",
                      padding: "8px",
                      border: "1px solid lightgreen",
                      borderRadius: "8px",
                      background: "lightgreen",
                    }}
                  >
                    <span>
                      Dia.Cts:{" "}
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {barCodeData[0]?.Item_diamonds
                          ? barCodeData[0]?.Item_diamonds?.toFixed(3)
                          : 0}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹{" "}
                        {barCodeData[0]?.Diamond_Amount
                          ? barCodeData[0]?.Diamond_Amount?.toFixed(2)
                          : 0}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "black",
                      marginTop: "5px",
                      marginBottom: "5px",
                      padding: "8px",
                      border: "1px solid lightgray",
                      borderRadius: "8px",
                      background: "lightgray",
                    }}
                  >
                    <span>
                      Brand.Name:{" "}
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {barCodeData[0]?.BRANDNAME
                          ? barCodeData[0]?.BRANDNAME
                          : "-"}
                      </span>
                    </span>
                    <span>
                      Brand.Amt:{" "}
                      <span
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ₹{" "}
                        {barCodeData[0]?.BRANDCALCAMT
                          ? barCodeData[0]?.BRANDCALCAMT?.toFixed(2)
                          : 0}
                      </span>
                    </span>
                  </div>
                  {barCodeData[0]?.TRAY === true && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        marginTop: "5px",
                        marginBottom: "5px",
                        padding: "8px",
                        border: "1px solid f3f6fb",
                        borderRadius: "8px",
                        background: "#e0e7f1",
                        // "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                      }}
                    >
                      <span
                        style={{
                          color: " #52db91",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        TRAY
                      </span>
                    </div>
                  )}
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Dealer</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.DEALERNAME
                        ? barCodeData[0]?.DEALERNAME
                        : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Counter </span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.COUNTERNAME
                        ? barCodeData[0]?.COUNTERNAME
                        : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>HUID</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.HUID ? barCodeData[0]?.HUID : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Tag Size</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.TAGSIZE ? barCodeData[0]?.TAGSIZE : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Tag Date</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.TAGDATE
                        ? dayjs(barCodeData[0]?.TAGDATE).format("DD-MMM-YYYY")
                        : "-"}
                    </span>
                  </div>
                  <div className={styles.rowTag2}>
                    <span className={styles.label2}>Description</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCodeData[0]?.DESC1 ? barCodeData[0]?.DESC1 : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.header1}>
                <div>
                  Total Amount
                  <br />
                  <span className={styles.amount1}>
                    ₹
                    {totalAmounts[0]?.TOTALAMT
                      ? totalAmounts[0]?.TOTALAMT.toFixed(2)
                      : 0.0}
                  </span>
                </div>
                <div>
                  Gst @ {barCodeData[0]?.GSTRATE || 0.0}%
                  <br />
                  <span className={styles.amount2}>
                    ₹
                    {totalAmounts[0]?.GSTTOTALAMT
                      ? totalAmounts[0]?.GSTTOTALAMT.toFixed(2)
                      : 0.0}
                  </span>
                </div>
                <div>
                  Net.Amt
                  <br />
                  <span className={styles.amount1}>
                    ₹
                    {totalAmounts[0]?.NETAMT
                      ? totalAmounts[0]?.NETAMT.toFixed(2)
                      : 0.0}
                  </span>
                </div>
              </div>
            </div>
            {barCodeData?.length > 0 && barCodeData[0].STATUS != "-" && (
              <div className={styles.card}>
                <div className={styles.header2}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {/* {barCodeData[0]?.STATUS ? barCodeData[0]?.STATUS : "-"} */}
                      Approval
                    </span>
                  </div>
                </div>
                <div className={styles.content}>
                  <div className={styles.details}>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>Category</span>
                      <span className={styles.separator2}>:</span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "16px",
                          textAlign: "right",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {barCodeData[0]?.APPCATEGORY
                          ? barCodeData[0]?.APPCATEGORY
                          : "-"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>Name</span>
                      <span className={styles.separator2}>:</span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "16px",
                          textAlign: "right",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {barCodeData[0]?.APPNAME
                          ? barCodeData[0]?.APPNAME
                          : "-"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>Incharge</span>
                      <span className={styles.separator2}>:</span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "16px",
                          textAlign: "right",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {barCodeData[0]?.APPINCHRG
                          ? barCodeData[0]?.APPINCHRG
                          : "-"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>App Date</span>
                      <span className={styles.separator2}>:</span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "16px",
                          textAlign: "right",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {barCodeData[0]?.APPDate
                          ? dayjs(barCodeData[0]?.APPDate).format("DD-MMM-YYYY")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.card}>
            <div className={styles.header1}>
              <div>
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  #{barCodeData[0]?.TAGNO ? barCodeData[0]?.TAGNO : "0"}
                </span>
                <br />
                <small>Tag no</small>
              </div>
              <div>
                Pure Rate
                <br />
                <span className={styles.amount1}>
                  ₹{" "}
                  {barCodeData[0]?.FINERATE
                    ? barCodeData[0]?.FINERATE.toFixed(2)
                    : 0.0}
                </span>
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.productHeader}>
                <span className={styles.productName}>
                  {barCodeData[0]?.PRODUCTNAME
                    ? barCodeData[0]?.PRODUCTNAME
                    : "-"}
                </span>
                <span className={styles.qtyBox}>
                  {barCodeData[0]?.PIECES
                    ? `${barCodeData[0]?.PIECES} ${
                        barCodeData[0]?.PIECES === 1 ? "piece" : "pieces"
                      }`
                    : "0 pieces"}
                </span>
              </div>
              <div className={styles.divider} />

              <div className={styles.details}>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Main Product</span>
                  <span className={styles.separator2}>:</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "16px",
                      textAlign: "right",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {barCodeData[0]?.MNAME ? barCodeData[0]?.MNAME : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Product Category</span>
                  <span className={styles.separator2}>:</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "16px",
                      textAlign: "right",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {barCodeData[0]?.PRODUCTCATEGORY
                      ? barCodeData[0]?.PRODUCTCATEGORY
                      : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>HSN Code</span>
                  <span className={styles.separator2}>:</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "16px",
                      textAlign: "right",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {barCodeData[0]?.HSNCODE ? barCodeData[0]?.HSNCODE : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Purity</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.PREFIX ? barCodeData[0]?.PREFIX : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Gwt</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.COST_LESS
                      ? barCodeData[0]?.COST_GWT?.toFixed(3) + "g"
                      : "0.000g"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Stone Wt</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.COST_LESS
                      ? barCodeData[0]?.COST_LESS?.toFixed(3) + "g"
                      : "0.000g"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Nwt</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.COST_NWT
                      ? barCodeData[0]?.COST_NWT?.toFixed(3) + "g"
                      : "0.000g"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Touch + Wastage</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.COST_TOUCH
                      ? Number(barCodeData[0]?.COST_TOUCH)?.toFixed(3) + "g"
                      : "0.000g"}{" "}
                    +{" "}
                    {barCodeData[0]?.COST_WASTAGE
                      ? Number(barCodeData[0]?.COST_WASTAGE)?.toFixed(3) + "g"
                      : "0.000g"}
                  </span>
                </div>
                <div className={styles.highlightBox2}>
                  <span className={styles.label2}>Fine Gold</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.COST_FTOUCH
                      ? Number(barCodeData[0]?.COST_FTOUCH).toFixed(3)
                      : 0.0}
                  </span>
                </div>
                <div className={styles.highlightBox1}>
                  <span className={styles.label2}>Amount</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    ₹{" "}
                    {barCodeData[0]?.COST_FTOUCH * barCodeData[0]?.FINERATE
                      ? (
                          barCodeData[0]?.COST_FTOUCH * barCodeData[0]?.FINERATE
                        ).toFixed(2)
                      : 0.0}
                  </span>
                </div>
                <div className={styles.highlightBox3}>
                  <span className={styles.label2}>MC</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    ₹{" "}
                    {barCodeData[0]?.COST_MC
                      ? Number(barCodeData[0]?.COST_MC).toFixed(2)
                      : 0.0}
                  </span>
                </div>
                <div className={styles.highlightBox}>
                  <span className={styles.label2}>Others</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    ₹{" "}
                    {barCodeData[0]?.COST_STAMT
                      ? barCodeData[0]?.COST_STAMT.toFixed(2)
                      : 0.0}
                  </span>
                  {/* </div> */}
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Dealer</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.DEALERNAME
                      ? barCodeData[0]?.DEALERNAME
                      : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Counter</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.COUNTERNAME
                      ? barCodeData[0]?.COUNTERNAME
                      : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>HUID</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.HUID ? barCodeData[0]?.HUID : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Tag Size</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.TAGSIZE ? barCodeData[0]?.TAGSIZE : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Tag Date</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.TAGDATE
                      ? dayjs(barCodeData[0]?.TAGDATE).format("DD-MMM-YYYY")
                      : "-"}
                  </span>
                </div>
                <div className={styles.rowTag2}>
                  <span className={styles.label2}>Description</span>
                  <span className={styles.separator2}>:</span>
                  <span className={styles.value2}>
                    {barCodeData[0]?.DESC1 ? barCodeData[0]?.DESC1 : "-"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.header}>
              <div>
                Total Amount
                <br />
                <span className={styles.amount}>
                  ₹{" "}
                  {(
                    barCodeData[0]?.COST_FTOUCH * barCodeData[0]?.FINERATE +
                    barCodeData[0]?.COST_MC +
                    barCodeData[0]?.COST_STAMT
                  )?.toFixed(2) || 0.0}
                </span>
              </div>
              <div>
                Gst @ {barCodeData[0]?.GSTRATE || 0.0}%
                <br />
                <span className={styles.amount3}>
                  ₹{" "}
                  {(
                    ((barCodeData[0]?.COST_FTOUCH * barCodeData[0]?.FINERATE +
                      barCodeData[0]?.COST_MC +
                      barCodeData[0]?.COST_STAMT) *
                      barCodeData[0]?.GSTRATE) /
                    100
                  )?.toFixed(2) || 0.0}
                </span>
              </div>
              <div>
                Net.Amt
                <br />
                <span className={styles.amount}>
                  ₹{" "}
                  {(
                    barCodeData[0]?.COST_FTOUCH * barCodeData[0]?.FINERATE +
                    barCodeData[0]?.COST_MC +
                    barCodeData[0]?.COST_STAMT +
                    ((barCodeData[0]?.COST_FTOUCH * barCodeData[0]?.FINERATE +
                      barCodeData[0]?.COST_MC +
                      barCodeData[0]?.COST_STAMT) *
                      barCodeData[0]?.GSTRATE) /
                      100
                  )?.toFixed(2) || 0.0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <StonesDetailsDialog
        stonesOpen={stonesOpen}
        handleCancel={handleCancel}
        stonesData={stonesData}
      />
      <ImageDialog
        handleImageCancel={handleImageCancel}
        imageOpen={imageOpen}
        imageData={barCodeData[0]?.VV}
      />
    </div>
  );
};

export default TagCheck;
