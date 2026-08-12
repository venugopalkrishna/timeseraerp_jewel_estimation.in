import React, { useEffect, useRef, useState } from "react";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import { CREATE_jwel, CREATE_jwel1 } from "../Config/Config";
import axios from "axios";
import { Button, Input, message, Select } from "antd";
import dayjs from "dayjs";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import EstimationPurchaseSelectDialog from "./EstimationPurchaseSelectDialog";
import CustomerInformation from "./CustomerInformation";
import { printReceipt } from "./eposPrint";
import { printReceiptModule2 } from "./eposPrintModel2";
import { PrintModule1 } from "./PrintModule1";
import { PrintModule2 } from "./PrintModule2";
import PrintTemplateDialog from "./PrintDialog";

const { Option } = Select;

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const emptyItemForm = {
  mainProduct: undefined,
  productName: "",
  gwt: "",
  touch: "",
  nwt: "",
  rate: "",
  amount: "",
  others: "",
  total: "",
};

/* ── shared styles ───────────────────────────────────────────────────────── */
const btnBase = {
  flex: 1,
  padding: "clamp(12px,3.4vw,15px) 0",
  borderRadius: 24,
  fontFamily: "'Work Sans', sans-serif",
  fontWeight: 700,
  fontSize: "clamp(14px,4vw,17px)",
  letterSpacing: 0.5,
  cursor: "pointer",
};

const btnOutlineGold = {
  ...btnBase,
  background: "transparent",
  border: "1.5px solid rgba(201,163,78,0.55)",
  color: "#F3D98B",
};

const btnSolidGold = {
  ...btnBase,
  background: "linear-gradient(180deg,#C9A34E,#A9843A)",
  border: "none",
  color: "#241B12",
  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
};

const btnOutlineCream = {
  ...btnBase,
  background: "transparent",
  border: "1.5px solid rgba(239,230,210,0.4)",
  color: "#EFE6D2",
};

const fieldLabelStyle = {
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#64748b",
  letterSpacing: 0.4,
};

const fieldInputStyle = {
  fontSize: "clamp(14px,3.6vw,16px)",
};

const readOnlyInputStyle = {
  textAlign: "right",
  background: "#f0fdf4",
  color: "#166534",
  fontWeight: 700,
  border: "1px solid #bbf7d0",
  fontSize: "clamp(14px,3.6vw,16px)",
};

const amtRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
};

const amtLabelStyle = {
  fontSize: "clamp(13px,3.4vw,15px)",
  color: "#8A2C3E",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const amtValueStyle = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  fontSize: "clamp(17px,4.6vw,21px)",
  color: "#241B12",
};

