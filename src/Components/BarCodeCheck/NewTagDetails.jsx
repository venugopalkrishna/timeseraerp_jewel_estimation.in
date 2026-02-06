// src/Components/Tag.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button, Drawer, Input, Modal, Radio, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import styles from "./newtagdetails.module.css";
import CloseIcon from "@mui/icons-material/Close";
import StonesDetailsDialog from "./StoneAdd";
import axios from "axios";
import dayjs from "dayjs";
import { CREATE_jwel } from "../Config/Config";

const { Option } = Select;

const Tag = ({
  homecloseDrawer,
  homeDrawerOpen,
  gstNo,
  billNo,
  invNo,
  setNewStonesData,
  newStonesData,
  selectTagMainProduct,
  setSelectTagMainProduct,
  selectTagProductName,
  setSelectTagProductName,
  tagPieces,
  setTagPieces,
  tagGwt,
  setTagGWt,
  tagLess,
  setTagLess,
  tagNwt,
  setTagNwt,
  selectTagPurity,
  setSelectTagPurity,
  tagHuid,
  setTagHuid,
  tagDesc,
  setTagDesc,
  tagWastage,
  setTagWastage,
  tagDirectWt,
  setTagDirectWt,
  tagTotalWt,
  setTagTotalWt,
  tagMaking,
  setTagMaking,
  tagDirectMc,
  setTagDirectMc,
  tagTotalMc,
  setTagTotalMc,
  stoneTotalPcs,
  setStoneTotalPcs,
  stoneTotalCts,
  setStoneTotalCts,
  stoneTotalGrams,
  setStoneTotalGrams,
  stoneTotalAmt,
  setStoneTotalAmt,
  stoneTotalNoPcs,
  setStoneTotalNoPcs,
  setStonesData,
  stonesData,
  setData,
  data,
  selectJewelType,
  tagProductCategory,
  setTagProductCategory,
  tagProductCode,
  setTagProductCode,
  tagCategoryName,
  setTagCategoryName,
  tagHsnCode,
  setTagHsnCode,
  stoneDiaCts,
  setStoneDiaCts,
  stoneDiaAmt,
  setStoneDiaAmt,
  tagBeadsLess,
  setTagBeadsLess,
  setTrayTagNo,
  trayTagNo,
  tray,
  setTray,
  messageApi,
  setSelectTagBrandName,
  selectTagBrandName,
  setTagBrandValue,
  tagBrandValue,
  setTagBrandAmt,
  tagBrandAmt,
}) => {
  // const [homeDrawerOpen, setHomeDrawerOpen] = useState(false);

  // const homecloseDrawer = () => setHomeDrawerOpen(false);

  const tenantName = localStorage.getItem("tenantName");
  const userName = localStorage.getItem("loginName");
  const selectTagMainProductRef = useRef(null);
  const selectTagProductNameRef = useRef(null);
  const modeOfPayRef = useRef(null);
  const tagPiecesRef = useRef(null);
  const tagGwtRef = useRef(null);
  const tagBeadsLessRef = useRef(null);
  const tagLessRef = useRef(null);
  const tagNwtRef = useRef(null);
  const selectTagPurityRef = useRef(null);
  const tagHuidRef = useRef(null);
  const tagDescRef = useRef(null);
  const tagWastageRef = useRef(null);
  const tagDirectWtRef = useRef(null);
  const tagTotalWtRef = useRef(null);
  const tagMakingRef = useRef(null);
  const tagDirectMcRef = useRef(null);
  const tagTotalMcRef = useRef(null);
  const submitBtnRef = useRef(null);
  const brandNameRef = useRef(null);
  const brandRateRef = useRef(null);
  const brandAmtRef = useRef(null);

  const [selectStoneItem, setSelectStoneItem] = useState(null);
  const [stoneItemCode, setStoneItemCode] = useState();
  const [stonePcs, setStonePcs] = useState();
  const [stoneCTS, setStoneCTS] = useState();
  const [stoneGrams, setStoneGrams] = useState();
  const [stoneRate, setStoneRate] = useState();
  const [stoneAmt, setStoneAmt] = useState(0);
  const [stoneNoPcs, setStoneNoPcs] = useState();
  const [stoneColour, setStoneColour] = useState();
  const [stoneCut, setStoneCut] = useState();
  const [stoneClarity, setStoneClarity] = useState();
  const [stoneDp, setStoneDp] = useState();
  const [stoneOpen, setStoneOpen] = useState(false);
  const [nextAppNumber, setNextAppNumber] = useState(1);
  const [mainProductData, setMainProductData] = useState([]);
  const [productNamesData, setProductNamesData] = useState([]);
  const [purityData, setPurityData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [brandDetailsData, setBrandDetailsData] = useState([]);
  const [tagRate, setTagRate] = useState(0);
  const [selectBrand, setSelectBrand] = useState("PIECE");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalGstAmount, setTotalGstAmount] = useState(0);
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [gstValue, setGstValue] = useState(0);

  const mainProductAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=JEWELTYPE_MAST`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setMainProductData(data);
      }
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const bradDetailsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=BRAND_MASTER`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const filtered = [
          ...new Map(
            data
              .filter(
                (item) =>
                  item.BrandName && // not null/undefined
                  item.BrandName.trim() !== "" &&
                  item.BrandName.trim() !== "-", // remove "-"
              )
              .map((item) => [item.BrandName.trim(), item]), // remove duplicates
          ).values(),
        ];

        setBrandDetailsData(filtered);
      }
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const productNameAPI = async (value) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=PRODUCT_MASTER&where=MNAME='${value}'&order=PRODUCTNAME`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setProductNamesData(data);
      }
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const gstAPI = async (value) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=MAIN_PRODUCT&where=MNAME='${value}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setGstValue(data[0]?.VAT);
      }
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const purityAPI = async (value) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=PREFIX_MASTER&where=MAINPRODUCT='${value}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setPurityData(data);
      }
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const todayRatesAPI = async (value) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE='${dayjs(
          "11/15/2025",
        ).format("MM/DD/YYYY")}' AND PREFIX='${value}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setTagRate(data[0]?.RATE || 0);
      }
    } catch (error) {
      console.error("Error fetching today rates:", error);
    }
  };
  const itemsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithOrder?tableName=ITEM_MASTER&order=ITEMNAME`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setItemsData(data);
      }
    } catch (error) {
      console.error("Error fetching account number:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectStoneItem) {
      Modal.warning({ title: "Please select Stone Item" });
      return;
    }

    const newEntry = {
      ITEMNAME: selectStoneItem || "",
      ITEMCODE: stoneItemCode || "",
      PIECES: stonePcs || 0,
      CTS: stoneCTS || 0,
      GRAMS: parseFloat(stoneGrams) || 0,
      RATE: stoneRate || 0,
      AMOUNT: stoneAmt || 0,
      NOPCS: stoneNoPcs || 0,
      COLOUR: stoneColour || "",
      CUT: stoneCut || "",
      CLARITY: stoneClarity || "",
      DP: stoneDp || "",
    };

    setNewStonesData((prev) => {
      const updatedData = [...prev, newEntry];
      const matchedItems = updatedData.filter((item) => {
        const matched = itemsData.find(
          (i) =>
            i.ITEMNAME === item.ITEMNAME &&
            (i.EFFECTON_GOLD === true || i.DIAMONDS === true),
        );
        return !!matched;
      });
      const diamondItems = updatedData.filter((item) => {
        const matched = itemsData.find(
          (i) => i.ITEMNAME === item.ITEMNAME && i.DIAMONDS === true,
        );
        return !!matched;
      });

      const diaCts = diamondItems.reduce(
        (sum, item) => sum + (parseFloat(item.CTS) || 0),
        0,
      );
      const diaAmount = diamondItems.reduce(
        (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
        0,
      );

      const totalCts = matchedItems.reduce(
        (sum, item) => sum + (parseFloat(item.CTS) || 0),
        0,
      );
      const totalGrams = matchedItems.reduce(
        (sum, item) => sum + (parseFloat(item.GRAMS) || 0),
        0,
      );
      const totalAmt = matchedItems.reduce(
        (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
        0,
      );
      const totalPcs = updatedData.reduce(
        (sum, item) => sum + (parseFloat(item.PIECES) || 0),
        0,
      );
      const totalNoPcs = updatedData.reduce(
        (sum, item) => sum + (parseFloat(item.NOPCS) || 0),
        0,
      );
      const ctsData = totalCts / 5 + totalGrams;
      const totalLess = ctsData + Number(tagBeadsLess);
      const less = totalLess?.toFixed(3);
      const nwt = Number(tagGwt) - less;
      const totNwt = nwt?.toFixed(3);

      setStoneTotalPcs(totalPcs);
      setStoneTotalCts(totalCts);
      setStoneTotalGrams(totalGrams);
      setStoneTotalAmt(totalAmt);
      setStoneTotalNoPcs(totalNoPcs);
      setStoneDiaCts(diaCts);
      setStoneDiaAmt(diaAmount);
      setTagLess(less);
      setTagNwt(totNwt);

      return updatedData;
    });

    setSelectStoneItem(null);
    setStoneItemCode();
    setStonePcs();
    setStoneCTS();
    setStoneGrams();
    setStoneRate();
    setStoneAmt(0);
    setStoneNoPcs();
    setStoneColour();
    setStoneCut();
    setStoneClarity();
    setStoneDp();
  };

  const handleTagDetailsSubmit = async (nextNo) => {
    if (!selectTagMainProduct) {
      Modal.warning({ title: "Please select Main Product" });
      return;
    }
    const safeNumber = (val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };
    const nwt = safeNumber(tagNwt ?? 0);
    const rate = safeNumber(tagRate ?? 0);
    const cattotwast = safeNumber(tagTotalWt ?? 0);
    const cattotMc = safeNumber(tagTotalMc ?? 0);
    const directWastage = safeNumber(tagDirectWt ?? 0);
    const directMc = safeNumber(tagDirectMc ?? 0);
    const stoneAmount = safeNumber(stoneTotalAmt ?? 0);
    const gst = gstValue;

    const wastageAmt = directWastage > 0 ? directWastage : cattotwast;
    const mcAmount = directMc > 0 ? directMc : cattotMc;

    const rateAmount = Number(nwt + wastageAmt).toFixed(3);
    const amount = Number(rateAmount * rate).toFixed(0);
    const mcStone = mcAmount + stoneAmount;

    const totalAmount = safeNumber(amount) + safeNumber(mcStone);
    const gstAmount = (totalAmount * gst) / 100;
    const netAmount = totalAmount + gstAmount;

    setData((prev) => {
      if (Number(trayTagNo) > 0) {
        const existingTag = prev.some(
          (item) => item.TAGNO === Number(trayTagNo),
        );

        if (existingTag) {
          messageApi.open({
            type: "error",
            content: (
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Tag <span style={{ color: "red" }}>{trayTagNo}</span> already
                existed
              </span>
            ),
          });
          return prev;
        }
      }

      const brandName =
        selectTagBrandName && selectBrand === "PIECE"
          ? "PIECE"
          : selectTagBrandName && selectBrand === "CALC"
            ? "WEIGHT"
            : "-";
      const newEntry = {
        APPCATEGORY: null,
        APPDate: null,
        APPINCHRG: null,
        APPNAME: null,
        APPSALESMAN: null,
        APPTIME: null,
        ASWT: 0,
        ATAGNO: null,
        BALPIECES: 0,
        BALWEIGHT: 0,
        BRANCHNAME: "-",
        BRANDAMT: Number(tagBrandAmt) || 0,
        BRANDCALC: brandName,
        BRANDCALCAMT: Number(tagBrandValue) || 0,
        BRANDNAME: String(selectTagBrandName),
        BSWT: Number(tagBeadsLess) || 0,
        CATEGORYNAME: "OTHERS",
        CATTOTMC: String(tagTotalMc) || "0",
        CATTOTWAST: String(tagTotalWt) || "0",
        CLOUD_UPLOAD: false,
        CNTCHARTDISPLAY: "-",
        COLORSTONES_AMOUNT: 0,
        COST_AMOUNT: 0,
        COST_CATEGORY: "-",
        COST_FTOUCH: 0,
        COST_GSTAMOUNT: 0,
        COST_GWT: 0,
        COST_LESS: 0,
        COST_MC: 0,
        COST_MCPER: 0,
        COST_NETAMT: 0,
        COST_NWT: 0,
        COST_PURERATE: null,
        COST_STAMT: 0,
        COST_TOTWAST: 0,
        COST_TOUCH: 0,
        COST_WASTAGE: 0,
        COUNTERNAME: "-",
        DEALERNAME: "-",
        DESC1: tagDesc || "-",
        DIRECTMC: String(tagDirectMc) || "0",
        DIRECTWASTAGE: String(tagDirectWt) || "0",
        DealerApprovals: false,
        Diamond_Amount: Number(stoneDiaAmt) || 0,
        FINERATE: 0,
        GOLD18K_WT: 0,
        GSTRATE: Number(gstValue),
        GWT: parseFloat(tagGwt) || 0,
        HSNCODE: String(tagHsnCode) || "0",
        HUID: tagHuid || "-",
        IMGPATH: "-",
        ISSBRANCHNAME: Number(nextNo) || 0, // ✅ same number as APPSALESMAN
        ISSDATE: null,
        ISSNO: null,
        ITEMCOST: 0,
        ITEM_TOTAMT: parseFloat(stoneTotalAmt) || 0,
        ITEM_TOTCTS: parseFloat(stoneTotalCts) || 0,
        ITEM_TOTGMS: parseFloat(stoneTotalGrams) || 0,
        ITEM_TOTNOPCS: Number(stoneTotalNoPcs) || 0,
        ITEM_TOTPIECES: Number(stoneTotalPcs) || 0,
        Item_Cts: 0,
        Item_Uncuts: 0,
        Item_diamonds: Number(stoneDiaCts) || 0,
        LABREPORT: false,
        LESS_WPER: 0,
        LOTNO: 0,
        MAKINGCHARGES: String(tagMaking) || "0",
        MNAME: selectTagMainProduct || "-",
        Manufacturer: "-",
        NETAMT: 0,
        NWT: parseFloat(tagNwt) || 0,
        ORGCATEGORY: "-",
        PIECES: tagPieces || 0,
        PREFIX: selectTagPurity || "-",
        PRODUCTCATEGORY: tagProductCategory || "-",
        PRODUCTCODE: tagProductCode || "-",
        PRODUCTNAME: selectTagProductName || "-",
        PURE_RATE: 0,
        RATE: tagRate || 0,
        RECBRANCHNAME: null,
        RECDATE: null,
        RECNO: null,
        RECYCLE: "YES",
        REGENRATE: "NO",
        SALE_AMOUNT: totalAmount,
        SALE_GSTAMOUNT: gstAmount,
        SALE_NETAMT: netAmount,
        SCHECK: false,
        STATUS: "-",
        SUSPENCE: "NO",
        TAGDATE: new Date().toISOString(),
        TAGNO: Number(trayTagNo) || 0,
        TAGSIZE: "-",
        TAGTIME: dayjs().format("hh:mm:ss A"),
        TRAY: tray || false,
        UNCUTS_AMOUNT: 0,
        UserId: userName || "-",
        VV: "-",
        WASTAGE: tagWastage || "0",
        diacts: Number(stoneDiaCts) || 0,
        diapcs: 0,
        lesscts: 0,
        stonewt: 0,
      };

      return [...prev, newEntry];
    });
    setSelectTagMainProduct(null);
    setSelectTagProductName(null);
    setTagPieces();
    setTagGWt(0);
    setTagLess(0);
    setTagNwt(0);
    setSelectTagPurity(null);
    setTagHuid();
    setTagDesc();
    setTagWastage(0);
    setTagDirectWt(0);
    setTagTotalWt(0);
    setTagMaking(0);
    setTagDirectMc(0);
    setTagTotalMc(0);
    setStoneTotalPcs();
    setStoneTotalCts();
    setStoneTotalGrams();
    setStoneTotalAmt();
    setStoneTotalNoPcs();
    setTagProductCategory();
    setTagProductCode();
    setTagCategoryName();
    setTagHsnCode();
    setTrayTagNo(0);
    setTray(false);
    setSelectBrand("PIECE");
    setTagBrandValue();
    setTagBrandAmt();
    setTagBeadsLess();
    setSelectTagBrandName(null);
    setStoneDiaCts();
    setStoneDiaAmt();
    setTotalAmount(0);
    setTotalGstAmount(0);
    setTotalNetAmount(0);
  };

  const handleStonesSubmit = async (nextNo) => {
    const newEntries = newStonesData.map((stone, index) => ({
      SNO: index + 1,
      TAGNO: 0,
      ITEMCODE: String(stone?.ITEMCODE) || "-",
      ITEMNAME: String(stone.ITEMNAME) || "-",
      PRODUCTCODE: String(tagProductCode) || "-",
      PRODUCTNAME: String(selectTagProductName) || "-",
      PRODUCTCATEGORY: String(tagProductCategory) || "-",
      MNAME: String(selectTagMainProduct) || "-",
      DNAME: "-",
      ISDIAMOND: false,
      BRANCHNAME: "-",
      RECBRANCHNAME: null,
      ISSBRANCHNAME: Number(nextNo) || 0,
      ISSNO: null,
      RECNO: null,
      ISSDATE: null,
      RECDATE: null,
      RATE: Number(stone.RATE) || 0,
      AMOUNT: Number(stone.AMOUNT) || 0,
      DAMT: 0,
      DPRICE: 0,
      PIECES: Number(stone.PIECES) || 0,
      NOPCS: Number(stone.NOPCS) || 0,
      CTS: Number(stone.CTS) || 0,
      GRMS: parseFloat(stone.GRAMS) || 0,
      COLOUR: String(stone.COLOUR) || "-",
      CUT: stone.CUT || "-",
      CLARITY: "-",
      SNO1: null,
      VV: null,
      countername: "-",
      CLOUD_UPLOAD: false,
    }));

    setStonesData((prev) => [...prev, ...newEntries]);
    setNewStonesData([]);
  };

  const handleDelete = (indexToDelete) => {
    setNewStonesData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(indexToDelete, 1);
      return updatedData;
    });
  };

  const handleAfterOpenChange = (visible) => {
    if (visible && selectTagMainProductRef.current) {
      // Give a tiny delay to ensure the element is rendered
      setTimeout(() => {
        selectTagMainProductRef.current.focus();
      }, 100);
    }
  };

  // 👇 Handle Enter key to jump to next field
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  useEffect(() => {
    mainProductAPI();
    itemsAPI();
    bradDetailsAPI();
  }, [selectJewelType]);

  useEffect(() => {
    if (selectTagBrandName && selectBrand === "PIECE") {
      const rate = tagBrandValue * tagPieces;
      setTagBrandAmt(rate);
    } else if (selectTagBrandName && selectBrand === "CALC") {
      const amount = tagBrandValue * tagNwt;
      setTagBrandAmt(amount);
    } else {
      setTagBrandAmt();
      setTagBrandValue();
    }
  }, [
    selectBrand,
    tagBrandValue,
    tagPieces,
    tagNwt,
    tagGwt,
    tagLess,
    selectTagBrandName,
  ]);
  useEffect(() => {
    const weight = (tagNwt * tagWastage) / 100;
    const totalWt = weight?.toFixed(3);
    setTagDirectWt(totalWt || 0);
    setTagTotalWt(totalWt || 0);
  }, [tagWastage, tagDirectWt]);

  useEffect(() => {
    const matchedItems = newStonesData.filter((item) => {
      const matched = itemsData.find(
        (i) =>
          i.ITEMNAME === item.ITEMNAME &&
          (i.EFFECTON_GOLD === true || i.DIAMONDS === true),
      );
      return !!matched;
    });
    const diamondItems = newStonesData.filter((item) => {
      const matched = itemsData.find(
        (i) => i.ITEMNAME === item.ITEMNAME && i.DIAMONDS === true,
      );
      return !!matched;
    });

    const diaCts = diamondItems.reduce(
      (sum, item) => sum + (parseFloat(item.CTS) || 0),
      0,
    );
    const diaAmount = diamondItems.reduce(
      (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
      0,
    );

    const totalCts = matchedItems.reduce(
      (sum, item) => sum + (parseFloat(item.CTS) || 0),
      0,
    );
    const totalGrams = matchedItems.reduce(
      (sum, item) => sum + (parseFloat(item.GRAMS) || 0),
      0,
    );
    const totalAmt = matchedItems.reduce(
      (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
      0,
    );
    const totalPcs = newStonesData.reduce(
      (sum, item) => sum + (parseFloat(item.PIECES) || 0),
      0,
    );
    const totalNoPcs = newStonesData.reduce(
      (sum, item) => sum + (parseFloat(item.NOPCS) || 0),
      0,
    );
    const ctsData = totalCts / 5 + totalGrams;
    const totalLess = ctsData + Number(tagBeadsLess);
    const less = totalLess?.toFixed(3);
    const nwt = Number(tagGwt) - less;
    const totNwt = nwt?.toFixed(3);

    setStoneTotalPcs(totalPcs);
    setStoneTotalCts(totalCts);
    setStoneTotalGrams(totalGrams);
    setStoneTotalAmt(totalAmt);
    setStoneTotalNoPcs(totalNoPcs);
    setStoneDiaCts(diaCts);
    setStoneDiaAmt(diaAmount);
    setTagLess(less);
    setTagNwt(totNwt);
  }, [newStonesData]);

  useEffect(() => {
    if (tagBrandAmt > 0) {
      const safeNumber = (val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      };
      const stoneAmount = safeNumber(stoneTotalAmt ?? 0);
      const totalAmt = stoneAmount + tagBrandAmt;

      const totalAmount = safeNumber(totalAmt);
      const gstAmount = (totalAmount * gstValue) / 100;
      const netAmount = totalAmount + gstAmount;
      setTotalAmount(totalAmount);
      setTotalGstAmount(gstAmount);
      setTotalNetAmount(netAmount);
    } else {
      const safeNumber = (val) => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      };

      const nwt = safeNumber(tagNwt ?? 0);
      const rate = safeNumber(tagRate ?? 0);
      const cattotwast = safeNumber(tagTotalWt ?? 0);
      const cattotMc = safeNumber(tagTotalMc ?? 0);
      const directWastage = safeNumber(tagDirectWt ?? 0);
      const directMc = safeNumber(tagDirectMc ?? 0);
      const stoneAmount = safeNumber(stoneTotalAmt ?? 0);

      const wastageAmt = directWastage > 0 ? directWastage : cattotwast;
      const mcAmount = directMc > 0 ? directMc : cattotMc;

      const rateAmount = Number(nwt + wastageAmt).toFixed(3);
      const amount = Number(rateAmount * rate).toFixed(0);
      const mcStone = mcAmount + stoneAmount;

      const totalAmount = safeNumber(amount) + safeNumber(mcStone);
      const gstAmount = (totalAmount * gstValue) / 100;
      const netAmount = totalAmount + gstAmount;
      setTotalAmount(totalAmount);
      setTotalGstAmount(gstAmount);
      setTotalNetAmount(netAmount);
    }
  }, [
    tagBrandAmt,
    stoneTotalAmt,
    tagNwt,
    tagRate,
    tagTotalWt,
    tagTotalMc,
    tagDirectWt,
    tagDirectMc,
  ]);

  return (
    <Drawer
      // title="Tag Details"
      title={
        <div style={{ position: "relative" }}>
          <strong
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              background: "#00e5ff",
              borderRadius: "8px",
              padding: "4px 8px",
            }}
          >
            Tag Details
          </strong>
          <CloseIcon
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#000",
            }}
            onClick={homecloseDrawer}
          />
        </div>
      }
      placement="bottom"
      onClose={() => {
        homecloseDrawer();
        setTray(false);
        // setTrayTagNo();
        // setSelectTagMainProduct();
        // setSelectTagProductName();
        // setSelectTagPurity();
        // setTagHuid();
        // setTagDesc();
        // setTagWastage();
        // setTagMaking();
      }}
      open={homeDrawerOpen}
      height="85%"
      closable={false}
      className={styles.drawer}
      afterOpenChange={handleAfterOpenChange}
    >
      <div className={styles.scrollArea}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <span className={styles.tagno}>
                {/* #{barCode?.TAGNO ? barCode?.TAGNO : "0"} */}
                {billNo ? billNo : invNo}
              </span>
              <br />
              <small className={styles.tagno}>Inv No</small>
            </div>
            <div className={styles.todayrates}>
              Today Rate
              <br />
              <span className={styles.amount}>
                ₹{Number(tagRate)?.toFixed(2)}
              </span>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.details}>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>MProduct</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span
                  style={{
                    flex: 1,
                    fontSize: "16px",
                    textAlign: "left",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  <Select
                    className={styles.dropdown2}
                    allowClear
                    showSearch
                    placeholder="Select Mode"
                    ref={selectTagMainProductRef}
                    value={selectTagMainProduct || null}
                    onChange={(value) => {
                      setSelectTagMainProduct(value);
                      productNameAPI(value);
                      gstAPI(value);
                      purityAPI(value);
                      setTimeout(() => {
                        selectTagProductNameRef?.current?.focus();
                      }, 0);
                    }}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const inputText = e.target.value?.toLowerCase() || "";
                        const filtered = mainProductData.filter((m) =>
                          m.MName.toLowerCase().includes(inputText),
                        );

                        if (filtered.length > 0) {
                          const selected = filtered[0].MName;
                          setSelectTagMainProduct(selected);
                          productNameAPI(selected);
                          gstAPI(selected);
                          purityAPI(selected);
                          setTimeout(() => {
                            selectTagProductNameRef?.current?.focus();
                          }, 0);
                        }
                      }
                    }}
                  >
                    {mainProductData.map((m, index) => (
                      <Option key={index} value={m.MName}>
                        {m.MName}
                      </Option>
                    ))}
                  </Select>
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>PName</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span
                  style={{
                    flex: 1,
                    fontSize: "16px",
                    textAlign: "left",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  <Select
                    className={styles.dropdown2}
                    allowClear
                    showSearch
                    disabled={!selectTagMainProduct}
                    placeholder="Select Name"
                    ref={selectTagProductNameRef}
                    value={selectTagProductName || null}
                    onChange={(value) => {
                      if (value) {
                        setSelectTagProductName(value);
                        const selectedproduct = productNamesData.find(
                          (item) => item.PRODUCTNAME === value,
                        );
                        if (selectedproduct) {
                          setTagProductCategory(
                            selectedproduct.PRODUCTCATEGORY,
                          );
                          setTagProductCode(selectedproduct.PRODUCTCODE);
                          setTagCategoryName(selectedproduct.CATEGORYNAME);
                          setTagHsnCode(selectedproduct.HSNCODE);
                        }
                      } else {
                        // ✅ Clear both values when cleared
                        setSelectTagProductName(null);
                        setTagProductCategory("");
                        setTagProductCode("");
                        setTagCategoryName();
                        setTagHsnCode("");
                      }
                      setTimeout(() => {
                        selectTagPurityRef?.current?.focus();
                      }, 0);
                    }}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const inputText = e.target.value?.toLowerCase() || "";
                        const filtered = productNamesData.filter((m) =>
                          m.PRODUCTNAME.toLowerCase().includes(inputText),
                        );

                        if (filtered.length > 0) {
                          const selected = filtered[0].PRODUCTNAME;
                          setSelectTagProductName(selected);
                          setTagProductCategory(selected.PRODUCTCATEGORY);
                          setTagProductCode(selected.PRODUCTCODE);
                          setTagCategoryName(selected.CATEGORYNAME);
                          setTagHsnCode(selected.HSNCODE);
                          setTimeout(() => {
                            selectTagPurityRef?.current?.focus();
                          }, 0);
                        }
                      }
                    }}
                  >
                    {productNamesData.map((p, index) => (
                      <Option key={index} value={p.PRODUCTNAME}>
                        {p.PRODUCTNAME}
                      </Option>
                    ))}
                  </Select>
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>Purity</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span
                  style={{
                    flex: 1,
                    fontSize: "16px",
                    textAlign: "left",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {/* {barCode?.PREFIX ? barCode?.PREFIX : "-"} */}
                  <Select
                    className={styles.dropdown2}
                    placeholder="Select Purity"
                    allowClear
                    showSearch
                    disabled={!selectTagMainProduct}
                    ref={selectTagPurityRef}
                    value={selectTagPurity || null}
                    onChange={(value) => {
                      setSelectTagPurity(value);
                      todayRatesAPI(value);
                      setTimeout(() => {
                        tagPiecesRef?.current?.focus();
                      }, 0);
                    }}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const inputText = e.target.value?.toLowerCase() || "";
                        const filtered = purityData.filter((m) =>
                          m.Prefix.toLowerCase().includes(inputText),
                        );

                        if (filtered.length > 0) {
                          const selected = filtered[0].Prefix;
                          setSelectTagPurity(selected);
                          todayRatesAPI(selected);
                          setTimeout(() => {
                            tagPiecesRef?.current?.focus();
                          }, 0);
                        }
                      }
                    }}
                  >
                    {purityData.map((p, index) => (
                      <Option key={index} value={p.Prefix}>
                        {p.Prefix}
                      </Option>
                    ))}
                  </Select>
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>Pieces</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  {/* {barCode?.PREFIX ? barCode?.PREFIX : "-"} */}
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="Pieces"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagPiecesRef}
                    value={tagPieces}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,0}$/.test(value) && value.length <= 15) {
                        setTagPieces(value);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagGwtRef);
                    }}
                  />
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>Gwt</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="GWT"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagGwtRef}
                    value={tagGwt}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                        setTagGWt(value);
                        setTagNwt(value - tagLess);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagBeadsLessRef);
                    }}
                  />
                </span>
              </div>
              {/* <div className={styles.rowTag2}>
                <span className={styles.label2}>Beads.Less</span>
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="Beads Less"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagBeadsLessRef}
                    value={tagBeadsLess}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                        setTagBeadsLess(value);
                        setTagLess(value);
                        const nwtData = tagGwt - value;
                        const totalNwtData = nwtData?.toFixed(3);
                        setTagNwt(totalNwtData);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagLessRef);
                    }}
                  />
                </span>
              </div> */}
              <div className={styles.rowTag2}>
                <span className={styles.label2}>Stone Wt</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="Stone Wt"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagLessRef}
                    value={tagLess}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                        setTagLess(value);
                        const nwtData = tagGwt - value;
                        const totalNwtData = nwtData?.toFixed(3);
                        setTagNwt(totalNwtData);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagNwtRef);
                    }}
                  />
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>Nwt</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="NWT"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagNwtRef}
                    value={tagNwt}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                        setTagNwt(value);
                        const lessData = tagGwt - value;
                        setTagLess(lessData);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagWastageRef);
                    }}
                  />
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>
                  VA(%){" "}
                  <input
                    type="text"
                    className={styles.piecesinput2}
                    disabled={!selectTagMainProduct}
                    placeholder="Wastage"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagWastageRef}
                    value={tagWastage}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,0}$/.test(value) && value.length <= 15) {
                        setTagWastage(value);
                        const weight = (tagNwt * value) / 100;
                        const totalWt = weight?.toFixed(3);
                        setTagDirectWt(totalWt);
                        setTagTotalWt(totalWt);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagTotalWtRef);
                    }}
                  />
                </span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="Total"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagTotalWtRef}
                    value={tagTotalWt}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,3}$/.test(value) && value.length <= 15) {
                        setTagTotalWt(value);
                        // setTagDirectWt();
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagMakingRef);
                    }}
                  />
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>
                  MC/g{" "}
                  <input
                    type="text"
                    className={styles.piecesinput2}
                    disabled={!selectTagMainProduct}
                    placeholder="Per Gm"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagMakingRef}
                    value={tagMaking}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,0}$/.test(value) && value.length <= 15) {
                        setTagMaking(value);
                        const making = tagNwt * value;
                        const totalMc = making?.toFixed(0);
                        setTagDirectMc(totalMc);
                        setTagTotalMc(totalMc);
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagTotalMcRef);
                    }}
                  />
                </span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="Total"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagTotalMcRef}
                    value={tagTotalMc}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ Allow only float numbers (digits + one optional dot)
                      if (/^\d*\.?\d{0,2}$/.test(value) && value.length <= 15) {
                        setTagTotalMc(value);
                        // setTagDirectWt();
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, submitBtnRef);
                    }}
                  />
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>HUID</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="HUID"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagHuidRef}
                    value={tagHuid}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTagHuid(value);
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagDescRef);
                    }}
                  />
                </span>
              </div>
              <div className={styles.rowTag2}>
                <span className={styles.label2}>Description</span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>
                  <input
                    type="text"
                    className={styles.piecesinput}
                    disabled={!selectTagMainProduct}
                    placeholder="Description"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={tagDescRef}
                    value={tagDesc}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTagDesc(value);
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagWastageRef);
                    }}
                  />
                </span>
              </div>

              <div className={styles.highlightBox2}>
                <span className={styles.label2}>Mteal Value </span>
                {/* <span className={styles.separator2}>:</span> */}
                <span className={styles.value2}>₹{tagNwt * tagRate || 0}</span>
              </div>
              {tray !== true ? (
                <>
                  <div className={styles.highlightBox1}>
                    <span className={styles.label2}>
                      Stone Cost
                      <span
                        style={{ color: "blue", cursor: "pointer" }}
                        ref={submitBtnRef}
                        onClick={() => {
                          setStoneOpen(true);
                        }}
                      >
                        (ADD+)
                      </span>
                      {/* )} */}
                    </span>
                    {/* <span className={styles.separator2}>:</span> */}
                    <span className={styles.value2}>
                      ₹{Number(stoneTotalAmt)?.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.diacontainer}>
                    <span>
                      Dia.Cts:{" "}
                      <span className={styles.dia}>
                        {Number(stoneDiaCts || 0)?.toFixed(3)}
                      </span>
                    </span>
                    <span>
                      Dia.Amt:{" "}
                      <span className={styles.dia}>
                        ₹{Number(stoneDiaAmt || 0)?.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                ""
              )}
              <div className={styles.brandcontainer}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div>
                      {/* <label style={{ color: "#006400" }}>▶ Location</label> */}
                      <Radio.Group
                        onChange={(e) => setSelectBrand(e.target.value)}
                        value={selectBrand}
                      >
                        <Radio value="PIECE">Piece</Radio>
                        <Radio value="CALC">Weight</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
                <span>
                  Brand.Name
                  <Select
                    allowClear
                    showSearch
                    disabled={!selectTagMainProduct}
                    placeholder="Select Brand Name"
                    ref={brandNameRef}
                    style={{
                      width: 150,
                      textAlign: "left",
                      //   flex: 1,
                      fontSize: "18px",
                      backgroundColor: "AppWorkspace",
                      marginLeft: "2px",
                    }}
                    value={selectTagBrandName || null}
                    onChange={(value) => {
                      setSelectTagBrandName(value);
                      if (value === "PIECE") {
                        setSelectBrand("PIECE");
                      } else if (value === "CALC") {
                        setSelectBrand("CALC");
                      } else {
                        setSelectBrand("PIECE");
                      }
                      setTimeout(() => {
                        brandRateRef?.current?.focus();
                      }, 0);
                    }}
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const inputText = e.target.value?.toLowerCase() || "";
                        const filtered = brandDetailsData.filter((m) =>
                          m.BrandName.toLowerCase().includes(inputText),
                        );

                        if (filtered.length > 0) {
                          const selected = filtered[0].BrandName;
                          setSelectTagBrandName(selected);
                          setTimeout(() => {
                            brandRateRef?.current?.focus();
                          }, 0);
                        }
                      }
                    }}
                  >
                    {brandDetailsData.map((p, index) => (
                      <Option key={index} value={p.BrandName}>
                        {p.BrandName}
                      </Option>
                    ))}
                  </Select>
                </span>
                <span>
                  Brand.Rate
                  <input
                    type="text"
                    style={{ width: 150, fontSize: "18px", marginLeft: "2px" }}
                    disabled={!selectTagMainProduct}
                    placeholder="Brand Rate"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={brandRateRef}
                    value={tagBrandValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value) && value.length <= 15) {
                        setTagBrandValue(value);
                        if (selectTagBrandName === "PIECE") {
                          const rate = value * tagPieces;
                          setTagBrandAmt(rate);
                        } else {
                          const amount = value * tagNwt;
                          setTagBrandAmt(amount);
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, brandAmtRef);
                    }}
                  />
                </span>
                <span>
                  Brand.Amt
                  <input
                    type="text"
                    // className={styles.piecesinput}
                    style={{ width: 150, fontSize: "18px", marginLeft: "2px" }}
                    disabled={!selectTagMainProduct}
                    placeholder="Brand.Amt"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    ref={brandAmtRef}
                    value={tagBrandAmt}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTagBrandAmt(value);
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, tagHuidRef);
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className={styles.header1}>
            <div>
              Total Amount
              <br />
              <span className={styles.amount1}>
                ₹{Number(totalAmount)?.toFixed(2)}
              </span>
            </div>
            <div>
              Gst @ 3 %
              <br />
              <span className={styles.amount5}>
                ₹{Number(totalGstAmount)?.toFixed(2)}
              </span>
            </div>
            <div>
              Net Amount
              <br />
              <span className={styles.amount1}>
                ₹{Number(totalNetAmount)?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: "right",
          marginTop: 10,
          display: "flex",
          justifyContent: "right",
          gap: "10px",
        }}
      >
        <Button
          onClick={() => {
            homecloseDrawer();
            // setTray(false);
            // setTrayTagNo();
            // setSelectTagMainProduct();
            // setSelectTagProductName();
            // setSelectTagPurity();
            // setTagHuid();
            // setTagDesc();
            // setTagWastage();
            // setTagMaking();
          }}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #BF092F",
            color: "#BF092F",
            borderRadius: "8px",
            width: 100,
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          // onClick={() => {
          //   handleStonesSubmit();
          //   handleTagDetailsSubmit();
          //   setNewHome(false);
          // }}
          onClick={() => {
            // ✅ Compute next number BEFORE calling both functions
            if (tray === true) {
              const nextNumber = 0;
              // ✅ Pass to both
              handleTagDetailsSubmit(nextNumber);
              handleStonesSubmit(nextNumber);
              setNextAppNumber(nextNumber);

              homecloseDrawer();
              setTray(false);
              setTrayTagNo(0);
            } else {
              const maxNumber =
                data.length > 0
                  ? Math.max(
                      ...data.map((item) =>
                        parseInt(item.ISSBRANCHNAME || 0, 10),
                      ),
                    )
                  : 0;
              const nextNumber = maxNumber + 1;

              // ✅ Pass to both
              handleTagDetailsSubmit(nextNumber);
              handleStonesSubmit(nextNumber);
              setNextAppNumber(nextNumber);

              homecloseDrawer();
              setTray(false);
              setTrayTagNo(0);
            }
          }}
          style={{
            width: 100,
            backgroundColor: "#006400",
            borderRadius: "8px",
          }}
        >
          Save
        </Button>
      </div>
      <StonesDetailsDialog
        stoneOpen={stoneOpen}
        setStoneOpen={setStoneOpen}
        selectStoneItem={selectStoneItem}
        setSelectStoneItem={setSelectStoneItem}
        stonePcs={stonePcs}
        setStonePcs={setStonePcs}
        stoneCTS={stoneCTS}
        setStoneCTS={setStoneCTS}
        stoneGrams={stoneGrams}
        setStoneGrams={setStoneGrams}
        stoneRate={stoneRate}
        setStoneRate={setStoneRate}
        stoneAmt={stoneAmt}
        setStoneAmt={setStoneAmt}
        stoneNoPcs={stoneNoPcs}
        setStoneNoPcs={setStoneNoPcs}
        stoneColour={stoneColour}
        setStoneColour={setStoneColour}
        stoneCut={stoneCut}
        setStoneCut={setStoneCut}
        stoneClarity={stoneClarity}
        setStoneClarity={setStoneClarity}
        stoneDp={stoneDp}
        setStoneDp={setStoneDp}
        handleSubmit={handleSubmit}
        setStoneItemCode={setStoneItemCode}
        stoneItemCode={stoneItemCode}
        setItemsData={setItemsData}
        itemsData={itemsData}
        newStonesData={newStonesData}
        handleDelete={handleDelete}
      />
    </Drawer>
  );
};

export default Tag;
