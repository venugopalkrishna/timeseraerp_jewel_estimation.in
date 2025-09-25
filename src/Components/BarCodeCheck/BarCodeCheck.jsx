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
  const [mcData, setMcData] = useState([]);
  const [mcOpen, setMcOpen] = useState(false);
  const [mcTagNo, setMcTagNo] = useState();
  const [totalAmounts, setTotalAmounts] = useState([]);
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
        }
      );

      // Axios already returns parsed JSON under response.data
      const data = response.data;
      const rawValue = data[0]?.Column1;
      const maxEstimationNo = Number.isFinite(Number(rawValue))
        ? Number(rawValue)
        : 0;
      const newEstimationNo = maxEstimationNo + 1;
      setEstNo(newEstimationNo);
    } catch (error) {
      console.error("Error fetching estimation number:", error);
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
        }
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
          (item) => !existingTags.has(item.TAGNO)
        );

        if (filteredData.length === 0) {
          messageApi.open({
            type: "error",
            content: (
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Tag{" "}
                <span style={{ color: "red" }}>
                  {modifiedTotalData[0]?.TAGNO}
                </span>{" "}
                already existed
              </span>
            ),
          });
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
          0
        );
        const gwt = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.GWT) || 0),
          0
        );
        const nwt = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.NWT) || 0),
          0
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
          0
        );
        const totalMcAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.CATTOTMC) || 0),
          0
        );
        const totalCtsAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Item_Cts) || 0),
          0
        );
        const totalUnCutsAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Item_Uncuts) || 0),
          0
        );
        const totalItemDiaAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Item_diamonds) || 0),
          0
        );
        const totalDiamondAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.Diamond_Amount) || 0),
          0
        );

        const totalPurAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.COST_AMOUNT) || 0),
          0
        );
        const totalPurGstAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.COST_GSTAMOUNT) || 0),
          0
        );
        const totalPurNwtAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.COST_NETAMOUNT) || 0),
          0
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
        setGstNo(data[0]?.GSTRATE);
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
        }
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
          (item) => !existingTags.includes(item.TAGNO)
        );

        if (filteredData.length === 0) {
          // message.error("All these tag numbers already existed");
          return prevData;
        }

        const updatedData = [...prevData, ...data];

        const totalStoneAmount = updatedData.reduce(
          (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
          0
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
  const createEstimationData = async () => {
    const requestBody = barCodeData.map((item, index) => {
      const matched = wastageData.find((w) => w.TAGNO === item?.TAGNO);
      const matchedMc = mcData.find((mc) => mc.TAGNO === item?.TAGNO);
      const matchedTotals = totalAmounts.find(
        (tot) => tot.TAGNO === item.TAGNO
      );
      return {
        estimationNo: String(tagNo ? tagNo : estNo ?? "-"), // always a string
        tagNo: Number(item?.TAGNO ?? 0),
        mname: String(item?.MNAME ?? "-"),
        productName: String(item?.PRODUCTNAME ?? "-"),
        pieces: Number(item?.PIECES ?? 0),
        gwt: Number(item?.GWT ?? 0),
        nwt: Number(item?.NWT ?? 0),
        categoryName: String(item?.CATEGORYNAME ?? "-"),
        wastage: String(matched?.WASTAGE ?? item?.WASTAGE ?? "-"),
        directWastage: String(matched?.DIRECTWT ?? "-"),
        cattotwast: String(matched?.TOTALWT ?? item?.CATTOTWAST ?? "-"),
        makingCharges: String(
          matchedMc?.MAKINGCHARGES ?? item?.MAKINGCHARGES ?? "-"
        ),
        directMc: String(matchedMc?.DIRECTAMT ?? "-"),
        cattotMc: String(matchedMc?.TOTALAMT ?? item?.CATTOTMC ?? "-"),
        brandName: String(item?.BRANDNAME ?? "-"),
        brandAmt: Number(item?.BRANDAMT ?? 0),
        amount: Number(matchedTotals?.TOTALAMT ?? 0),
        itemamt: Number(item?.ITEM_TOTAMT ?? 0),
        totamt: Number(matchedTotals?.NETAMT ?? 0),
        estDate: new Date().toISOString(),
        estTime: new Date().toISOString(),
        rate: Number(item?.RATE ?? 0),
        homekey: 0,
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
        pvalue: 0,
        purchno: 0,
        pamt: 0,
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
        }
      );
      let data = response?.data;
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationMast = async () => {
    const requestBody = {
      estimationNo: String(tagNo ? tagNo : estNo),
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
        }
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
        }
      );

      const data = response.data;
      const modifiedData = data.map((item, index) => {
        const nwt = Number(item?.Nwt) || 0;
        const wastage = Number(item?.Wastage) || 0;
        return {
          TAGNO: item?.TagNo ?? 0,
          NWT: nwt,
          WASTAGE: wastage ? wastage.toString() : "",
          DIRECTWT: item?.DirectWastage,
          TOTALWT: Number((nwt * wastage) / 100),
        };
      });

      const modifiedMcData = data.map((item, index) => {
        const nwt = Number(item?.Nwt) || 0;
        const making = Number(item?.MakingCharges) || 0;
        return {
          TAGNO: item?.TagNo ?? 0,
          NWT: nwt,
          MAKINGCHARGES: making ? making.toString() : "",
          DIRECTAMT: item?.DirectMc,
          TOTALAMT: Number(nwt * making),
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
        const gstAmount = (totalAmount * 3) / 100;
        const netAmount = totalAmount + gstAmount;

        return {
          TAGNO: item?.TagNo ?? "",
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
            (item) => !existingTags.includes(item.TAGNO)
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
            (item) => !existingTags.includes(item.TAGNO)
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
            (item) => !existingTags.includes(item.TAGNO)
          );

          if (filteredData.length === 0) {
            // message.error("All these tag numbers already existed");
            return prevData;
          }

          const updatedData = [...prevData, ...modifiedMcData];

          return updatedData;
        });

        // ✅ Loop through each row and call both APIs sequentially
        for (const item of data) {
          const tagNo = item.TAGNO || item.TagNo; // handle both possible cases
          if (tagNo) {
            try {
              await tagNoAPI(tagNo);
              await stonesDetailsAPI(tagNo);
            } catch (err) {
              console.error(`Error processing TagNo ${tagNo}:`, err);
            }
          }
        }
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
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setCustomerName(data[0]?.CustName);
        setCustomerMobile(data[0]?.MOBILENO);
        setCustomerArea(data[0]?.CITY);
      }
    } catch (error) {
      console.error("Error fetching estimation data:", error);
    }
  };

  const estimationDeleteData = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_DATA&where=ESTIMATIONNO=${tagNo}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteMast = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_MAST&where=ESTIMATIONNO=${tagNo}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        }
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
        }
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

  useEffect(() => {
    const pcs = barCodeData.reduce((sum, item) => sum + (item.PIECES || 0), 0);
    const gwt = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.GWT) || 0),
      0
    );
    const nwt = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.NWT) || 0),
      0
    );
    const totalAmount = totalAmounts.reduce(
      (sum, item) => sum + (parseFloat(item.TOTALAMT) || 0),
      0
    );
    const totalGstAmount = totalAmounts.reduce(
      (sum, item) => sum + (parseFloat(item.GSTTOTALAMT) || 0),
      0
    );
    const totalNwtAmount = totalAmounts.reduce(
      (sum, item) => sum + (parseFloat(item.NETAMT) || 0),
      0
    );
    const totalWastAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.CATTOTWAST) || 0),
      0
    );
    const totalMcAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.CATTOTMC) || 0),
      0
    );
    const totalCtsAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.Item_Cts) || 0),
      0
    );
    const totalUnCutsAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.Item_Uncuts) || 0),
      0
    );
    const totalItemDiaAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.Item_diamonds) || 0),
      0
    );
    const totalDiamondAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.Diamond_Amount) || 0),
      0
    );

    const totalPurAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.COST_AMOUNT) || 0),
      0
    );
    const totalPurGstAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.COST_GSTAMOUNT) || 0),
      0
    );
    const totalPurNwtAmount = barCodeData.reduce(
      (sum, item) => sum + (parseFloat(item.COST_NETAMOUNT) || 0),
      0
    );
    const totalStoneAmount = stonesData.reduce(
      (sum, item) => sum + (parseFloat(item.AMOUNT) || 0),
      0
    );

    setTotalStoneAmt(totalStoneAmount);

    setTotalPcs(pcs);
    setTotalGwt(gwt);
    setTotalNwt(nwt);
    setTotalAmt(totalAmount);
    setTotalGstAmt(totalGstAmount);
    setTotalNwtAmt(totalNwtAmount);
    setTotalWastAmt(totalWastAmount);
    setTotalMcAmt(totalMcAmount);
    setTotalItemCtsAmt(totalCtsAmount);
    setTotalItemUncAmt(totalUnCutsAmount);
    setTotalItemDiaAmt(totalItemDiaAmount);
    setTotalDiamondAmt(totalDiamondAmount);
    setGstNo(barCodeData[0]?.GSTRATE);
    setTotalPurAmt(totalPurAmount);
    setTotalPurGstAmt(totalPurGstAmount);
    setTotalPurNwtAmt(totalPurNwtAmount);
  }, [barCodeData, stonesData, totalAmounts]);

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
      NWT: nwt,
      WASTAGE: wastage ? wastage.toString() : "",
      DIRECTWT: 0,
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
      NWT: nwt,
      MAKINGCHARGES: mc ? mc.toString() : "",
      DIRECTAMT: 0,
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
  }, []);

  useEffect(() => {
    if (!barCodeData.length) return;

    const perData = barCodeData.map((barCode) => {
      const matched = wastageData.find((item) => item.TAGNO === barCode.TAGNO);
      const matchedMc = mcData.find((item) => item.TAGNO === barCode.TAGNO);

      const wastageAmt = matched?.TOTALWT
        ? Number(matched.TOTALWT)
        : Number(barCode.CATTOTWAST ?? 0);
      const mcAmount = matchedMc?.TOTALAMT
        ? Number(matchedMc.TOTALAMT)
        : Number(barCode.CATTOTMC ?? 0);
      const stoneAmount = Number(barCode.ITEM_TOTAMT ?? 0);
      const rateAmount =
        (Number(barCode.NWT ?? 0) + wastageAmt) * Number(barCode.RATE ?? 0);
      const totalAmount = rateAmount + mcAmount + stoneAmount;
      const gstAmount = (totalAmount * gstNo) / 100;
      const netAmount = totalAmount + gstAmount;

      return {
        TAGNO: barCode.TAGNO ?? "",
        TOTALAMT: Number(totalAmount.toFixed(2)),
        GSTTOTALAMT: Number(gstAmount.toFixed(2)),
        NETAMT: Number(netAmount.toFixed(2)),
      };
    });

    setTotalAmounts(perData);
  }, [wastageData, mcData, wastageOpen, mcOpen]);

  const EstNo = tagNo ? tagNo : estNo;

  const handleEposPrint = () => {
    printReceipt(
      localIp,
      EstNo,
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
      totalAmounts
    );
  };

  const handleEposPrintModule2 = () => {
    printReceiptModule2(
      localIp,
      EstNo,
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
      totalAmounts
    );
  };

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
                tagNoAPI();
                stonesDetailsAPI();
                setBarCode();
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
            <ScanOutlined
              onClick={handleOpenScanner}
              style={{
                fontSize: "30px",
                padding: "6px 5px",
                // color: !qrOpen ? "#162566" : "#eb14bcff",
              }}
            />
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
                  (item) => item.TAGNO === barCode.TAGNO
                );

                return (
                  <div className={styles.card}>
                    <div className={styles.header}>
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                          #{barCode?.TAGNO ? barCode?.TAGNO : "0"}
                        </span>
                        <br />
                        <small>Tag no</small>
                      </div>
                      {barCode?.VV != "-" && (
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
                            {barCode?.stonewt
                              ? barCode?.stonewt?.toFixed(3) + "g"
                              : "0.000g"}
                          </span>
                        </div>
                        <div className={styles.rowTag2}>
                          <span className={styles.label2}>Nwt</span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            {barCode?.NWT
                              ? barCode?.NWT?.toFixed(3) + "g"
                              : "0.000g"}
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
                            }}
                          >
                            {(() => {
                              // ✅ Check if wastageData has a matching TAGNO
                              const matched = wastageData.find(
                                (item) => item.TAGNO === barCode?.TAGNO
                              );

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
                              const matched = wastageData.find(
                                (item) => item.TAGNO === barCode?.TAGNO
                              );

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
                          <span
                            className={styles.label2}
                            onClick={() => {
                              handleMcOpen(barCode);
                              setMcTagNo(barCode?.TAGNO);
                            }}
                          >
                            {(() => {
                              // ✅ Check if wastageData has a matching TAGNO
                              const matched = mcData.find(
                                (item) => item.TAGNO === barCode?.TAGNO
                              );

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
                              const matched = mcData.find(
                                (item) => item.TAGNO === barCode?.TAGNO
                              );

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
                          <span className={styles.label2}>Mteal Value </span>
                          <span className={styles.separator2}>:</span>
                          <span className={styles.value2}>
                            ₹{" "}
                            {(
                              (barCode?.RATE ?? 0) * (barCode?.NWT ?? 0)
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
                            ₹{" "}
                            {barCode?.ITEM_TOTAMT
                              ? barCode?.ITEM_TOTAMT.toFixed(2)
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
                              {barCode?.Item_diamonds
                                ? barCode?.Item_diamonds?.toFixed(3)
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
                              {barCode?.Diamond_Amount
                                ? barCode?.Diamond_Amount?.toFixed(2)
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
                      <div>
                        Total Amount
                        <br />
                        <span className={styles.amount1}>
                          ₹
                          {matchedTotals
                            ? matchedTotals?.TOTALAMT.toFixed(2)
                            : 0.0}
                        </span>
                      </div>
                      <div>
                        Gst @ {gstNo || 0.0}%
                        <br />
                        <span className={styles.amount2}>
                          ₹
                          {matchedTotals
                            ? matchedTotals?.GSTTOTALAMT.toFixed(2)
                            : 0.0}
                        </span>
                      </div>
                      <div>
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
                          ₹{" "}
                          {barCode?.COST_FTOUCH
                            ? Number(barCode?.COST_FTOUCH).toFixed(2)
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
                    <div>
                      Gst @ {gstNo || 0.0}%
                      <br />
                      <span className={styles.amount3}>
                        ₹
                        {(
                          ((barCode?.COST_FTOUCH * barCode?.FINERATE +
                            barCode?.COST_MC +
                            barCode?.COST_STAMT) *
                            gstNo) /
                          100
                        )?.toFixed(2) || 0.0}
                      </span>
                    </div>
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
                            gstNo) /
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
            onClick={() => {
              if (barCodeData.length > 0) {
                if (tagNo) {
                  estimationDeleteData();
                  estimationDeleteMast();
                }
                if (barCodeData.length > 0) {
                  createEstimationData();
                  createEstimationMast();
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
        createEstimationData={createEstimationData}
        createEstimationMast={createEstimationMast}
        estimationDeleteData={estimationDeleteData}
        estimationDeleteMast={estimationDeleteMast}
        tagNo={tagNo}
      />
      <ModifyEstNo
        modifyOpen={modifyOpen}
        handleCancel={handleModifyCancel}
        modifyCode={modifyCode}
        setModifyCode={setModifyCode}
        estimationNoDataAPI={estimationNoDataAPI}
        estimationNoMastAPI={estimationNoMastAPI}
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
      />
      <MakingChargesDialog
        mcOpen={mcOpen}
        handleCancel={handleMcCancel}
        setMcData={setMcData}
        mcData={mcData}
        mcTagNo={mcTagNo}
      />
    </div>
  );
};

export default BarCodeCheck;