export default function EstimationScreen() {
  const imageUrls = (localStorage.getItem("images") || "").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");
  const userType = localStorage.getItem("userType");
  const localIp = localStorage.getItem("ipAddress");
  const printModel = localStorage.getItem("printModel");
  const pdfModule = localStorage.getItem("pdfModule");
  const loginName = localStorage.getItem("loginName");
  const [billDate] = useState(dayjs());

  const mainProductRef = useRef(null);
  const productNameRef = useRef(null);
  const gwtRef = useRef(null);
  const touchRef = useRef(null);
  const rateRef = useRef(null);
  const othersRef = useRef(null);
  const mobileRef = useRef(null);
  const searchRef = useRef(null);
  const saveRef = useRef(null);
  const scrollRef = useRef(null);

  const [tag, setTag] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [estimationNo, setEstimationNo] = useState();
  const [estNo, setEstNo] = useState();
  const [mainProducts, setMainProducts] = useState([]);
  const [ptaxPer, setPtaxPer] = useState(0);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [estimationSelectOpen, setEstimationSelectOpen] = useState(false);
  const [isEditingEstimation, setIsEditingEstimation] = useState(false);
  const [customerArea, setCustomerArea] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [storeDetails, setStoreDetails] = useState({});

  const [data, setData] = useState([]);

  const toggleDrawer = () => {
    setOpen(false);
  };

  const estimationNoAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTable?tableName=ESTIMATION_PURCHASES&column=ESTIMATIONNO`,
        { headers: { tenantName } },
      );
      const resData = response.data;
      if (Array.isArray(resData) && resData.length > 0) {
        const rawValue = resData[0]?.Column1;
        const maxNo = Number.isFinite(Number(rawValue)) ? Number(rawValue) : 0;
        const newNo = maxNo + 1;
        setEstimationNo(newNo);
        return newNo;
      }
    } catch (error) {
      console.error("Error fetching estimation purchase number:", error);
    }
  };

  const userAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=FIRM_CONFIGURE`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setStoreDetails(data[0]);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const mainProductAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/MasterMainProductList`,
        { headers: { tenantName } },
      );
      if (Array.isArray(response.data)) {
        setMainProducts(response.data.map((i) => i.MNAME));
      }
    } catch (error) {
      console.error("Error fetching main products:", error);
    }
  };

  const deleteEstimationPurchaseAPI = async (estNo) => {
    try {
      await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_PURCHASES&where=ESTIMATIONNO=${estNo}`,
        {},
        { headers: { tenantName } },
      );
    } catch (error) {
      console.error("Error deleting estimation purchase:", error);
    }
  };

  const handleEstimationSelect = async (group) => {
    setEstimationSelectOpen(false);

    const mappedItems = group.items.map((item, idx) => ({
      key: idx + 1,
      sno: idx + 1,
      mainProduct: item.Mname || "",
      productName: item.ProductName || "",
      gwt: item.Gwt ? String(item.Gwt) : "",
      touch: item.TOUCH ? String(item.TOUCH) : "",
      nwt: item.Nwt ? Number(item.Nwt).toFixed(3) : "",
      rate: item.Rate ? String(item.Rate) : "",
      amount: item.Amount ? Number(item.Amount).toFixed(2) : "",
      others: item.Others ? String(item.Others) : "",
      total: item.Total ? Number(item.Total).toFixed(2) : "",
    }));

    setData(mappedItems);
    setEstNo(group.estimationNo);
    setPtaxPer(group.ptaxPer || 0);
    setEditingIndex(-1);
    setItemForm(emptyItemForm);
    setIsEditingEstimation(true);

    setTimeout(() => mainProductRef.current?.focus(), 300);
  };

  const recalcItem = (next) => {
    const gwt = num(next.gwt);
    const touch = num(next.touch);
    const rate = num(next.rate);
    const others = num(next.others);
    const nwt = (gwt * touch) / 100;
    const amount = nwt * rate;
    const total = amount + others;
    return {
      ...next,
      nwt: nwt ? nwt.toFixed(3) : "",
      amount: amount ? amount.toFixed(2) : "",
      total: total ? total.toFixed(2) : "",
    };
  };

  const setItemField = (key, value) => {
    setItemForm((prev) => recalcItem({ ...prev, [key]: value }));
  };

  const focusNext = (ref) => {
    setTimeout(() => ref?.current?.focus?.(), 0);
  };

  const handleFieldKeyDown = (e, nextRef) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (nextRef) {
      focusNext(nextRef);
    } else {
      handleAddOrUpdateItem();
    }
  };

  const handleAddOrUpdateItem = () => {
    if (
      !itemForm.mainProduct ||
      !itemForm.productName ||
      !itemForm.gwt ||
      !itemForm.touch ||
      !itemForm.rate
    ) {
      messageApi.open({
        type: "error",
        content:
          "Please fill Main Product, Product Name, GWT, Touch % and Rate.",
      });
      return;
    }
    if (editingIndex >= 0) {
      setData((prev) =>
        prev.map((item, idx) =>
          idx === editingIndex ? { ...item, ...itemForm } : item,
        ),
      );
      setEditingIndex(-1);
      messageApi.open({ type: "success", content: "Item updated." });
    } else {
      setData((prev) => [
        ...prev,
        { key: prev.length + 1, sno: prev.length + 1, ...itemForm },
      ]);
      messageApi.open({ type: "success", content: "Item added." });
      // keep the newest card in view inside the scroll region
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 60);
    }
    setItemForm(emptyItemForm);
    focusNext(mainProductRef);
  };

  const handleEditRow = (index) => {
    setEditingIndex(index);
    setItemForm({ ...emptyItemForm, ...data[index] });
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    focusNext(mainProductRef);
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setItemForm(emptyItemForm);
  };

  const handleDeleteRow = (index) => {
    setData((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((item, i) => ({ ...item, sno: i + 1 }));
    });
    if (editingIndex === index) {
      handleCancelEdit();
    } else if (editingIndex > index) {
      setEditingIndex((e) => e - 1);
    }
  };

  // ── totals ───────────────────────────────────────────────────────────────
  const totals = data.reduce(
    (t, i) => ({
      gwt: t.gwt + num(i.gwt),
      nwt: t.nwt + num(i.nwt),
      others: t.others + num(i.others),
      total: t.total + num(i.total),
    }),
    { gwt: 0, nwt: 0, others: 0, total: 0 },
  );

  const grossAmt = +totals.total.toFixed(0);
  const ptaxAmount = +((grossAmt * num(ptaxPer)) / 100).toFixed(0);
  const netAmt = +(grossAmt + ptaxAmount).toFixed(0);

  // ── reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setData([]);
    setItemForm(emptyItemForm);
    setEditingIndex(-1);
    setPtaxPer(0);
    setIsEditingEstimation(false);
    setOpen(false);
    setRotating(true);
    setTimeout(() => setRotating(false), 1000);
    scrollRef.current?.scrollTo({ top: 0 });
    estimationNoAPI();
  };

  // ── save ─────────────────────────────────────────────────────────────────
  const handleSave = async (nextNo) => {
    if (!data?.length) {
      messageApi.open({
        type: "error",
        content: (
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            Please add item details.
          </span>
        ),
      });
      return;
    }
    setSaving(true);
    const estDate = new Date().toISOString();
    const billDateISO = billDate ? dayjs(billDate).toISOString() : estDate;

    const requestBody = data.map((item, index) => ({
      estimationNo: estNo ? Number(estNo) : Number(nextNo) || 0,
      sno: index + 1,
      mname: String(item?.mainProduct ?? "-"),
      productName: String(item?.productName ?? "-"),
      gwt: num(item?.gwt),
      wastage: 0,
      directwastage: 0,
      nwt: num(item?.nwt),
      rate: num(item?.rate),
      amount: num(item?.amount),
      others: num(item?.others),
      total: num(item?.total),
      ptaxper: num(ptaxPer),
      ptax: ptaxAmount,
      netAmt: netAmt,
      grossAmt: grossAmt,
      estDate: estDate,
      jewelType: "",
      billNo: "",
      billDate: billDateISO,
      type: "",
      less: 0,
      touch: num(item?.touch),
      purityloss: 0,
      finegold: 0,
      addwt: 0,
      converT22K: 0,
      goldwT22K: 0,
      custname: customerName || "",
      mobileno: customerMobile || "",
      city: customerArea || "",
    }));

    try {
      if (isEditingEstimation) {
        await deleteEstimationPurchaseAPI(estimationNo);
      }
      await axios.post(
        `${CREATE_jwel1}/api/Master/EstimationPurchasesInsert`,
        requestBody,
        { headers: { "Content-Type": "application/json", tenantName } },
      );
      messageApi.open({
        type: "success",
        content: "Estimation purchase saved successfully.",
      });
      handleReset();
    } catch (error) {
      console.error("Error saving estimation purchase:", error);
      messageApi.open({
        type: "error",
        content: (
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            Something went wrong while saving.
          </span>
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const iconBtnStyle = {
    width: "clamp(38px,10vw,46px)",
    height: "clamp(38px,10vw,46px)",
    flexShrink: 0,
    borderRadius: "10px",
    background: "rgba(239,230,210,0.08)",
    border: "1px solid rgba(239,230,210,0.18)",
    color: "#EFE6D2",
    fontSize: "clamp(17px,4.4vw,20px)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  useEffect(() => {
    estimationNoAPI();
    mainProductAPI();
    userAPI();
  }, []);

  const handleUserOk = () => {
    setCustomerOpen(true);
  };

  const handleUserCancel = () => {
    setCustomerOpen(false);
  };

  const handlePrintOk = () => {
    setPrintOpen(true);
  };

  const handlePrintCancel = () => {
    setPrintOpen(false);
  };

  const handleEposPrint = (est) => {
    const EstNo = estimationNo ? estimationNo : est;
    printReceipt(
      localIp,
      EstNo,
      userName,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      data,
      totals,
      grossAmt,
      netAmt,
      storeDetails,
    );
  };

  const handleEposPrintModule2 = (est) => {
    const EstNo = estimationNo ? estimationNo : est;
    printReceiptModule2(
      localIp,
      EstNo,
      userName,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      data,
      totals,
      grossAmt,
      netAmt,
      storeDetails,
    );
  };

  const handlePrintModule1 = (est) => {
    const EstNo = estimationNo ? estimationNo : est;
    PrintModule1(
      localIp,
      EstNo,
      userName,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      data,
      totals,
      grossAmt,
      netAmt,
      storeDetails,
    );
  };

  const handlePrintModule2 = (est) => {
    const EstNo = estimationNo ? estimationNo : est;
    PrintModule2(
      localIp,
      EstNo,
      userName,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      data,
      totals,
      grossAmt,
      netAmt,
      storeDetails,
    );
  };

  return (
    /* SHELL — locks the viewport height; only the middle region scrolls */
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#F6F1E8",
        fontFamily: "'Work Sans', sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {contextHolder}

      {/* ══ FIXED TOP ═══════════════════════════════════════════════════ */}
      <div style={{ flexShrink: 0, zIndex: 20 }}>
        <Header setOpen={setOpen} />
        <SidebarDrawer
          open={open}
          toggleDrawer={toggleDrawer}
          singleImage={singleImage}
          userArea={userArea}
          userName={userName}
        />

        {/* TITLE + ESTIMATE NO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding:
              "clamp(12px,3.4vw,20px) clamp(16px,5vw,28px) clamp(9px,2.6vw,14px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px,2.5vw,12px)",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "clamp(22px,6vw,30px)",
                background: "linear-gradient(180deg,#C9A34E,#8C6D2E)",
                borderRadius: "3px",
              }}
            />
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: "clamp(21px,5.8vw,29px)",
                color: "#241B12",
                letterSpacing: "0.2px",
                lineHeight: 1,
              }}
            >
              Purchase Estimation
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "clamp(10px,2.6vw,12px)",
                color: "#9C8B6F",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Estimate No.
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "3px",
                width: "clamp(48px,13vw,60px)",
                height: "clamp(48px,13vw,60px)",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 32% 28%,#7A2233,#4E1420)",
                boxShadow:
                  "0 4px 10px rgba(78,20,32,0.35), inset 0 0 0 2px rgba(201,163,78,0.55)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: "#F3D98B",
                  fontSize: "clamp(18px,4.6vw,22px)",
                }}
              >
                {estimationNo}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION CARD */}
        <div
          style={{
            margin: "0 clamp(16px,5vw,28px) clamp(12px,3vw,16px)",
            background: "#1B2A44",
            borderRadius: "18px",
            padding: "clamp(14px,3.8vw,20px) clamp(16px,4.5vw,24px)",
            boxShadow: "0 10px 24px rgba(27,42,68,0.28)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30px",
              right: "-30px",
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              background: "rgba(201,163,78,0.10)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-20px",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "rgba(201,163,78,0.07)",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px,2.6vw,12px)",
              position: "relative",
            }}
          >
            <button
              onClick={handleReset}
              style={{
                flex: 1.15,
                padding: "clamp(11px,3.2vw,14px) 0",
                background: "transparent",
                color: "#E9A6A6",
                border: "1.5px solid #7A3A3A",
                borderRadius: "10px",
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(14px,3.8vw,17px)",
                letterSpacing: "0.3px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>

            <div
              style={{
                width: "1px",
                alignSelf: "stretch",
                background: "rgba(239,230,210,0.15)",
                margin: "0 2px",
              }}
            />

            <button
              title="Quick fill"
              style={iconBtnStyle}
              onClick={() => setEstimationSelectOpen(true)}
            >
              ✨
            </button>
            <button
              title="Customer"
              style={iconBtnStyle}
              onClick={handleUserOk}
            >
              👤
            </button>
          </div>
        </div>
      </div>

      {/* ══ SCROLLABLE MIDDLE ═══════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          padding: "2px 0 clamp(14px,3.5vw,18px)",
        }}
      >
        {/* ENTRY FORM */}
        <div
          style={{
            margin: "0 clamp(16px,5vw,28px)",
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #e2e6ec",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 3,
              background:
                "linear-gradient(90deg,#7c3aed 0%,#2563eb 50%,#16a34a 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              padding: "12px 14px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 170,
                flex: "1 1 170px",
              }}
            >
              <span style={fieldLabelStyle}>
                MAIN PRODUCT <span style={{ color: "#dc2626" }}>*</span>
              </span>
              <Select
                ref={mainProductRef}
                showSearch
                allowClear
                placeholder="Main product"
                value={itemForm.mainProduct}
                style={{ width: "100%", fontSize: "clamp(14px,3.6vw,16px)" }}
                onChange={(v) => setItemField("mainProduct", v)}
                onKeyDown={(e) => handleFieldKeyDown(e, productNameRef)}
              >
                {mainProducts.map((p, i) => (
                  <Option key={i} value={p}>
                    {p}
                  </Option>
                ))}
              </Select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 190,
                flex: "1 1 190px",
              }}
            >
              <span style={fieldLabelStyle}>
                PRODUCT NAME <span style={{ color: "#dc2626" }}>*</span>
              </span>
              <Input
                ref={productNameRef}
                placeholder="Product name"
                value={itemForm.productName}
                onChange={(e) => setItemField("productName", e.target.value)}
                onKeyDown={(e) => handleFieldKeyDown(e, gwtRef)}
                style={fieldInputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 110px",
              }}
            >
              <span style={fieldLabelStyle}>
                GWT <span style={{ color: "#dc2626" }}>*</span>
              </span>
              <Input
                ref={gwtRef}
                placeholder="0.000"
                value={itemForm.gwt}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setItemField("gwt", e.target.value.replace(/[^0-9.]/g, ""))
                }
                onKeyDown={(e) => handleFieldKeyDown(e, touchRef)}
                style={{ ...fieldInputStyle, textAlign: "right" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 100px",
              }}
            >
              <span style={fieldLabelStyle}>
                TOUCH % <span style={{ color: "#dc2626" }}>*</span>
              </span>
              <Input
                ref={touchRef}
                placeholder="0.00"
                value={itemForm.touch}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setItemField("touch", e.target.value.replace(/[^0-9.]/g, ""))
                }
                onKeyDown={(e) => handleFieldKeyDown(e, rateRef)}
                style={{ ...fieldInputStyle, textAlign: "right" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 110px",
              }}
            >
              <span style={fieldLabelStyle}>NWT</span>
              <Input
                readOnly
                value={itemForm.nwt}
                placeholder="0.000"
                style={readOnlyInputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 110px",
              }}
            >
              <span style={fieldLabelStyle}>
                RATE <span style={{ color: "#dc2626" }}>*</span>
              </span>
              <Input
                ref={rateRef}
                placeholder="0.00"
                value={itemForm.rate}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setItemField("rate", e.target.value.replace(/[^0-9.]/g, ""))
                }
                onKeyDown={(e) => handleFieldKeyDown(e, othersRef)}
                style={{ ...fieldInputStyle, textAlign: "right" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 120px",
              }}
            >
              <span style={fieldLabelStyle}>AMOUNT</span>
              <Input
                readOnly
                value={itemForm.amount}
                placeholder="0.00"
                style={readOnlyInputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 110px",
              }}
            >
              <span style={fieldLabelStyle}>
                OTHERS{" "}
                <span style={{ fontWeight: 400, color: "#94a3b8" }}>
                  (optional)
                </span>
              </span>
              <Input
                ref={othersRef}
                placeholder="0.00"
                value={itemForm.others}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setItemField("others", e.target.value.replace(/[^0-9.]/g, ""))
                }
                onKeyDown={(e) => handleFieldKeyDown(e, null)}
                style={{ ...fieldInputStyle, textAlign: "right" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: "1 1 120px",
              }}
            >
              <span style={fieldLabelStyle}>TOTAL</span>
              <Input
                readOnly
                value={itemForm.total}
                placeholder="0.00"
                style={readOnlyInputStyle}
              />
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <Button
                type="primary"
                icon={editingIndex >= 0 ? <EditOutlined /> : <PlusOutlined />}
                onClick={handleAddOrUpdateItem}
                style={{
                  background: "#1e3a8a",
                  border: "none",
                  height: 36,
                  fontSize: "clamp(13px,3.4vw,15px)",
                }}
              >
                {editingIndex >= 0 ? "Update" : "Add"}
              </Button>
              {editingIndex >= 0 && (
                <Button
                  onClick={handleCancelEdit}
                  style={{ height: 36, fontSize: "clamp(13px,3.4vw,15px)" }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ITEM CARDS */}
        <div
          style={{
            margin: "clamp(14px,3.5vw,18px) clamp(16px,5vw,28px) 0",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(10px,2.8vw,14px)",
          }}
        >
          {data.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "clamp(18px,5vw,26px)",
                background: "#FBF8F1",
                border: "1.5px dashed #E4D6B0",
                borderRadius: 14,
                color: "#9C8B6F",
                fontSize: "clamp(13px,3.6vw,15px)",
              }}
            >
              No items yet. Fill the form above and tap Add.
            </div>
          )}

          {data.map((item, index) => (
            <div
              key={item.key ?? index}
              style={{
                background: "#FBF8F1",
                border: "1.5px solid #E4D6B0",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(36,27,18,0.06)",
                outline: editingIndex === index ? "2px solid #C9A34E" : "none",
              }}
            >
              {/* card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "clamp(9px,2.6vw,12px) clamp(11px,3vw,14px)",
                  background: "#1B2A44",
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 32% 28%,#7A2233,#4E1420)",
                    boxShadow: "inset 0 0 0 1.5px rgba(201,163,78,0.55)",
                    color: "#F3D98B",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.sno}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "clamp(14px,4vw,17px)",
                      color: "#EFE6D2",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.productName}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(10px,2.6vw,12px)",
                      color: "#C9A34E",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginTop: 1,
                    }}
                  >
                    {item.mainProduct}
                  </div>
                </div>

                <button
                  title="Edit item"
                  onClick={() => handleEditRow(index)}
                  style={{
                    ...iconBtnStyle,
                    width: 34,
                    height: 34,
                    fontSize: 15,
                  }}
                >
                  ✏️
                </button>
                <button
                  title="Delete item"
                  onClick={() => handleDeleteRow(index)}
                  style={{
                    ...iconBtnStyle,
                    width: 34,
                    height: 34,
                    fontSize: 15,
                    color: "#E9A6A6",
                    border: "1px solid rgba(233,166,166,0.35)",
                  }}
                >
                  🗑
                </button>
              </div>

              {/* card fields — same order as the form */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "clamp(7px,2vw,10px)",
                  padding: "clamp(10px,3vw,14px) clamp(11px,3vw,14px)",
                }}
              >
                {[
                  ["GWT", item.gwt || "0.000", false],
                  ["TOUCH %", item.touch || "0.00", false],
                  ["NWT", item.nwt || "0.000", true],
                  ["RATE", item.rate || "0.00", false],
                  ["AMOUNT", item.amount || "0.00", true],
                  ["OTHERS", item.others || "0.00", false],
                ].map(([label, value, green]) => (
                  <div
                    key={label}
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <span
                      style={{
                        fontSize: "clamp(9.5px,2.4vw,11px)",
                        fontWeight: 700,
                        color: "#9C8B6F",
                        letterSpacing: 0.6,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "clamp(14px,3.8vw,17px)",
                        color: green ? "#166534" : "#241B12",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* card total strip */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "clamp(8px,2.4vw,11px) clamp(11px,3vw,14px)",
                  background: "#EFE6D2",
                  borderTop: "1px dashed #C9A34E",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(11px,3vw,14px)",
                    fontWeight: 700,
                    color: "#8A2C3E",
                    letterSpacing: 0.8,
                  }}
                >
                  TOTAL
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "clamp(17px,4.6vw,21px)",
                    color: "#1B2A44",
                  }}
                >
                  {item.total || "0.00"}/-
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FIXED BOTTOM ════════════════════════════════════════════════ */}
      <div
        style={{
          flexShrink: 0,
          zIndex: 20,
          background: "#F6F1E8",
          boxShadow: "0 -6px 18px rgba(36,27,18,0.12)",
        }}
      >
        <div
          style={{
            margin: "clamp(10px,3vw,14px) clamp(16px,5vw,28px)",
            display: "flex",
            gap: "clamp(10px,3vw,14px)",
            alignItems: "stretch",
          }}
        >
          {/* weights */}
          <div
            style={{
              flex: 1,
              background: "#DCEAD9",
              border: "1.5px solid #7FA789",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#3F6F52",
                color: "#F3EFDD",
                textAlign: "center",
                fontWeight: 700,
                letterSpacing: 1.5,
                fontSize: "clamp(12px,3.4vw,14px)",
                padding: "clamp(6px,1.8vw,8px) 0",
              }}
            >
              TOTAL
            </div>
            <div
              style={{
                padding: "clamp(8px,2.4vw,12px) clamp(12px,3.5vw,16px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(4px,1.4vw,7px)",
              }}
            >
              {[
                ["Items", String(data.length)],
                ["Gross Wt", totals.gwt.toFixed(3)],
                ["Net Wt", totals.nwt.toFixed(3)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "clamp(12px,3.4vw,14px)",
                    color: "#2E4A34",
                  }}
                >
                  <span>{label}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(15px,4vw,17px)",
                      color: "#1B2A44",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* amounts */}
          {/* <div
            style={{
              flex: 1.15,
              background: "#FBF8F1",
              border: "1.5px solid #E4D6B0",
              borderRadius: 14,
              padding: "clamp(8px,2.4vw,12px) clamp(12px,3.5vw,16px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "clamp(6px,1.8vw,9px)",
            }}
          >
            {[
              ["Total Amt", grossAmt, false],
              ["Tax Amt", ptaxAmount, false],
              ["Net Amt", netAmt, true],
            ].map(([label, value, isNet]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderTop: isNet ? "1px dashed #E4D6B0" : "none",
                  paddingTop: isNet ? "clamp(5px,1.6vw,8px)" : 0,
                }}
              >
                <span
                  style={{
                    fontSize: isNet
                      ? "clamp(12px,3.3vw,14px)"
                      : "clamp(11px,3vw,13px)",
                    color: "#8A2C3E",
                    fontWeight: isNet ? 700 : 600,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: isNet ? 800 : 700,
                    fontSize: isNet
                      ? "clamp(17px,4.6vw,21px)"
                      : "clamp(15px,4vw,18px)",
                    color: isNet ? "#1B2A44" : "#241B12",
                  }}
                >
                  {value}/-
                </span>
              </div>
            ))}
          </div> */}
          <div
            style={{
              flex: 1.15,
              background: "#FBF8F1",
              border: "1.5px solid #E4D6B0",
              borderRadius: 14,
              padding: "clamp(8px,2.4vw,12px) clamp(12px,3.5vw,16px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "clamp(6px,1.8vw,9px)",
            }}
          >
            {/* Total Amt */}
            {/* <div style={amtRowStyle}>
              <span style={amtLabelStyle}>Total Amt</span>
              <span style={amtValueStyle}>{grossAmt}/-</span>
            </div> */}

            {/* Tax Amt — editable % */}
            {/* <div style={amtRowStyle}>
              <span
                style={{
                  ...amtLabelStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Tax
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "#fff",
                    border: "1.5px solid #E4D6B0",
                    borderRadius: 7,
                    overflow: "hidden",
                    height: "clamp(24px,6.4vw,28px)",
                  }}
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    value={ptaxPer}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "");
                      if (num(v) > 100) return;
                      setPtaxPer(v);
                    }}
                    style={{
                      width: "clamp(34px,9vw,42px)",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      textAlign: "right",
                      padding: "0 3px 0 6px",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "clamp(12px,3.2vw,14px)",
                      color: "#241B12",
                    }}
                  />
                  <span
                    style={{
                      paddingRight: 6,
                      fontSize: "clamp(10px,2.6vw,12px)",
                      fontWeight: 700,
                      color: "#9C8B6F",
                    }}
                  >
                    %
                  </span>
                </span>
              </span>
              <span style={amtValueStyle}>{ptaxAmount}/-</span>
            </div> */}

            {/* Net Amt */}
            <div
              style={{
                ...amtRowStyle,
                // borderTop: "1px dashed #E4D6B0",
                paddingTop: "clamp(5px,1.6vw,8px)",
              }}
            >
              <span
                style={{
                  ...amtLabelStyle,
                  fontSize: "clamp(13px,3.6vw,16px)",
                  fontWeight: 700,
                }}
              >
                Net Amt
              </span>
              <span
                style={{
                  ...amtValueStyle,
                  fontWeight: 800,
                  fontSize: "clamp(19px,5vw,24px)",
                  color: "#1B2A44",
                }}
              >
                {netAmt}/-
              </span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div
          style={{
            background: "#1B2A44",
            padding: "clamp(10px,3vw,14px) clamp(16px,5vw,28px)",
            paddingBottom:
              "calc(clamp(10px,3vw,14px) + env(safe-area-inset-bottom))",
            display: "flex",
            gap: "clamp(10px,3vw,14px)",
          }}
        >
          <button onClick={handleReset} style={btnOutlineGold}>
            New
          </button>
          <button
            ref={saveRef}
            onClick={async () => {
              const nextNo = await estimationNoAPI();
              await handleSave(nextNo);
            }}
            disabled={saving}
            style={{ ...btnSolidGold, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button style={btnOutlineCream} onClick={handlePrintOk}>
            Print
          </button>
        </div>
      </div>
      <CustomerInformation
        customerOpen={customerOpen}
        setCustomerOpen={setCustomerOpen}
        handleOk={handleUserOk}
        handleCancel={handleUserCancel}
        customerArea={customerArea}
        setCustomerArea={setCustomerArea}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerMobile={customerMobile}
        setCustomerMobile={setCustomerMobile}
      />
      <EstimationPurchaseSelectDialog
        open={estimationSelectOpen}
        onCancel={() => setEstimationSelectOpen(false)}
        onSelect={handleEstimationSelect}
      />
      <PrintTemplateDialog
        open={printOpen}
        onCancel={handlePrintCancel}
        handleEposPrint={handleEposPrint}
        handleEposPrintModule2={handleEposPrintModule2}
        handlePrintModule1={handlePrintModule1}
        handlePrintModule2={handlePrintModule2}
        handleSave={handleSave}
        pdfModule={pdfModule}
        estimationNo={estimationNoAPI}
      />
    </div>
  );
}
