import { DeleteOutlined, ScanOutlined } from "@ant-design/icons";
import AutoFixHighSharpIcon from "@mui/icons-material/AutoFixHighSharp";
import CloseIcon from "@mui/icons-material/Close";
import ContactPhoneSharpIcon from "@mui/icons-material/ContactPhoneSharp";
import { Box } from "@mui/material";
import { Button, Input, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./BarCodeCheck.module.css";
import CustomerInformation from "./CustomerInformation";
import { printReceipt } from "./eposPrint";
import { printReceiptModule2 } from "./eposPrintModel2";
import ImageDialog from "./ImageDialog";
import ModifyEstNo from "./ModifyEstNo";
import PrintTemplateDialog from "./PrintDialog";
import StonesDetailsDialog from "./StonesDetailsDialog";
import WastageDialog from "./WastageDialog";
import MakingChargesDialog from "./MakingChargesDialog";
import { PrintModule1 } from "./PrintModule1";
import { PrintModule2 } from "./PrintModule2";
import Tag from "./NewTagDetails";

const BarCodeCheck = () => {
  const tagNoRef = useRef(null);
  const submitRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [barCode, setBarCode] = useState();
  const [barCodeData, setBarCodeData] = useState([]);
  const [stonesData, setStonesData] = useState([]);
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGwt, setTotalGwt] = useState(0);
  const [totalNwt, setTotalNwt] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [totalGstAmt, setTotalGstAmt] = useState(0);
  const [totalNwtAmt, setTotalNwtAmt] = useState(0);
  const [totalWastAmt, setTotalWastAmt] = useState(0);
  const [totalMcAmt, setTotalMcAmt] = useState(0);
  const [totalItemCtsAmt, setTotalItemCtsAmt] = useState(0);
  const [totalItemDiaAmt, setTotalItemDiaAmt] = useState(0);
  const [totalItemUncAmt, setTotalItemUncAmt] = useState(0);
  const [totalDiamondAmt, setTotalDiamondAmt] = useState(0);
  const [gstNo, setGstNo] = useState(0);
  const [totalPurAmt, setTotalPurAmt] = useState(0);
  const [totalPurGstAmt, setTotalPurGstAmt] = useState(0);
  const [totalPurNwtAmt, setTotalPurNwtAmt] = useState(0);
  const [totalStoneAmt, setTotalStoneAmt] = useState(0);
  const [wastageData, setWastageData] = useState([]);
  const [wastageOpen, setWastageOpen] = useState(false);
  const [wastageTagNo, setWastageTagNo] = useState();
  const [wastageHomeKey, setWastageHomeKey] = useState();
  const [mcData, setMcData] = useState([]);
  const [mcOpen, setMcOpen] = useState(false);
  const [mcTagNo, setMcTagNo] = useState();
  const [mcHomeKey, setMcHomeKey] = useState();
  const [totalAmounts, setTotalAmounts] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [estNo, setEstNo] = useState();
  const [tagNo, setTagNo] = useState();
  const [modifyCode, setModifyCode] = useState();
  const [modifyOpen, setModifyOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stoneNo, setStoneNo] = useState();
  const [customerArea, setCustomerArea] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [changeCard, setChangeCard] = useState(true);
  const [stonesOpen, setStonesOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [photo, setPhoto] = useState();
  const [homeDrawerOpen, setHomeDrawerOpen] = useState(false);
  const [gst, setGst] = useState(0);
  const [newStonesData, setNewStonesData] = useState([]);
  const [selectTagMainProduct, setSelectTagMainProduct] = useState(null);
  const [selectTagProductName, setSelectTagProductName] = useState(null);
  const [tagPieces, setTagPieces] = useState();
  const [tagGwt, setTagGWt] = useState(0);
  const [tagLess, setTagLess] = useState(0);
  const [tagNwt, setTagNwt] = useState(0);
  const [selectTagPurity, setSelectTagPurity] = useState(null);
  const [tagHuid, setTagHuid] = useState();
  const [tagDesc, setTagDesc] = useState();
  const [tagWastage, setTagWastage] = useState(0);
  const [tagDirectWt, setTagDirectWt] = useState(0);
  const [tagTotalWt, setTagTotalWt] = useState(0);
  const [tagMaking, setTagMaking] = useState(0);
  const [tagDirectMc, setTagDirectMc] = useState(0);
  const [tagTotalMc, setTagTotalMc] = useState(0);
  const [stoneTotalPcs, setStoneTotalPcs] = useState();
  const [stoneTotalCts, setStoneTotalCts] = useState();
  const [stoneTotalGrams, setStoneTotalGrams] = useState();
  const [stoneTotalAmt, setStoneTotalAmt] = useState();
  const [stoneTotalNoPcs, setStoneTotalNoPcs] = useState();
  const [stoneDiaCts, setStoneDiaCts] = useState();
  const [stoneDiaAmt, setStoneDiaAmt] = useState();
  const [tagBeadsLess, setTagBeadsLess] = useState();
  const [tagProductCategory, setTagProductCategory] = useState();
  const [tagProductCode, setTagProductCode] = useState();
  const [tagCategoryName, setTagCategoryName] = useState();
  const [tagHsnCode, setTagHsnCode] = useState();
  const [tray, setTray] = useState(false);
  const [trayTagNo, setTrayTagNo] = useState(0);
  const [selectTagBrandName, setSelectTagBrandName] = useState(null);
  const [tagBrandValue, setTagBrandValue] = useState();
  const [tagBrandAmt, setTagBrandAmt] = useState();

  const html5QrCodeRef = useRef(null);
  const scannedRef = useRef(false);

  const imageUrls = localStorage.getItem("images").split(",");
  const imagesData = imageUrls;
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");
  const userType = localStorage.getItem("userType");
  const localIp = localStorage.getItem("ipAddress");
  const printModel = localStorage.getItem("printModel");
  const loginName = localStorage.getItem("loginName");
  const wastMc = localStorage.getItem("wastMc");
  const pdfModule = localStorage.getItem("pdfModule");
  const wastValue = localStorage.getItem("wastValue");
  const homeFilesomeDrawer = () => setHomeDrawerOpen(true);
  const homecloseDrawer = () => setHomeDrawerOpen(false);

  const toggleDrawer = () => {
    setOpen(false);
  };

  const estimationNo = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTable?tableName=ESTIMATION_MAST&column=ESTIMATIONNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      // Axios already returns parsed JSON under response.data
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const rawValue = data[0]?.Column1;
        const maxEstimationNo = Number.isFinite(Number(rawValue))
          ? Number(rawValue)
          : 0;
        const newEstimationNo = maxEstimationNo + 1;
        setEstNo(newEstimationNo);
        return newEstimationNo;
      }
    } catch (error) {
      console.error("Error fetching estimation number:", error);
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

  const tagNoAPI = async (tagNo) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGNO=${
          barCode ? barCode : tagNo
        }`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      // if (tagNo) {
      //   messageApi.open({
      //     type: "success",
      //     content: (
      //       <span style={{ fontSize: "20px", fontWeight: "bold" }}>
      //         Tag{" "}
      //         <span style={{ color: "red" }}>{response.data[0]?.TAGNO}</span>{" "}
      //         Scan Successfully
      //       </span>
      //     ),
      //   });
      // }
      if (!Array.isArray(data) || data.length === 0) {
        messageApi.open({
          type: "warning",
          content: "Tag Not existed",
        });
        return null;
      }

      const newTag = data[0]?.TAGNO;

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

        const wastageAmt = directWastage > 0 ? directWastage : cattotwast;
        const mcAmount = directMc > 0 ? directMc : cattotMc;

        const rateAmount = Number(nwt + wastageAmt).toFixed(3);
        const amount = Number(rateAmount * rate).toFixed(0);
        const mcStone = mcAmount + stoneAmount;

        const totalAmount = safeNumber(amount) + safeNumber(mcStone);
        const gstAmount = (totalAmount * gstNo) / 100;
        const netAmount = totalAmount + gstAmount;

        return {
          TAGNO: item?.TAGNO ?? "",
          ISSBRANCHNAME: item?.ISSBRANCHNAME ?? "",
          TOTALAMT: totalAmount,
          GSTTOTALAMT: gstAmount,
          NETAMT: netAmount,
        };
      });

      setTotalAmounts((prevData) => {
        // Collect all existing TAGNOs from previous state
        const existingTags = new Set(prevData.map((item) => item.TAGNO));

        // Only keep new ones that are not already added
        const filteredData = modifiedTotalData.filter(
          (item) => !existingTags.has(item.TAGNO),
        );

        if (filteredData.length === 0) {
          return prevData; // no update, keep old state
        }

        // Return updated array
        return [...prevData, ...filteredData];
      });

      setBarCodeData((prevData) => {
        const existingTag = prevData.some((item) => item.TAGNO === newTag);

        if (existingTag) {
          messageApi.open({
            type: "error",
            content: (
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Tag <span style={{ color: "red" }}>{newTag}</span> already
                existed
              </span>
            ),
          });
          return prevData;
        }
        if (tagNo && scannedRef?.current === true) {
          messageApi.open({
            type: "success",
            content: (
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                Tag <span style={{ color: "red" }}>{newTag}</span> Scan
                Successfully
              </span>
            ),
          });
        }
        const updatedData = [...prevData, ...data];

        const pcs = updatedData.reduce(
          (sum, item) => sum + (item.PIECES || 0),
          0,
        );
        const gwt = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.GWT) || 0),
          0,
        );
        const nwt = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.NWT) || 0),
          0,
        );
        // const totalAmount = updatedData.reduce(
        //   (sum, item) => sum + (parseFloat(item.SALE_AMOUNT) || 0),
        //   0
        // );
        // const totalGstAmount = updatedData.reduce(
        //   (sum, item) => sum + (parseFloat(item.SALE_GSTAMOUNT) || 0),
        //   0
        // );
        // const totalNwtAmount = updatedData.reduce(
        //   (sum, item) => sum + (parseFloat(item.SALE_NETAMT) || 0),
        //   0
        // );
        const totalWastAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.CATTOTWAST) || 0),
          0,
        );
        const totalMcAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.CATTOTMC) || 0),
          0,
        );
        const totalCtsAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Item_Cts) || 0),
          0,
        );
        const totalUnCutsAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Item_Uncuts) || 0),
          0,
        );
        const totalItemDiaAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Item_diamonds) || 0),
          0,
        );
        const totalDiamondAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Diamond_Amount) || 0),
          0,
        );

        const totalPurAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.COST_AMOUNT) || 0),
          0,
        );
        const totalPurGstAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.COST_GSTAMOUNT) || 0),
          0,
        );
        const totalPurNwtAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.COST_NETAMOUNT) || 0),
          0,
        );

        setTotalPcs(pcs);
        setTotalGwt(gwt);
        setTotalNwt(nwt);
        // setTotalAmt(totalAmount);
        // setTotalGstAmt(totalGstAmount);
        // setTotalNwtAmt(totalNwtAmount);
        setTotalWastAmt(totalWastAmount);
        setTotalMcAmt(totalMcAmount);
        setTotalItemCtsAmt(totalCtsAmount);
        setTotalItemUncAmt(totalUnCutsAmount);
        setTotalItemDiaAmt(totalItemDiaAmount);
        setTotalDiamondAmt(totalDiamondAmount);
        setGstNo(updatedData[0]?.GSTRATE);
        setTotalPurAmt(totalPurAmount);
        setTotalPurGstAmt(totalPurGstAmount);
        setTotalPurNwtAmt(totalPurNwtAmount);

        return updatedData;
      });
      setBarCode();
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const stonesDetailsAPI = async (tagNo) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_ITEMS&where=TAGNO=${
          barCode ? barCode : tagNo
        }`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      // if (!Array.isArray(data) || data.length === 0) {
      //   messageApi.open({
      //     type: "warning",
      //     content: "Tag Not existed",
      //   });
      //   return null;
      // }

      setStonesData((prevData) => {
        const existingTags = prevData.map((item) => item.TAGNO);

        const filteredData = data.filter(
          (item) => !existingTags.includes(item.TAGNO),
        );

        if (filteredData.length === 0) {
          // message.error("All these tag numbers already existed");
          return prevData;
        }

        const updatedData = [...prevData, ...data];

        const totalStoneAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
          0,
        );

        setTotalStoneAmt(totalStoneAmount);

        return updatedData;
      });
      setBarCode();
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const grandTotalAmount = totalAmt + totalGstAmt;
  const date = new Date();

  const createEstimationData = async (est) => {
    const requestBody = barCodeData.map((item, index) => {
      let matchedStone;
      let matched;
      let matchedMc;
      let matchedTotals;
      if (item.TAGNO > 0) {
        matched = wastageData.find((w) => w.TAGNO === item?.TAGNO);
        matchedMc = mcData.find((mc) => mc.TAGNO === item?.TAGNO);
        matchedTotals = totalAmounts.find((tot) => tot.TAGNO === item.TAGNO);
        matchedStone = stonesData.filter((stone) => stone.TAGNO === item.TAGNO);
      } else {
        matched = wastageData.find(
          (item) => item.ISSBRANCHNAME === item?.ISSBRANCHNAME,
        );
        matchedMc = mcData.find(
          (item) => item.ISSBRANCHNAME === item.ISSBRANCHNAME,
        );
        matchedStone = stonesData.filter(
          (item) => item.ISSBRANCHNAME === item?.ISSBRANCHNAME,
        );
        matchedTotals = totalAmounts.find(
          (tot) => tot.ISSBRANCHNAME === item.ISSBRANCHNAME,
        );
      }
      const totalStoneAmount = matchedStone.reduce(
        (sum, item) => sum + (Number(item?.AMOUNT) || 0),
        0,
      );
      return {
        estimationNo: String(tagNo ? tagNo : (est ?? "-")), // always a string
        tagNo: Number(item?.TAGNO ?? 0),
        mname: String(item?.MNAME ?? "-"),
        productName: String(item?.PRODUCTNAME ?? "-"),
        pieces: Number(item?.PIECES ?? 0),
        gwt: Number(item?.GWT ?? 0),
        nwt: Number(item?.NWT ?? 0),
        categoryName: String(item?.CATEGORYNAME ?? "-"),
        wastage: String(matched?.WASTAGE ?? item?.WASTAGE ?? "-"),
        directWastage: String(matched?.DIRECTWT ?? item?.DIRECTWASTAGE ?? "-"),
        cattotwast: String(matched?.TOTALWT ?? item?.CATTOTWAST ?? "-"),
        makingCharges: String(
          matchedMc?.MAKINGCHARGES ?? item?.MAKINGCHARGES ?? "-",
        ),
        directMc: String(matchedMc?.DIRECTAMT ?? item?.DIRECTMC ?? "-"),
        cattotMc: String(matchedMc?.TOTALAMT ?? item?.CATTOTMC ?? "-"),
        brandName: String(item?.BRANDNAME ?? "-"),
        brandAmt: Number(item?.BRANDAMT ?? 0),
        amount: Number(matchedTotals?.TOTALAMT ?? 0),
        itemamt: Number(totalStoneAmount?.toFixed(0) ?? item?.ITEM_TOTAMT ?? 0),
        totamt: Number(matchedTotals?.NETAMT ?? 0),
        estDate: new Date().toISOString(),
        estTime: new Date().toISOString(),
        rate: Number(item?.RATE ?? 0),
        homekey: Number(item?.ISSBRANCHNAME),
        tray: false,
        tagDate: new Date().toISOString(),
        dealerName: String(item?.DEALERNAME ?? "-"),
        productCategory: String(item?.PRODUCTCATEGORY ?? "-"),
        productCode: String(item?.PRODUCTCODE ?? "-"),
        counterName: String(item?.COUNTERNAME ?? "-"),
        prefix: String(item?.PREFIX ?? "-"),
        suspence: String(item?.SUSPENCE ?? "-"),
        smCode: "APP",
        less_Wper: Number(item?.LESS_WPER ?? 0),
        disAmt: 0,
        descrption: "-",
        iteM_CTS: Number(item?.Item_Cts ?? 0),
        iteM_DIAMONDS: Number(item?.Item_diamonds ?? 0),
        iteM_UNCUTS: Number(item?.Item_Uncuts ?? 0),
        diamonD_AMOUNT: Number(item?.Diamond_Amount ?? 0),
        labreport: false,
        huid: String(item?.HUID ?? "-"),
        tagsize: String(item?.TAGSIZE ?? "-"),
        hsncode: String(item?.HSNCODE ?? "-"),
        pvalue: Number(item?.GSTRATE),
        purchno: 0,
        pamt: Number(item?.FINERATE),
      };
    });
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/EstimationDataMultiInsert`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationMast = async (est) => {
    const requestBody = {
      estimationNo: String(tagNo ? tagNo : est),
      gold: 0,
      platinum: 0,
      silver: 0,
      pure: 0,
      nonKDM: 0,
      cT_18: 0,
      grandTotal: Number(grandTotalAmount),
      vatAmt: Number(totalGstAmt),
      grossAmt: Number(grandTotalAmount),
      discountPer: 0,
      discountAmt: 0,
      netAmt: Number(grandTotalAmount),
      estDate: new Date().toISOString(),
      estTime: new Date().toISOString(),
      totPces: Number(totalPcs),
      gwt: Number(totalGwt),
      nwt: Number(totalNwt),
      watage: Number(totalWastAmt),
      totMc: Number(totalMcAmt),
      totAmount: Number(totalAmt),
      itemAmount: Number(totalStoneAmt),
      custName: customerName,
      jewelType: barCodeData[0]?.MNAME,
      billNo: 0,
      saleCode: 0,
      e_PREFIX: "-",
      smCode: "-",
      descrption: "-",
      iteM_CTS: Number(totalItemCtsAmt),
      iteM_DIAMONDS: Number(totalItemDiaAmt),
      iteM_UNCUTS: Number(totalItemUncAmt),
      diamonD_AMOUNT: Number(totalDiamondAmt),
      exciseduty: 0,
      exciseamount: 0,
      totadvance: 0,
      totpaid: 0,
      totbalance: 0,
      purchamt: 0,
      city: customerArea,
      mobileno: customerMobile,
      purchno: 0,
      pamt: 0,
    };

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/EstimationMastInsert`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
      estimationNo();
      setModifyCode();
      handleReset();
      setTagNo();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationItems = async (est) => {
    const requestBody = stonesData.map((item, index) => {
      return {
        estimationNo: String(tagNo ? tagNo : est),
        tagNo: Number(item?.TAGNO) || 0,
        sno: item?.SNO,
        itemName: item?.ITEMNAME,
        pieces: Number(item?.PIECES) || 0,
        cts: Number(item?.CTS) || 0,
        grms: Number(item?.GRMS) || 0,
        rate: Number(item?.RATE) || 0,
        amount: Number(item?.AMOUNT) || 0,
        noPcs: Number(item?.NOPCS) || 0,
        colour: item?.COLOUR,
        cut: item?.CUT,
        clarity: item?.CLARITY,
        homeKey: Number(item?.ISSBRANCHNAME),
      };
    });

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/EstimationItemsMultiInsert`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
      // window.location.reload();
      // handleReset();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationNoDataAPI = async () => {
    try {
      let whereCondition = "";
      if (modifyCode) {
        whereCondition = `ESTIMATIONNO='${modifyCode}'`;
      }

      const params = {
        tableName: "ESTIMATION_DATA",
        where: whereCondition,
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
        {
          params,
          headers: { tenantName },
        },
      );

      const data = response.data;
      const modifiedData = data.map((item, index) => {
        const nwt = Number(item?.Nwt) || 0;
        const wastage = Number(item?.Wastage) || 0;
        return {
          TAGNO: item?.TagNo ?? 0,
          ISSBRANCHNAME: item?.ISSBRANCHNAME ?? "",
          NWT: nwt,
          WASTAGE: wastage ? wastage.toString() : "",
          DIRECTWT: item?.DirectWastage,
          TOTALWT:
            wastage > 0
              ? Number((nwt * wastage) / 100)
              : (item?.DirectWastage ?? 0),
        };
      });

      const modifiedMcData = data.map((item, index) => {
        const nwt = Number(item?.Nwt) || 0;
        const making = Number(item?.MakingCharges) || 0;
        return {
          TAGNO: item?.TagNo ?? 0,
          ISSBRANCHNAME: item?.ISSBRANCHNAME ?? "",
          NWT: nwt,
          MAKINGCHARGES: making ? making.toString() : "",
          DIRECTAMT: item?.DirectMc,
          TOTALAMT: making > 0 ? Number(nwt * making) : (item?.DirectMc ?? 0),
        };
      });

      const modifiedTotalData = data.map((item) => {
        const safeNumber = (val) => {
          const num = Number(val);
          return isNaN(num) ? 0 : num;
        };
        // ✅ Normalize all numeric fields
        const nwt = safeNumber(item?.Nwt ?? 0);
        const rate = safeNumber(item?.Rate ?? 0);
        const cattotwast = safeNumber(item?.Cattotwast ?? 0);
        const cattotMc = safeNumber(item?.CattotMc ?? 0);
        const directWastage = safeNumber(item?.DirectWastage ?? 0);
        const directMc = safeNumber(item?.DirectMc ?? 0);
        const stoneAmount = safeNumber(item?.Itemamt ?? 0);

        const wastageAmt = directWastage > 0 ? directWastage : cattotwast;
        const mcAmount = directMc > 0 ? directMc : cattotMc;

        const rateAmount = Number(nwt + wastageAmt).toFixed(3);
        const amount = Number(rateAmount * rate).toFixed(0);
        const mcStone = mcAmount + stoneAmount;

        const totalAmount = safeNumber(amount) + safeNumber(mcStone);
        const gstAmount = (totalAmount * item?.PVALUE) / 100;
        const netAmount = totalAmount + gstAmount;

        return {
          TAGNO: item?.TagNo ?? "",
          ISSBRANCHNAME: item?.ISSBRANCHNAME ?? "",
          TOTALAMT: totalAmount,
          GSTTOTALAMT: gstAmount,
          NETAMT: netAmount,
        };
      });

      if (Array.isArray(data) && data.length > 0) {
        handleModifyCancel();
        setModifyCode();

        setTotalAmounts((prevData) => {
          const existingTags = prevData.map((item) => item.TAGNO);

          const filteredData = modifiedTotalData.filter(
            (item) => !existingTags.includes(item.TAGNO),
          );

          if (filteredData.length === 0) {
            // message.error("All these tag numbers already existed");
            return prevData;
          }

          const updatedData = [...prevData, ...modifiedTotalData];

          return updatedData;
        });

        setWastageData((prevData) => {
          const existingTags = prevData.map((item) => item.TAGNO);

          const filteredData = modifiedData.filter(
            (item) => !existingTags.includes(item.TAGNO),
          );

          if (filteredData.length === 0) {
            // message.error("All these tag numbers already existed");
            return prevData;
          }

          const updatedData = [...prevData, ...modifiedData];

          return updatedData;
        });

        setMcData((prevData) => {
          const existingTags = prevData.map((item) => item.TAGNO);

          const filteredData = modifiedMcData.filter(
            (item) => !existingTags.includes(item.TAGNO),
          );

          if (filteredData.length === 0) {
            // message.error("All these tag numbers already existed");
            return prevData;
          }

          const updatedData = [...prevData, ...modifiedMcData];

          return updatedData;
        });

        // ✅ Loop through each row and call both APIs sequentially
        // for (const item of data) {
        //   const tagNo = item.TAGNO || item.TagNo; // handle both possible cases
        //   if (tagNo) {
        //     try {
        //       await tagNoAPI(tagNo);
        //       // await stonesDetailsAPI(tagNo);
        //     } catch (err) {
        //       console.error(`Error processing TagNo ${tagNo}:`, err);
        //     }
        //   }
        // }
        const updatedData = data.map((item, index) => ({
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
          BRANDAMT: Number(item?.BrandAmt) || 0,
          BRANDCALC: "-",
          BRANDCALCAMT: 0,
          BRANDNAME: item?.BrandName || "-",
          BSWT: 0,
          CATEGORYNAME: item?.CategoryName || "-",
          CATTOTMC: String(item?.CattotMc) || "0",
          CATTOTWAST: String(item?.Cattotwast) || "0",
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
          DEALERNAME: String(item?.DealerName) || "-",
          DESC1: "-",
          DIRECTMC: Number(item?.DirectMc) || "0",
          DIRECTWASTAGE: Number(item?.DirectWastage) || "0",
          DealerApprovals: false,
          Diamond_Amount: Number(item?.DIAMOND_AMOUNT) || 0,
          FINERATE: Number(item?.PAMT) || 0,
          GOLD18K_WT: 0,
          GSTRATE: Number(item?.PVALUE),
          GWT: parseFloat(item?.Gwt) || 0,
          HSNCODE: String(item?.HSNCODE) || "0",
          HUID: item?.HUID || "-",
          IMGPATH: "-",
          ISSBRANCHNAME: Number(item?.Homekey), // ✅ same number as APPSALESMAN
          ISSDATE: null,
          ISSNO: null,
          ITEMCOST: 0,
          ITEM_TOTAMT: parseFloat(item?.Itemamt) || 0,
          ITEM_TOTCTS: 0,
          ITEM_TOTGMS: 0,
          ITEM_TOTNOPCS: 0,
          ITEM_TOTPIECES: 0,
          Item_Cts: Number(item?.ITEM_CTS) || 0,
          Item_Uncuts: Number(item?.ITEM_UNCUTS) || 0,
          Item_diamonds: Number(item?.ITEM_DIAMONDS) || 0,
          LABREPORT: false,
          LESS_WPER: Number(item?.Less_Wper) || 0,
          LOTNO: 0,
          MAKINGCHARGES: String(item?.MakingCharges) || "0",
          MNAME: String(item?.Mname) || "-",
          Manufacturer: "-",
          NETAMT: 0,
          NWT: parseFloat(item?.Nwt) || 0,
          ORGCATEGORY: "-",
          PIECES: Number(item?.Pieces) || 0,
          PREFIX: String(item?.Prefix) || "-",
          PRODUCTCATEGORY: String(item?.ProductCategory) || "-",
          PRODUCTCODE: String(item?.ProductCode) || "-",
          PRODUCTNAME: String(item?.ProductName) || "-",
          PURE_RATE: 0,
          RATE: Number(item?.Rate) || 0,
          RECBRANCHNAME: null,
          RECDATE: null,
          RECNO: null,
          RECYCLE: "YES",
          REGENRATE: "NO",
          SALE_AMOUNT: 0,
          SALE_GSTAMOUNT: 0,
          SALE_NETAMT: 0,
          SCHECK: false,
          SMCODE: item?.SMCode ?? "-",
          STATUS: "-",
          SUSPENCE: "NO",
          TAGDATE: item?.TagDate || date.toISOString(),
          TAGNO: Number(item?.TagNo) || 0,
          TAGSIZE: item?.tagsize || "-",
          TAGTIME: dayjs().format("hh:mm:ss A"),
          TRAY: item?.Tray || false,
          UNCUTS_AMOUNT: 0,
          UserId: item?.UName || "-",
          VV: "-",
          WASTAGE: String(item?.Wastage) || "0",
          diacts: 0,
          diapcs: 0,
          lesscts: 0,
          stonewt: 0,
        }));
        setBarCodeData(updatedData);
      }
    } catch (error) {
      console.error("Error fetching estimation data:", error);
    }
  };

  const estimationNoMastAPI = async () => {
    try {
      let whereCondition = "";
      if (modifyCode) {
        whereCondition = `ESTIMATIONNO='${modifyCode}'`;
      }

      const params = {
        tableName: "ESTIMATION_MAST",
        where: whereCondition,
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
        {
          params,
          headers: { tenantName },
        },
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setCustomerName(data[0]?.CustName);
        setCustomerMobile(data[0]?.MOBILENO);
        setCustomerArea(data[0]?.CITY);
        setTotalAmt(data[0]?.TotAmount);
        setTotalGstAmt(data[0]?.VatAmt);
        setTotalNwtAmt(data[0]?.NetAmt);
      }
    } catch (error) {
      console.error("Error fetching estimation data:", error);
    }
  };

  const estimationNoItemsAPI = async () => {
    try {
      let whereCondition = "";
      if (modifyCode) {
        whereCondition = `ESTIMATIONNO='${modifyCode}'`;
      }

      const params = {
        tableName: "ESTIMATION_ITEMS",
        where: whereCondition,
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
        {
          params,
          headers: { tenantName },
        },
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const updatedData = data.map((item, index) => ({
          AMOUNT: item?.Amount,
          BRANCHNAME: null,
          CLARITY: "-",
          CLOUD_UPLOAD: false,
          COLOUR: item?.Colour,
          CTS: item?.Cts ?? 0,
          CUT: item?.Cut ?? "-",
          DAMT: 0,
          DNAME: "-",
          DPRICE: 0,
          GRMS: item?.Grms ?? 0,
          ISDIAMOND: false,
          ISSBRANCHNAME: null,
          ISSDATE: null,
          ISSNO: null,
          ITEMCODE: "-",
          ITEMNAME: item?.ItemName,
          MNAME: "-",
          NOPCS: item?.NoPcs ?? 0,
          PIECES: item?.pieces ?? 0,
          PRODUCTCATEGORY: "-",
          PRODUCTCODE: "-",
          PRODUCTNAME: "-",
          RATE: item?.Rate ?? 0,
          RECBRANCHNAME: null,
          RECDATE: null,
          RECNO: null,
          SNO: item?.Sno,
          SNO1: null,
          TAGNO: item?.TagNo,
          VV: null,
          countername: "-",
        }));
        setStonesData(updatedData);
      }
    } catch (error) {
      console.error("Error fetching estimation data:", error);
    }
  };

  const estimationDeleteData = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_DATA&where=ESTIMATIONNO='${tagNo}'`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteMast = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_MAST&where=ESTIMATIONNO='${tagNo}'`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteItems = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_ITEMS&where=ESTIMATIONNO='${tagNo}'`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
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

  const SCAN_COOLDOWN_MS = 1000;

  const startScanner = async () => {
    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      };

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (scannedRef.current) return;

          scannedRef.current = true;

          try {
            await tagNoAPI(decodedText);
            await stonesDetailsAPI(decodedText);
          } catch (err) {
            console.error("Scan handling error:", err);
          }

          setTimeout(() => {
            scannedRef.current = false;
          }, SCAN_COOLDOWN_MS);
        },
        (error) => {
          console.warn("QR Scan Error:", error);
        },
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        html5QrCodeRef.current = null;
        setQrOpen(false);
        scannedRef.current = false;
      }
    } else {
      setQrOpen(false);
      scannedRef.current = false;
    }
  };
  const num = (v) => Number.parseFloat(v) || 0;

  // useEffect(() => {
  //   const pcs = barCodeData.reduce((sum, item) => sum + (item.PIECES || 0), 0);
  //   const gwt = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.GWT) || 0),
  //     0,
  //   );
  //   const nwt = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.NWT) || 0),
  //     0,
  //   );
  //   const totalAmount = totalAmounts.reduce(
  //     (sum, item) => sum + (parseFloat(item.TOTALAMT) || 0),
  //     0,
  //   );
  //   const totalGstAmount = totalAmounts.reduce(
  //     (sum, item) => sum + (parseFloat(item.GSTTOTALAMT) || 0),
  //     0,
  //   );
  //   const totalNwtAmount = totalAmounts.reduce(
  //     (sum, item) => sum + (parseFloat(item.NETAMT) || 0),
  //     0,
  //   );
  //   const totWastAmount = wastageData.reduce(
  //     (sum, item) => sum + (parseFloat(item.TOTALWT) || 0),
  //     0,
  //   );
  //   const totDirectWast = wastageData.reduce(
  //     (sum, item) => sum + (parseFloat(item.DIRECTWT) || 0),
  //     0,
  //   );
  //   const totMcAmount = mcData.reduce(
  //     (sum, item) => sum + (parseFloat(item.TOTALAMT) || 0),
  //     0,
  //   );
  //   const totDirectMc = mcData.reduce(
  //     (sum, item) => sum + (parseFloat(item.DIRECTAMT) || 0),
  //     0,
  //   );
  //   const totalWastAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.CATTOTWAST) || 0),
  //     0,
  //   );
  //   const totalMcAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.CATTOTMC) || 0),
  //     0,
  //   );
  //   const totalCtsAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.Item_Cts) || 0),
  //     0,
  //   );
  //   const totalUnCutsAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.Item_Uncuts) || 0),
  //     0,
  //   );
  //   const totalItemDiaAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.Item_diamonds) || 0),
  //     0,
  //   );
  //   const totalDiamondAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.Diamond_Amount) || 0),
  //     0,
  //   );

  //   const totalPurAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.COST_AMOUNT) || 0),
  //     0,
  //   );
  //   const totalPurGstAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.COST_GSTAMOUNT) || 0),
  //     0,
  //   );
  //   const totalPurNwtAmount = barCodeData.reduce(
  //     (sum, item) => sum + (parseFloat(item.COST_NETAMOUNT) || 0),
  //     0,
  //   );
  //   const totalStoneAmount = stonesData.reduce(
  //     (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
  //     0,
  //   );

  //   setTotalStoneAmt(totalStoneAmount);

  //   setTotalPcs(pcs);
  //   setTotalGwt(gwt);
  //   setTotalNwt(nwt);
  //   setTotalAmt(totalAmount);
  //   setTotalGstAmt(totalGstAmount);
  //   setTotalNwtAmt(totalNwtAmount);
  //   setTotalWastAmt(totWastAmount ? totWastAmount : totalWastAmount);
  //   setTotalMcAmt(totMcAmount ? totMcAmount : totalMcAmount);
  //   setTotalItemCtsAmt(totalCtsAmount);
  //   setTotalItemUncAmt(totalUnCutsAmount);
  //   setTotalItemDiaAmt(totalItemDiaAmount);
  //   setTotalDiamondAmt(totalDiamondAmount);
  //   setGstNo(barCodeData[0]?.GSTRATE);
  //   setTotalPurAmt(totalPurAmount);
  //   setTotalPurGstAmt(totalPurGstAmount);
  //   setTotalPurNwtAmt(totalPurNwtAmount);
  // }, [barCodeData, stonesData, totalAmounts, wastageData, mcData]);

  useEffect(() => {
    if (!barCodeData?.length) return;

    const pcs = barCodeData.reduce((s, i) => s + num(i.PIECES), 0);
    const gwt = barCodeData.reduce((s, i) => s + num(i.GWT), 0);
    const nwt = barCodeData.reduce((s, i) => s + num(i.NWT), 0);

    const totalAmount = totalAmounts.reduce((s, i) => s + num(i.TOTALAMT), 0);
    const totalGstAmount = totalAmounts.reduce(
      (s, i) => s + num(i.GSTTOTALAMT),
      0,
    );
    const totalNwtAmount = totalAmounts.reduce((s, i) => s + num(i.NETAMT), 0);

    const totWastAmount = wastageData.reduce((s, i) => s + num(i.TOTALWT), 0);
    const totMcAmount = mcData.reduce((s, i) => s + num(i.TOTALAMT), 0);

    const totalWastAmount = barCodeData.reduce(
      (s, i) => s + num(i.CATTOTWAST),
      0,
    );
    const totalMcAmount = barCodeData.reduce((s, i) => s + num(i.CATTOTMC), 0);

    const totalCtsAmount = barCodeData.reduce((s, i) => s + num(i.Item_Cts), 0);
    const totalUnCutsAmount = barCodeData.reduce(
      (s, i) => s + num(i.Item_Uncuts),
      0,
    );
    const totalItemDiaAmount = barCodeData.reduce(
      (s, i) => s + num(i.Item_diamonds),
      0,
    );
    const totalDiamondAmount = barCodeData.reduce(
      (s, i) => s + num(i.Diamond_Amount),
      0,
    );

    const totalPurAmount = barCodeData.reduce(
      (s, i) => s + num(i.COST_AMOUNT),
      0,
    );
    const totalPurGstAmount = barCodeData.reduce(
      (s, i) => s + num(i.COST_GSTAMOUNT),
      0,
    );
    const totalPurNwtAmount = barCodeData.reduce(
      (s, i) => s + num(i.COST_NETAMOUNT),
      0,
    );

    const totalStoneAmount = stonesData.reduce((s, i) => s + num(i.AMOUNT), 0);

    setTotalStoneAmt(totalStoneAmount);
    setTotalPcs(pcs);
    setTotalGwt(gwt);
    setTotalNwt(nwt);
    setTotalAmt(totalAmount);
    setTotalGstAmt(totalGstAmount);
    setTotalNwtAmt(totalNwtAmount);
    setTotalWastAmt(totWastAmount || totalWastAmount);
    setTotalMcAmt(totMcAmount || totalMcAmount);
    setTotalItemCtsAmt(totalCtsAmount);
    setTotalItemUncAmt(totalUnCutsAmount);
    setTotalItemDiaAmt(totalItemDiaAmount);
    setTotalDiamondAmt(totalDiamondAmount);
    setGstNo(barCodeData[0]?.GSTRATE || 0);
    setTotalPurAmt(totalPurAmount);
    setTotalPurGstAmt(totalPurGstAmount);
    setTotalPurNwtAmt(totalPurNwtAmount);
  }, [barCodeData, stonesData, totalAmounts, wastageData, mcData]);

  const handleDelete = (indexToDelete) => {
    setBarCodeData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(indexToDelete, 1);
      return updatedData;
    });
  };

  const handleStonesDelete = (tagNo) => {
    setStonesData((prevData) => {
      return prevData.filter((stone) => stone.TAGNO !== tagNo);
    });
  };

  const handleWastageDelete = (tagNo) => {
    setWastageData((prevData) => {
      return prevData.filter((wast) => wast.TAGNO !== tagNo);
    });
  };

  const handleMcDelete = (tagNo) => {
    setMcData((prevData) => {
      return prevData.filter((wast) => wast.TAGNO !== tagNo);
    });
  };

  const handleTotalsDelete = (tagNo) => {
    setTotalAmounts((prevData) => {
      return prevData.filter((wast) => wast.TAGNO !== tagNo);
    });
  };

  const handleOpenScanner = () => {
    setQrOpen(true);
    setTimeout(() => startScanner(), 300); // give DOM time to mount
  };

  const handleOk = (tagNo) => {
    setStonesOpen(true);
    setStoneNo(tagNo);
  };

  const handleCancel = () => {
    setStonesOpen(false);
  };

  const handlePrintOk = () => {
    setPrintOpen(true);
  };

  const handlePrintCancel = () => {
    setPrintOpen(false);
  };

  const handleUserOk = () => {
    setCustomerOpen(true);
  };

  const handleUserCancel = () => {
    setCustomerOpen(false);
  };

  const handleReset = () => {
    setBarCode("");
    setBarCodeData([]);
    setStonesData([]);
    setTotalPcs(0);
    setTotalGwt(0);
    setTotalNwt(0);
    setTotalAmt(0);
    setTotalGstAmt(0);
    setTotalNwtAmt(0);
    setTotalWastAmt(0);
    setTotalMcAmt(0);
    setTotalItemCtsAmt(0);
    setTotalItemUncAmt(0);
    setTotalItemDiaAmt(0);
    setTotalDiamondAmt(0);
    setTotalPurAmt(0);
    setTotalPurGstAmt(0);
    setTotalPurNwtAmt(0);
    setTotalStoneAmt(0);
    setModifyCode();
    setModifyOpen(false);
    setPhoto();
    setCustomerName("");
    setCustomerMobile("");
    setCustomerArea("");
    setWastageData([]);
    setWastageOpen(false);
    setWastageTagNo();
    setMcData([]);
    setMcOpen(false);
    setMcTagNo();
    setTotalAmounts([]);
    estimationNo();
    setItemsData([]);
  };

  const handleImageOk = (image) => {
    setImageOpen(true);
    setPhoto(image);
  };

  const handleImageCancel = () => {
    setImageOpen(false);
    setPhoto();
  };

  const handleModifyOpen = () => {
    setModifyOpen(true);
  };

  const handleModifyCancel = () => {
    setModifyOpen(false);
  };

  const handleWastageOpen = (item) => {
    const nwt = Number(item?.NWT) || 0;
    const wastage = Number(item?.WASTAGE) || 0;

    const newEntry = {
      TAGNO: item?.TAGNO ?? 0,
      ISSBRANCHNAME: item?.ISSBRANCHNAME ?? "",
      NWT: nwt,
      WASTAGE: wastage ? wastage.toString() : "",
      DIRECTWT: Number(item?.DIRECTWASTAGE) ?? 0,
      TOTALWT: Number((nwt * wastage) / 100),
    };

    setWastageOpen(true);
    setWastageData((prevData) => {
      const existingTags = prevData.map((wast) => wast.TAGNO);

      if (existingTags.includes(newEntry.TAGNO)) {
        return prevData;
      }

      return [...prevData, newEntry];
    });
  };

  const handleWastageCancel = () => {
    setWastageOpen(false);
  };

  const handleMcOpen = (item) => {
    const nwt = Number(item?.NWT) || 0;
    const mc = Number(item?.MAKINGCHARGES) || 0;

    const newEntry = {
      TAGNO: item?.TAGNO ?? 0,
      ISSBRANCHNAME: item?.ISSBRANCHNAME ?? "",
      NWT: nwt,
      MAKINGCHARGES: mc ? mc.toString() : "",
      DIRECTAMT: Number(item?.DIRECTMC) ?? 0,
      TOTALAMT: Number(nwt * mc),
    };

    setMcOpen(true);
    setMcData((prevData) => {
      const existingTags = prevData.map((mc) => mc.TAGNO);

      if (existingTags.includes(newEntry.TAGNO)) {
        return prevData;
      }

      return [...prevData, newEntry];
    });
  };

  const handleMcCancel = () => {
    setMcOpen(false);
  };

  // useEffect(() => {
  //   userAPI();
  // }, []);

  const handleTagNoKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitRef.current?.click();
    }
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
    estimationNo();
    itemsAPI();
  }, []);

  useEffect(() => {
    if (!barCodeData.length) return;

    const perData = barCodeData.map((barCode) => {
      const matched = wastageData.find((item) => item.TAGNO === barCode.TAGNO);
      const matchedMc = mcData.find((item) => item.TAGNO === barCode.TAGNO);
      const matchedStone = stonesData.filter(
        (item) => item.TAGNO === barCode.TAGNO,
      );
      const totalStoneAmount = matchedStone.reduce(
        (sum, item) => sum + (Number(item?.AMOUNT) || 0),
        0,
      );

      const wastageAmt = matched?.TOTALWT
        ? Number(matched.TOTALWT)
        : Number(barCode.CATTOTWAST ?? 0);
      const mcAmount = matchedMc?.TOTALAMT
        ? Number(matchedMc.TOTALAMT)
        : Number(barCode.CATTOTMC ?? 0);
      const stoneAmount = Number(totalStoneAmount ?? 0);
      const rateAmount =
        (Number(barCode.NWT ?? 0) + wastageAmt) * Number(barCode.RATE ?? 0);
      const totalAmount = rateAmount + mcAmount + stoneAmount;
      const gstAmount = (totalAmount * barCode?.GSTRATE) / 100;
      const netAmount = totalAmount + gstAmount;

      return {
        TAGNO: barCode.TAGNO ?? "",
        TOTALAMT: Number(totalAmount.toFixed(2)),
        GSTTOTALAMT: Number(gstAmount.toFixed(2)),
        NETAMT: Number(netAmount.toFixed(2)),
      };
    });

    setTotalAmounts(perData);
  }, [wastageData, mcData, wastageOpen, mcOpen, stonesData]);

  const EstNo = tagNo ? tagNo : estNo;

  const handleEposPrint = (est) => {
    printReceipt(
      localIp,
      est,
      tagNo,
      userName,
      barCodeData,
      stonesData,
      totalPcs,
      totalGwt,
      totalNwt,
      totalAmt,
      totalGstAmt,
      grandTotalAmount,
      gstNo,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      wastageData,
      mcData,
      totalAmounts,
      wastMc,
      wastValue,
    );
  };

  const handleEposPrintModule2 = (est) => {
    printReceiptModule2(
      localIp,
      est,
      tagNo,
      userName,
      barCodeData,
      stonesData,
      totalPcs,
      totalGwt,
      totalNwt,
      totalAmt,
      totalGstAmt,
      grandTotalAmount,
      gstNo,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      wastageData,
      mcData,
      totalAmounts,
      wastMc,
      wastValue,
    );
  };

  const handlePrintModule1 = (est) => {
    PrintModule1(
      localIp,
      est,
      tagNo,
      userName,
      barCodeData,
      stonesData,
      totalPcs,
      totalGwt,
      totalNwt,
      totalAmt,
      totalGstAmt,
      grandTotalAmount,
      gstNo,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      wastageData,
      mcData,
      totalAmounts,
      wastMc,
      wastValue,
    );
  };

  const handlePrintModule2 = (est) => {
    PrintModule2(
      localIp,
      est,
      tagNo,
      userName,
      barCodeData,
      stonesData,
      totalPcs,
      totalGwt,
      totalNwt,
      totalAmt,
      totalGstAmt,
      grandTotalAmount,
      gstNo,
      loginName,
      printModel,
      customerName,
      customerMobile,
      customerArea,
      wastageData,
      mcData,
      totalAmounts,
      wastMc,
      wastValue,
    );
  };
  console.log(mcData, "mcData");
  console.log(wastageData, "wast");
  console.log(barCodeData, "data");

  return (
    <div style={{ background: "#F6F1E9", height: "100vh" }}>
      {contextHolder}
      <Header setOpen={setOpen} />
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h3 className={styles.heading}>Estimation</h3>
          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#222" }}>
            NO:{" "}
            <span
              style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
            >
              {tagNo ? tagNo : estNo}
            </span>
          </span>
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
                const value = e.target.value.replace(/[a-zA-Z]/g, "");
                if (value.length <= 10) {
                  setBarCode(value);
                }
              }}
            />
          </div>

          {/* Buttons */}
          <div className={styles.buttonSection}>
            <Button
              type="primary"
              htmlType="submit"
              ref={submitRef}
              className={styles.submitButton}
              onClick={() => {
                if (Number(barCode) === 0) {
                  homeFilesomeDrawer();
                  setBarCode();
                } else {
                  tagNoAPI();
                  stonesDetailsAPI();
                  setBarCode();
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
                handleReset();
                setTagNo();
              }}
            >
              Reset
            </Button>
            <AutoFixHighSharpIcon
              style={{
                fontSize: "30px",
                padding: "6px 10px",
                color: "#EF7722",
              }}
              onClick={handleModifyOpen}
            />
            {/* <ScanOutlined
              onClick={handleOpenScanner}
              style={{
                fontSize: "30px",
                padding: "6px 5px",
                // color: !qrOpen ? "#162566" : "#eb14bcff",
              }}
            /> */}
            <ContactPhoneSharpIcon
              style={{
                fontSize: "30px",
                padding: "6px 10px",
                color: "#BF9264",
              }}
              onClick={handleUserOk}
            />
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
        <div className={styles.scrollArea}>
          {changeCard === true ? (
            <>
              {barCodeData.map((barCode, index) => {
                const matchedTotals = totalAmounts.find(
                  (item) => item.TAGNO === barCode.TAGNO,
                );

                const matchedStones = stonesData.filter(
                  (item) => item.TAGNO === barCode.TAGNO,
                );
                const totalCts = matchedStones.reduce(
                  (sum, item) => sum + (parseFloat(item.CTS) || 0),
                  0,
                );
                const totalGrams = matchedStones.reduce(
                  (sum, item) => sum + (parseFloat(item.GRMS) || 0),
                  0,
                );
                const totalItemAmt = matchedStones.reduce(
                  (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
                  0,
                );
                const diamondItems = matchedStones.filter((item) => {
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
                const matchedW = wastageData.find(
                  (w) => w.TAGNO === barCode.TAGNO,
                );

                const ctsData = totalCts / 5 + totalGrams;
                const netWt = barCode?.GWT - ctsData;
                const netWeight = netWt ?? barCode?.NWT ?? 0;
                const wastAmt = Number(
                  matchedW?.TOTALWT ?? barCode?.CATTOTWAST ?? 0,
                );

                const totWt = Number(netWeight) + Number(wastAmt);

                return (
                  <div className={styles.card} key={index}>
                    <div className={styles.header}>
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                          #{barCode?.TAGNO ? barCode?.TAGNO : "0"}
                        </span>
                        <br />
                        <small>Tag no</small>
                      </div>
                      {barCode?.VV &&
                        barCode?.VV !== "-" &&
                        barCode?.VV !== "null" &&
                        barCode?.VV !== "NO" && (
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
                              onClick={() => {
                                handleImageOk(barCode?.VV);
                              }}
                            >
                              <img
                                src={barCode?.VV}
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
                          ₹ {barCode?.RATE ? barCode?.RATE.toFixed(2) : 0.0}
                        </span>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <div className={styles.productHeader}>
                        <span className={styles.productName}>
                          {barCode?.PRODUCTNAME ? barCode?.PRODUCTNAME : "-"}
                        </span>
                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                        >
                          <DeleteOutlined
                            style={{
                              color: "red",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            onClick={() => {
                              handleDelete(index);
                              handleStonesDelete(barCode?.TAGNO);
                              handleWastageDelete(barCode?.TAGNO);
                              handleMcDelete(barCode?.TAGNO);
                              handleTotalsDelete(barCode?.TAGNO);
                            }}
                          />
                        </span>
                        <span className={styles.qtyBox}>
                          {barCode?.PIECES
                            ? `${barCode?.PIECES} ${
                                barCode?.PIECES === 1 ? "piece" : "pieces"
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
                            {barCode?.MNAME ? barCode?.MNAME : "-"}
                          </span>
                        </div>
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>Product Category</span>
                    <span className={styles.separator2}>:</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "16px",
                        textAlign: "right",
                        color: " #162566",
                        fontWeight: "bold",
                      }}
                    >
                      {barCode?.PRODUCTCATEGORY
                        ? barCode?.PRODUCTCATEGORY
                        : "-"}
                    </span>
                  </div> */}
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>HSN Code</span>
                    <span className={styles.separator2}>:</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "16px",
                        textAlign: "right",
                        color: " #162566",
                        fontWeight: "bold",
                      }}
                    >
                      {barCode?.HSNCODE ? barCode?.HSNCODE : "-"}
                    </span>
                  </div> */}
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Purity</span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {barCode?.PREFIX ? barCode?.PREFIX : "-"}
                          </span>
                        </div>
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Gwt</span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {barCode?.GWT
                              ? barCode?.GWT?.toFixed(3) + "g"
                              : "0.000g"}
                          </span>
                        </div>
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Stone Wt</span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {Number(ctsData ?? barCode?.ITEM_TOTAMT)?.toFixed(
                              3,
                            ) + "g" ?? "0.000g"}
                          </span>
                        </div>
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Nwt</span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {Number(netWt ?? barCode?.NWT)?.toFixed(3) + "g" ??
                              "0.000g"}
                          </span>
                        </div>
                        {/* <div className={styles.rowTag2}>
                        <span
                          className={styles.label2}
                          onClick={() => {
                            handleWastageOpen(barCode);
                            setWastageTagNo(barCode?.TAGNO);
                          }}
                        >
                          Wastage (
                          {barCode?.WASTAGE
                            ? Number(barCode?.WASTAGE) + "%"
                            : "0%"}
                          )
                        </span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.CATTOTWAST
                            ? Number(barCode?.CATTOTWAST)?.toFixed(3) + "g"
                            : "0.000g"}
                        </span>
                      </div> */}
                        <div className={styles.rowTag2}>
                          <span
                            className={styles.label2}
                            onClick={() => {
                              handleWastageOpen(barCode);
                              setWastageTagNo(barCode?.TAGNO);
                              setWastageHomeKey(barCode?.ISSBRANCHNAME);
                            }}
                          >
                            {(() => {
                              // ✅ Check if wastageData has a matching TAGNO
                              let matched;
                              if (barCode.TAGNO > 0) {
                                matched = wastageData.find(
                                  (item) => item.TAGNO === barCode?.TAGNO,
                                );
                              } else {
                                matched = wastageData.find(
                                  (item) =>
                                    item.ISSBRANCHNAME ===
                                    barCode?.ISSBRANCHNAME,
                                );
                              }
                              // ✅ Return display text dynamically
                              if (matched) {
                                return (
                                  <>
                                    Wastage (
                                    {matched.WASTAGE
                                      ? `${matched.WASTAGE}%`
                                      : "0%"}
                                    )
                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "8px",
                                      }}
                                    >
                                      (Click Me)
                                    </span>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    Wastage (
                                    {barCode?.WASTAGE
                                      ? `${Number(barCode?.WASTAGE)}%`
                                      : "0%"}
                                    )
                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "8px",
                                      }}
                                    >
                                      (Click Me)
                                    </span>
                                  </>
                                );
                              }
                            })()}
                          </span>

                          <span className={styles.separator2}>:</span>

                          <span className={styles.value2}>
                            {(() => {
                              let matched;
                              if (barCode.TAGNO > 0) {
                                matched = wastageData.find(
                                  (item) => item.TAGNO === barCode?.TAGNO,
                                );
                              } else {
                                matched = wastageData.find(
                                  (item) =>
                                    item.ISSBRANCHNAME ===
                                    barCode?.ISSBRANCHNAME,
                                );
                              }

                              if (matched) {
                                return `${Number(matched.TOTALWT).toFixed(3)}g`;
                              } else {
                                return barCode?.CATTOTWAST
                                  ? `${Number(barCode?.CATTOTWAST).toFixed(3)}g`
                                  : "0.000g";
                              }
                            })()}
                          </span>
                        </div>
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Total Weight</span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {Number(totWt)?.toFixed(3) + "g" ?? "0.000g"}
                          </span>
                        </div>
                        <div className={styles.rowTag2}>
                          <span
                            className={styles.label2}
                            onClick={() => {
                              handleMcOpen(barCode);
                              setMcTagNo(barCode?.TAGNO);
                              setMcHomeKey(barCode?.ISSBRANCHNAME);
                            }}
                          >
                            {(() => {
                              // ✅ Check if wastageData has a matching TAGNO
                              let matched;
                              if (barCode.TAGNO > 0) {
                                matched = mcData.find(
                                  (item) => item.TAGNO === barCode?.TAGNO,
                                );
                              } else {
                                matched = mcData.find(
                                  (item) =>
                                    item.ISSBRANCHNAME ===
                                    barCode?.ISSBRANCHNAME,
                                );
                              }

                              // ✅ Return display text dynamically
                              if (matched) {
                                return (
                                  <>
                                    MC/Amt (
                                    {matched?.MAKINGCHARGES
                                      ? Number(matched?.MAKINGCHARGES) + "/g"
                                      : "0/g"}
                                    )
                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "8px",
                                      }}
                                    >
                                      (Click Me)
                                    </span>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    MC/Amt (
                                    {barCode?.MAKINGCHARGES
                                      ? Number(barCode?.MAKINGCHARGES) + "/g"
                                      : "0/g"}
                                    )
                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "8px",
                                      }}
                                    >
                                      (Click Me)
                                    </span>
                                  </>
                                );
                              }
                            })()}
                          </span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            ₹{" "}
                            {(() => {
                              let matched;
                              if (barCode.TAGNO > 0) {
                                matched = mcData.find(
                                  (item) => item.TAGNO === barCode?.TAGNO,
                                );
                              } else {
                                matched = mcData.find(
                                  (item) =>
                                    item.ISSBRANCHNAME ===
                                    barCode?.ISSBRANCHNAME,
                                );
                              }

                              if (matched) {
                                return `${Number(matched.TOTALAMT).toFixed(2)}`;
                              } else {
                                return barCode?.CATTOTMC
                                  ? `${Number(barCode?.CATTOTMC).toFixed(2)}`
                                  : 0.0;
                              }
                            })()}
                            {/* {barCode?.CATTOTMC
                            ? Number(barCode?.CATTOTMC).toFixed(2)
                            : 0.0} */}
                          </span>
                        </div>
                        <div className={styles.highlightBox2}>
                          <span className={styles.label2}>Metal Value </span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            ₹{" "}
                            {(
                              (barCode?.RATE ?? 0) *
                              (netWt ?? barCode?.NWT ?? 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div
                          className={styles.highlightBox1}
                          onClick={() => {
                            if (barCode?.ITEM_TOTAMT > 0) {
                              handleOk(barCode?.TAGNO);
                            }
                          }}
                        >
                          <span className={styles.label2}>
                            Stone Cost{" "}
                            {barCode?.ITEM_TOTAMT > 0 && (
                              <span
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                                (Click Me)
                              </span>
                            )}
                          </span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            ₹ {totalItemAmt ? totalItemAmt.toFixed(2) : 0.0}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "12px",
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
                              {diaCts ? diaCts?.toFixed(3) : 0}
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
                              ₹ {diaAmount ? diaAmount?.toFixed(2) : 0}
                            </span>
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "12px",
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
                              {barCode?.BRANDNAME ? barCode?.BRANDNAME : "-"}
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
                              {barCode?.BRANDCALCAMT
                                ? barCode?.BRANDCALCAMT?.toFixed(2)
                                : 0}
                            </span>
                          </span>
                        </div>
                        {barCode?.TRAY === true && (
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
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>Dealer</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCode?.DEALERNAME
                        ? barCode?.DEALERNAME
                        : "-"}
                    </span>
                  </div> */}
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Counter </span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {barCode?.COUNTERNAME ? barCode?.COUNTERNAME : "-"}
                          </span>
                        </div>
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>HUID</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCode?.HUID ? barCode?.HUID : "-"}
                    </span>
                  </div> */}
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>Tag Size</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCode?.TAGSIZE ? barCode?.TAGSIZE : "-"}
                    </span>
                  </div> */}
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>Tag Date</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCode?.TAGDATE
                        ? dayjs(barCode?.TAGDATE).format("DD-MMM-YYYY")
                        : "-"}
                    </span>
                  </div> */}
                        {/* <div className={styles.rowTag2}>
                    <span className={styles.label2}>Description</span>
                    <span className={styles.separator2}>:</span>
                    <span className={styles.value2}>
                      {barCode?.DESC1 ? barCode?.DESC1 : "-"}
                    </span>
                  </div> */}
                      </div>
                    </div>
                    <div className={styles.header1}>
                      <div style={{ fontSize: "14px" }}>
                        Total Amount
                        <br />
                        <span className={styles.amount1}>
                          ₹
                          {matchedTotals
                            ? matchedTotals?.TOTALAMT.toFixed(2)
                            : 0.0}
                        </span>
                      </div>
                      {Number(barCode?.GSTRATE) > 0 ? (
                        <div style={{ fontSize: "14px" }}>
                          Gst @ {barCode?.GSTRATE || 0.0}%
                          <br />
                          <span className={styles.amount2}>
                            ₹
                            {matchedTotals
                              ? matchedTotals?.GSTTOTALAMT.toFixed(2)
                              : 0.0}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      <div style={{ fontSize: "14px" }}>
                        Net Amount
                        <br />
                        <span className={styles.amount1}>
                          ₹
                          {matchedTotals
                            ? matchedTotals?.NETAMT.toFixed(2)
                            : 0.0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* {barCodeData?.length > 0 && barCode.STATUS != "-" && (
              <div className={styles.card}>
                <div className={styles.header2}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
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
                          color: " #162566",
                          fontWeight: "bold",
                        }}
                      >
                        {barCode?.APPCATEGORY
                          ? barCode?.APPCATEGORY
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
                          color: " #162566",
                          fontWeight: "bold",
                        }}
                      >
                        {barCode?.APPNAME
                          ? barCode?.APPNAME
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
                          color: " #162566",
                          fontWeight: "bold",
                        }}
                      >
                        {barCode?.APPINCHRG
                          ? barCode?.APPINCHRG
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
                          color: " #162566",
                          fontWeight: "bold",
                        }}
                      >
                        {barCode?.APPDate
                          ? dayjs(barCode?.APPDate).format("DD-MMM-YYYY")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            </>
          ) : (
            <>
              {barCodeData.map((barCode, index) => (
                <div className={styles.card}>
                  <div className={styles.header1}>
                    <div>
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        #{barCode?.TAGNO ? barCode?.TAGNO : "0"}
                      </span>
                      <br />
                      <small>Tag no</small>
                    </div>
                    <div>
                      Pure Rate
                      <br />
                      <span className={styles.amount1}>
                        ₹{" "}
                        {barCode?.FINERATE ? barCode?.FINERATE.toFixed(2) : 0.0}
                      </span>
                    </div>
                  </div>

                  <div className={styles.content}>
                    <div className={styles.productHeader}>
                      <span className={styles.productName}>
                        {barCode?.PRODUCTNAME ? barCode?.PRODUCTNAME : "-"}
                      </span>
                      <span
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        <DeleteOutlined
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          onClick={() => {
                            handleDelete(index);
                            handleStonesDelete(barCode?.TAGNO);
                            handleWastageDelete(barCode?.TAGNO);
                            handleMcDelete(barCode?.TAGNO);
                            handleTotalsDelete(barCode?.TAGNO);
                          }}
                        />
                      </span>
                      <span className={styles.qtyBox}>
                        {barCode?.PIECES
                          ? `${barCode?.PIECES} ${
                              barCode?.PIECES === 1 ? "piece" : "pieces"
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
                          {barCode?.MNAME ? barCode?.MNAME : "-"}
                        </span>
                      </div>
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>Product Category</span>
                        <span className={styles.separator2}>:</span>
                        <span
                          style={{
                            flex: 1,
                            fontSize: "16px",
                            textAlign: "right",
                            color: " #162566",
                            fontWeight: "bold",
                          }}
                        >
                          {barCode?.PRODUCTCATEGORY
                            ? barCode?.PRODUCTCATEGORY
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
                            color: " #162566",
                            fontWeight: "bold",
                          }}
                        >
                          {barCode?.HSNCODE ? barCode?.HSNCODE : "-"}
                        </span>
                      </div> */}
                      <div className={styles.rowTag2}>
                        <span className={styles.label2}>Purity</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.PREFIX ? barCode?.PREFIX : "-"}
                        </span>
                      </div>
                      <div className={styles.rowTag2}>
                        <span className={styles.label2}>Gwt</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.COST_LESS
                            ? barCode?.COST_GWT?.toFixed(3) + "g"
                            : "0.000g"}
                        </span>
                      </div>
                      <div className={styles.rowTag2}>
                        <span className={styles.label2}>Stone Wt</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.COST_LESS
                            ? barCode?.COST_LESS?.toFixed(3) + "g"
                            : "0.000g"}
                        </span>
                      </div>
                      <div className={styles.rowTag2}>
                        <span className={styles.label2}>Nwt</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.COST_NWT
                            ? barCode?.COST_NWT?.toFixed(3) + "g"
                            : "0.000g"}
                        </span>
                      </div>
                      <div className={styles.rowTag2}>
                        <span className={styles.label2}>Touch + Wastage</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.COST_TOUCH
                            ? Number(barCode?.COST_TOUCH)?.toFixed(3) + "g"
                            : "0.000g"}{" "}
                          +{" "}
                          {barCode?.COST_WASTAGE
                            ? Number(barCode?.COST_WASTAGE)?.toFixed(3) + "g"
                            : "0.000g"}
                        </span>
                      </div>
                      <div className={styles.highlightBox2}>
                        <span className={styles.label2}>Fine Gold</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.COST_FTOUCH
                            ? Number(barCode?.COST_FTOUCH).toFixed(3)
                            : 0.0}
                        </span>
                      </div>
                      <div className={styles.highlightBox1}>
                        <span className={styles.label2}>Amount</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          ₹{" "}
                          {barCode?.COST_FTOUCH * barCode?.FINERATE
                            ? (
                                barCode?.COST_FTOUCH * barCode?.FINERATE
                              ).toFixed(2)
                            : 0.0}
                        </span>
                      </div>
                      <div className={styles.highlightBox3}>
                        <span className={styles.label2}>MC</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          ₹{" "}
                          {barCode?.COST_MC
                            ? Number(barCode?.COST_MC).toFixed(2)
                            : 0.0}
                        </span>
                      </div>
                      <div className={styles.highlightBox}>
                        <span className={styles.label2}>Others</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          ₹{" "}
                          {barCode?.COST_STAMT
                            ? barCode?.COST_STAMT.toFixed(2)
                            : 0.0}
                        </span>
                        {/* </div> */}
                      </div>
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>Dealer</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.DEALERNAME ? barCode?.DEALERNAME : "-"}
                        </span>
                      </div> */}
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>Counter</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.COUNTERNAME ? barCode?.COUNTERNAME : "-"}
                        </span>
                      </div> */}
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>HUID</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.HUID ? barCode?.HUID : "-"}
                        </span>
                      </div> */}
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>Tag Size</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.TAGSIZE ? barCode?.TAGSIZE : "-"}
                        </span>
                      </div> */}
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>Tag Date</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.TAGDATE
                            ? dayjs(barCode?.TAGDATE).format("DD-MMM-YYYY")
                            : "-"}
                        </span>
                      </div> */}
                      {/* <div className={styles.rowTag2}>
                        <span className={styles.label2}>Description</span>
                        <span className={styles.separator2}>:</span>
                        <span className={styles.value2}>
                          {barCode?.DESC1 ? barCode?.DESC1 : "-"}
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div className={styles.header}>
                    <div>
                      Total Amount
                      <br />
                      <span className={styles.amount}>
                        ₹
                        {(
                          barCode?.COST_FTOUCH * barCode?.FINERATE +
                          barCode?.COST_MC +
                          barCode?.COST_STAMT
                        )?.toFixed(2) || 0.0}
                      </span>
                    </div>
                    {barCode?.GSTRATE > 0 ? (
                      <div>
                        Gst @ {barCode?.GSTRATE || 0.0}%
                        <br />
                        <span className={styles.amount3}>
                          ₹
                          {(
                            ((barCode?.COST_FTOUCH * barCode?.FINERATE +
                              barCode?.COST_MC +
                              barCode?.COST_STAMT) *
                              barCode?.GSTRATE) /
                            100
                          )?.toFixed(2) || 0.0}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      Net Amount
                      <br />
                      <span className={styles.amount}>
                        ₹
                        {(
                          barCode?.COST_FTOUCH * barCode?.FINERATE +
                          barCode?.COST_MC +
                          barCode?.COST_STAMT +
                          ((barCode?.COST_FTOUCH * barCode?.FINERATE +
                            barCode?.COST_MC +
                            barCode?.COST_STAMT) *
                            barCode?.GSTRATE) /
                            100
                        )?.toFixed(2) || 0.0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.summaryBox}>
          <div className={styles.totalBox}>
            <h4>TOTAL</h4>

            <div className={styles.totalRow}>
              <span className={styles.label}>PIECES</span>
              <span className={styles.colon}>:</span>
              <span className={styles.value}>{totalPcs}</span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.label}>GWT</span>
              <span className={styles.colon}>:</span>
              <span className={styles.value}>
                {Number(totalGwt).toFixed(3)}
              </span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.label}>NWT</span>
              <span className={styles.colon}>:</span>
              <span className={styles.value}>
                {Number(totalNwt).toFixed(3)}
              </span>
            </div>
          </div>

          <div className={styles.amountBox}>
            <div className={styles.amountRow}>
              <span className={styles.label}>Total Amt</span>
              <span className={styles.colon}>:</span>
              <span className={styles.value}>
                {changeCard === true
                  ? Number(totalAmt).toFixed(0)
                  : Number(totalPurAmt).toFixed(0)}
                /-
              </span>
            </div>
            <div className={styles.amountRow}>
              <span className={styles.label}>GST Amt</span>
              <span className={styles.colon}>:</span>
              <span className={styles.value}>
                {changeCard === true
                  ? Number(totalGstAmt).toFixed(0)
                  : Number(totalPurGstAmt).toFixed(0)}
                /-
              </span>
            </div>
            <div className={styles.amountRow}>
              <span className={styles.label}>Net Amt</span>
              <span className={styles.colon}>:</span>
              <span className={styles.value}>
                {changeCard === true
                  ? Number(totalNwtAmt).toFixed(0)
                  : Number(totalPurNwtAmt).toFixed(0)}
                /-
              </span>
            </div>
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button
            className={styles.btn}
            onClick={() => {
              handleReset();
              setTagNo();
            }}
          >
            NEW
          </button>
          <button
            className={styles.btn}
            onClick={async () => {
              if (barCodeData.length > 0) {
                if (tagNo) {
                  await estimationDeleteData();
                  await estimationDeleteMast();
                  await estimationDeleteItems();

                  await createEstimationData();
                  await createEstimationMast();
                  await createEstimationItems();
                } else {
                  const nextInvNo = await estimationNo();
                  await createEstimationData(nextInvNo);
                  await createEstimationMast(nextInvNo);
                  await createEstimationItems(nextInvNo);
                  // setSelectEstimationNo(null);
                }
              }
            }}
          >
            SAVE
          </button>
          <button
            className={styles.btn}
            onClick={() => {
              if (barCodeData?.length > 0) {
                handlePrintOk();
              }
            }}
          >
            PRINT
          </button>
        </div>
      </div>
      {qrOpen && (
        <div className={styles.qrScannerOverlay}>
          <div className={styles.qrScannerContent}>
            <div className={styles.closeIcon} onClick={stopScanner}>
              <CloseIcon style={{ fontSize: 30, color: "#fff" }} />
            </div>
            <div
              id="qr-reader"
              style={{ width: "300px", height: "300px" }}
            ></div>
          </div>
        </div>
      )}
      <StonesDetailsDialog
        stonesOpen={stonesOpen}
        handleCancel={handleCancel}
        stonesData={stonesData}
        setStonesData={setStonesData}
        stoneNo={stoneNo}
      />
      <ImageDialog
        handleImageCancel={handleImageCancel}
        imageOpen={imageOpen}
        imageData={photo}
      />
      <PrintTemplateDialog
        open={printOpen}
        onCancel={handlePrintCancel}
        handleEposPrint={handleEposPrint}
        handleEposPrintModule2={handleEposPrintModule2}
        handlePrintModule1={handlePrintModule1}
        handlePrintModule2={handlePrintModule2}
        createEstimationData={createEstimationData}
        createEstimationMast={createEstimationMast}
        createEstimationItems={createEstimationItems}
        estimationDeleteData={estimationDeleteData}
        estimationDeleteMast={estimationDeleteMast}
        estimationDeleteItems={estimationDeleteItems}
        tagNo={tagNo}
        pdfModule={pdfModule}
        estimationNo={estimationNo}
      />
      <ModifyEstNo
        modifyOpen={modifyOpen}
        handleCancel={handleModifyCancel}
        modifyCode={modifyCode}
        setModifyCode={setModifyCode}
        estimationNoDataAPI={estimationNoDataAPI}
        estimationNoMastAPI={estimationNoMastAPI}
        estimationNoItemsAPI={estimationNoItemsAPI}
        handleReset={handleReset}
        setTagNo={setTagNo}
      />
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
      <WastageDialog
        wastageOpen={wastageOpen}
        handleCancel={handleWastageCancel}
        setWastageData={setWastageData}
        wastageData={wastageData}
        wastageTagNo={wastageTagNo}
        wastageHomeKey={wastageHomeKey}
      />
      <MakingChargesDialog
        mcOpen={mcOpen}
        handleCancel={handleMcCancel}
        setMcData={setMcData}
        mcData={mcData}
        mcTagNo={mcTagNo}
        mcHomeKey={mcHomeKey}
      />
      <Tag
        homecloseDrawer={homecloseDrawer}
        homeDrawerOpen={homeDrawerOpen}
        gstNo={gst}
        billNo={tagNo}
        invNo={estNo}
        setNewStonesData={setNewStonesData}
        newStonesData={newStonesData}
        selectTagMainProduct={selectTagMainProduct}
        setSelectTagMainProduct={setSelectTagMainProduct}
        selectTagProductName={selectTagProductName}
        setSelectTagProductName={setSelectTagProductName}
        tagPieces={tagPieces}
        setTagPieces={setTagPieces}
        tagGwt={tagGwt}
        setTagGWt={setTagGWt}
        tagLess={tagLess}
        setTagLess={setTagLess}
        tagNwt={tagNwt}
        setTagNwt={setTagNwt}
        selectTagPurity={selectTagPurity}
        setSelectTagPurity={setSelectTagPurity}
        tagHuid={tagHuid}
        setTagHuid={setTagHuid}
        tagDesc={tagDesc}
        setTagDesc={setTagDesc}
        tagWastage={tagWastage}
        setTagWastage={setTagWastage}
        tagDirectWt={tagDirectWt}
        setTagDirectWt={setTagDirectWt}
        tagTotalWt={tagTotalWt}
        setTagTotalWt={setTagTotalWt}
        tagMaking={tagMaking}
        setTagMaking={setTagMaking}
        tagDirectMc={tagDirectMc}
        setTagDirectMc={setTagDirectMc}
        tagTotalMc={tagTotalMc}
        setTagTotalMc={setTagTotalMc}
        stoneTotalPcs={stoneTotalPcs}
        setStoneTotalPcs={setStoneTotalPcs}
        stoneTotalCts={stoneTotalCts}
        setStoneTotalCts={setStoneTotalCts}
        stoneTotalGrams={stoneTotalGrams}
        setStoneTotalGrams={setStoneTotalGrams}
        stoneTotalAmt={stoneTotalAmt}
        setStoneTotalAmt={setStoneTotalAmt}
        stoneTotalNoPcs={stoneTotalNoPcs}
        setStoneTotalNoPcs={setStoneTotalNoPcs}
        setStonesData={setStonesData}
        stonesData={stonesData}
        setData={setBarCodeData}
        data={barCodeData}
        // selectJewelType={selectJewelType}
        tagProductCategory={tagProductCategory}
        setTagProductCategory={setTagProductCategory}
        tagProductCode={tagProductCode}
        setTagProductCode={setTagProductCode}
        tagCategoryName={tagCategoryName}
        setTagCategoryName={setTagCategoryName}
        tagHsnCode={tagHsnCode}
        setTagHsnCode={setTagHsnCode}
        stoneDiaCts={stoneDiaCts}
        setStoneDiaCts={setStoneDiaCts}
        stoneDiaAmt={stoneDiaAmt}
        setStoneDiaAmt={setStoneDiaAmt}
        tagBeadsLess={tagBeadsLess}
        setTagBeadsLess={setTagBeadsLess}
        setTrayTagNo={setTrayTagNo}
        trayTagNo={trayTagNo}
        tray={tray}
        setTray={setTray}
        messageApi={messageApi}
        setSelectTagBrandName={setSelectTagBrandName}
        selectTagBrandName={selectTagBrandName}
        setTagBrandValue={setTagBrandValue}
        tagBrandValue={tagBrandValue}
        setTagBrandAmt={setTagBrandAmt}
        tagBrandAmt={tagBrandAmt}
      />
    </div>
  );
};

export default BarCodeCheck;
