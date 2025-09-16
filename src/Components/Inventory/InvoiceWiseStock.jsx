import axios from "axios";
import { use, useEffect, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./invoiceWiseStock.module.css";
import { Button, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const InvoiceWiseStock = () => {
  const [open, setOpen] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [selectCity, setSelectCity] = useState("");
  const [PartyNameData, setPartyNameData] = useState([]);
  const [selectPartyName, setSelectPartyName] = useState("");
  const [InvNodata, setInvNoData] = useState([]);
  const [selectInvNo, setSelectInvNo] = useState("");
  const [InvoiceData, setInvoiceData] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
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

  const supplierAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/ERP/GetDataFromGivenTableName?tableName=SUPPLIER`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const filteredData = data
          .filter((item) => item.area && item.area.trim() !== "")
          .map(({ area }) => ({ area }));
        setCityData(filteredData);
        setPartyNameData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const invoiceNoAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/ERP/GetDataFromGivenTableNameWithWhere?tableName=CURRENT_STOCK&where=AREA='${selectCity}' and PARTYNAME='${selectPartyName}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const filteredData = data.filter(
          (item) => item.InvNO && item.InvNO.trim() !== ""
        );

        const uniqueInvNo = Array.from(
          new Set(filteredData.map((item) => item.InvNO))
        ).map((invNo) => ({ InvNO: invNo }));

        setInvNoData(uniqueInvNo);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const invoiceMainAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/ERP/GetDataFromGivenTableNameWithWhereandOrder?tableName=CURRENT_STOCK&where=AREA='${selectCity}' and PARTYNAME='${selectPartyName}' and INVNO='${selectInvNo}'&order=SNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setInvoiceData(data);
        const totalPay = data.reduce((acc, item) => {
          const pQty = Number(item.PQTY) || 0;
          return acc + pQty;
        }, 0);

        const total = data.reduce((acc, item) => {
          const pQty = Number(item.PQTY) || 0;
          const grossDP = Number(item.GrosDPrice) || 0;
          return acc + pQty * grossDP;
        }, 0);

        setTotalAmount(total);
        setTotalQty(totalPay);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  // const userAPI = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${CREATE_jwel}/api/ERP/GetDataFromGivenTableName?tableName=FIRM_CONFIGURE`,
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
    supplierAPI();
    // userAPI();
    if (selectCity && selectPartyName) {
      invoiceNoAPI();
    }
    // if (selectCity && selectPartyName && selectInvNo) {
    //   invoiceMainAPI();
    // }
  }, [selectCity, selectPartyName, selectInvNo]);

  const filteredPartyNames = PartyNameData.filter(
    (item) => item.area === selectCity
  ).filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.Custname === item.Custname) // remove duplicates
  );

  const handleReset = () => {
    setSelectCity("");
    setSelectPartyName("");
    setInvNoData([]);
    setInvoiceData([]);
    setSelectInvNo("");
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
          <h3 className={styles.heading}>Invoice Wise Stock</h3>
        </div>
        <div className={styles.estimationTagContainer}>
          <div className={styles.formRow}>
            <div className={styles.label}>Select City:</div>
            <Select
              className={styles.selectField}
              allowClear
              showSearch={false}
              placeholder="Select City"
              autoFocus={true}
              // style={{ width: "70%" }}
              value={selectCity || null}
              onChange={(value) => {
                setSelectCity(value);
                setSelectPartyName("");
                setInvNoData([]);
                setSelectInvNo("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const filteredOptions = cityData.filter((city) =>
                    city.area
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  );
                  if (filteredOptions.length > 0) {
                    setSelectCity(filteredOptions[0].area);
                  }
                }
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {cityData.map((city, index) => (
                <Option key={index} value={city.area}>
                  {city.area}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.formRow}>
            <div className={styles.label}>Select Name:</div>
            <Select
              className={styles.selectField}
              allowClear
              showSearch={false}
              placeholder="Select Party Name"
              // style={{ width: "70%" }}
              disabled={!selectCity}
              value={selectPartyName || null}
              onChange={(value) => {
                setSelectPartyName(value);
                setInvNoData([]);
                setSelectInvNo("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const filteredOptions = filteredPartyNames.filter((name) =>
                    name.Custname.toLowerCase().includes(
                      e.target.value.toLowerCase()
                    )
                  );
                  if (filteredOptions.length > 0) {
                    setSelectPartyName(filteredOptions[0].Custname);
                  }
                }
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredPartyNames.map((name, index) => (
                <Option key={index} value={name.Custname}>
                  {name.Custname}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.formRow}>
            <div className={styles.label}>Select InvNo:</div>
            <Select
              className={styles.selectField}
              allowClear
              showSearch={false}
              placeholder="Select InvNo"
              // style={{ width: "70%" }}
              disabled={!selectCity || !selectPartyName}
              value={selectInvNo || null}
              onChange={(value) => {
                setSelectInvNo(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const filteredOptions = InvNodata.filter((inv) =>
                    inv.InvNO.toLowerCase().includes(
                      e.target.value.toLowerCase()
                    )
                  );
                  if (filteredOptions.length > 0) {
                    setSelectInvNo(filteredOptions[0].InvNO);
                  }
                }
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {InvNodata.map((inv, index) => (
                <Option key={index} value={inv.InvNO}>
                  {inv.InvNO}
                </Option>
              ))}
            </Select>
          </div>
          {/* {selectCity && selectPartyName && selectInvNo && ( */}
          <div className={styles.buttonSection}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              onClick={() => {
                if (selectCity && selectPartyName && selectInvNo) {
                  invoiceMainAPI();
                }
              }}
            >
              Show
            </Button>

            <Button
              type="primary"
              danger
              className={styles.resetButton}
              onClick={() => {
                if (InvoiceData.length > 0) {
                  handleReset();
                }
              }}
            >
              Reset
            </Button>
          </div>
          {/* )} */}
          {InvoiceData.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                // alignItems: "center",
                fontSize: "14px",
                color: "#555",
                fontWeight: "bold",
                //   backgroundColor: "#f0f0f0",
                background:
                  "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                borderRadius: "8px",
                padding: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                gap: "5px",
              }}
            >
              <span>
                Total QTY:{" "}
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {totalQty}
                </span>
              </span>
              <span>
                Total Amount:{" "}
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {"₹" + totalAmount?.toFixed(2)}
                </span>
              </span>
            </div>
          )}
        </div>
        <div>
          {InvoiceData.length === 0 ? (
            <div
              style={{
                background:
                  "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                marginBottom: "8px",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                textAlign: "center",
                color: "#888",
                fontSize: "16px",
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
                }}
              >
                <span>
                  Inv No:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    -
                  </span>
                </span>
                <span>
                  Inv Date:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    -
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
                  Entry No:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
                  </span>
                </span>
                <span>
                  Entry Date:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
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
                  Brand Name:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
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
                  Group:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  //   alignItems: "center",
                  fontSize: "14px",
                  color: "#555",
                  //   backgroundColor: "#f0f0f0",
                  background:
                    "radial-gradient(circle at center, #ffebee 40%, #f8bbd0 60%, #e1bee7 80%)",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "10px",
                  gap: "5px",
                }}
              >
                <span>
                  Design Code:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#9c27b0",
                    }}
                  >
                    -
                  </span>
                </span>
                <span>
                  Brand Code:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#9c27b0",
                    }}
                  >
                    -
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
                  Product Name:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                  fontSize: "16px",
                  color: "#555",
                  fontWeight: "bold",
                  //   backgroundColor: "#f0f0f0",
                  background:
                    "radial-gradient(circle at center, #b39ddb 40%, #9fa8da 60%, #90caf9 80%)",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "10px",
                }}
              >
                <span>
                  Size:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#e91e63",
                    }}
                  >
                    -
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
                  HSN Code:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
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
                  Fashion:{" "}
                  <span
                    style={{
                      color: "#162566",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    -
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
                  //   backgroundColor: "#f0f0f0",
                  background:
                    "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                  borderRadius: "8px",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "10px",
                }}
              >
                <span>
                  Purchase QTY:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    0
                  </span>
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "5px",
                  }}
                >
                  <span>
                    Sale QTY:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      0
                    </span>
                  </span>
                  <span>
                    Balance QTY:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      0
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
                  //   backgroundColor: "#f0f0f0",
                  //   background:
                  //     "radial-gradient(circle at center, #eeeeee 40%, #bcaaa4 60%, #ffab91 80%)",
                  background:
                    "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "10px",
                }}
              >
                <span>
                  DEPrice:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {"₹" + 0.0}
                  </span>
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "5px",
                  }}
                >
                  <span>
                    GST(%):{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {0 + "%"}
                    </span>
                  </span>
                  <span>
                    GrosDP:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {"₹" + 0.0}
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
                  //   backgroundColor: "#f0f0f0",
                  //   background:
                  //     "radial-gradient(circle at center, #fff9c4 40%, #ffecb3 60%, #ffe0b2 80%)",
                  background:
                    "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "10px",
                }}
              >
                <span>
                  MRP:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {"₹" + 0.0}
                  </span>
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    size: "5px",
                  }}
                >
                  <span>
                    OFFER:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {"₹" + 0.0}
                    </span>
                  </span>
                  <span>
                    DISAmt:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {"₹" + 0.0}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            InvoiceData.map((invoice, index) => (
              <div
                key={invoice.id}
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
                    justifyContent: "flex-end", // moves to the end horizontally
                    alignItems: "center", // optional: aligns items vertically in the middle
                    fontSize: "14px",
                    color: "#555",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "red", // light background to contrast with the green text
                      padding: "4px 10px",
                      borderRadius: "100%", // fully rounded
                      display: "inline-block",
                    }}
                  >
                    <span
                      style={{
                        color: "White",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      {"#" + (index + 1)}
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
                    Inv No:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {invoice.InvNO}
                    </span>
                  </span>
                  <span>
                    Inv Date:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {dayjs(invoice.InvNO).format("DD-MMM-YYYY")}
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
                    Entry No:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.ENTRYNO}
                    </span>
                  </span>
                  <span>
                    Entry Date:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {dayjs(invoice.ENTRYDATE).format("DD-MMM-YYYY")}
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
                    Brand Name:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.CompName}
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
                    Group:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.GroupName}
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    // alignItems: "center",
                    fontSize: "14px",
                    color: "#555",
                    //   backgroundColor: "#f0f0f0",
                    background:
                      "radial-gradient(circle at center, #ffebee 40%, #f8bbd0 60%, #e1bee7 80%)",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                    gap: "5px",
                  }}
                >
                  <span>
                    Design Code:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#9c27b0",
                      }}
                    >
                      {invoice.DesignCode}
                    </span>
                  </span>
                  <span>
                    Brand Code:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#9c27b0",
                      }}
                    >
                      {invoice.ItemCode}
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
                    Product Name:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.ProdName}
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "black",
                    //   backgroundColor: "#f0f0f0",
                    background:
                      "radial-gradient(circle at center, #b39ddb 40%, #9fa8da 60%, #90caf9 80%)",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                  }}
                >
                  <span>
                    Size:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#e91e63",
                      }}
                    >
                      {invoice.Prodsize}
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
                    HSN Code:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.HSNCODE}
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
                    Fashion:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.FITTING}
                    </span>
                  </span>
                  <span>
                    Colour:{" "}
                    <span
                      style={{
                        color: "#162566",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {invoice.COLOUR}
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
                    //   backgroundColor: "#f0f0f0",
                    background:
                      "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                    borderRadius: "8px",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                  }}
                >
                  <span>
                    Purchase QTY:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {invoice.PQTY}
                    </span>
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <span>
                      Sale QTY:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {invoice.PQTY - invoice.Qty}
                      </span>
                    </span>
                    <span>
                      Balance QTY:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {invoice.Qty}
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
                    //   backgroundColor: "#f0f0f0",
                    //   background:
                    //     "radial-gradient(circle at center, #eeeeee 40%, #bcaaa4 60%, #ffab91 80%)",
                    background:
                      "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                  }}
                >
                  <span>
                    DLR.Price:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {"₹" + invoice.DPrice.toFixed(2)}
                    </span>
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <span>
                      GST(%):{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {invoice.GST + "%"}
                      </span>
                    </span>
                    <span>
                      Gross.DP:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {"₹" + invoice.GrosDPrice.toFixed(2)}
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
                    //   backgroundColor: "#f0f0f0",
                    //   background:
                    //     "radial-gradient(circle at center, #fff9c4 40%, #ffecb3 60%, #ffe0b2 80%)",
                    background:
                      "radial-gradient(circle at center, #81d4fa 40%, #80deea 60%, #80cbc4 80%)",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                  }}
                >
                  <span>
                    MRP:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {"₹" + invoice.CPrice.toFixed(2)}
                    </span>
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <span>
                      OFFER:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {"₹" + invoice.OFFER_DIS.toFixed(2)}
                      </span>
                    </span>
                    <span>
                      DIS.Amt:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        {"₹" + invoice.Disamt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceWiseStock;
