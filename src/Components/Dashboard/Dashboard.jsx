import { HeartOutlined } from "@ant-design/icons";
import { CakeOutlined } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useMediaQuery } from "@mui/material";
import { Col, Row, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CREATE_jwel } from "../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import style from "./Dashboard.module.css";
import diamond from "./Images/diamond-image1.png";
import gold from "./Images/glod-image1.png";
import silver from "./Images/silver-image.png";
import CustomTooltip from "./CustomToolTip";

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [totalSaleBill, setTotalSaleBill] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [totalCard, setTotalCard] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalUpi, setTotalUpi] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [todayDues, setTodayDues] = useState(0);
  const [totalSalesGraph, setTotalSalesGraph] = useState([]);
  const [topTenInvoices, setTopTenInvoices] = useState([]);
  const [salesGraph, setSalesGraph] = useState([]);
  const [birthDayData, setBirthDayData] = useState([]);
  const [todayAnniversaryData, setTodayAnniversaryData] = useState([]);
  // const [imagesData, setImagesData] = useState([]);
  // const [userArea, setUserArea] = useState();
  // const [userName, setUserName] = useState();
  // const [singleImage, setSingleImage] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [todayRatesData, setTodayRatesData] = useState([]);
  const [currentRateIndex, setCurrentRateIndex] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalAdvance, setTotalAdvance] = useState(0);
  const [totalReceipt, setTotalReceipt] = useState(0);
  const [totalScheme, setTotalScheme] = useState(0);
  const [totalUrdGold, setTotalUrdGold] = useState(0);
  const [totalUrdGoldGram, setTotalUrdGoldGram] = useState(0);
  const [totalUrdSilver, setTotalUrdSilver] = useState(0);
  const [totalUrdSilverGram, setTotalUrdSilverGram] = useState(0);
  const [totalGoldBookAmount, setTotalGoldBookAmount] = useState(0);
  const [totalSilverBookAmount, setTotalSilverBookAmount] = useState(0);

  const imageUrls = localStorage.getItem("images")?.split(",");
  const imagesData = imageUrls?.length > 0 ? imageUrls : [];
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const colors = ["#FFBB28", "#FF8042", "#0088FE", "black"];
  const color = [
    "#162566",
    "#52bd91",
    "#cc92c1",
    "#d9dba4",
    "violet",
    "#75b7b3",
  ];

  const barColors = [
    "#162566",
    "#52bd91",
    "#cc92c1",
    "#d9dba4",
    "violet",
    "#75b7b3",
  ];

  const toggleDrawer = () => {
    setOpen(false);
  };

  const totalBalanceAPI = async () => {
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

      if (Array.isArray(data) && data.length > 0) {
        const totalDues = data.reduce((acc, item) => {
          const balance = Number(item.BalanceAmt) || 0;
          return acc + balance;
        }, 0);
        setTotalBalance(totalDues);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const todayDuesAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetTodayDues?date=${dayjs().format(
          "MM/DD/YYYY"
        )}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const todayDuesData = data.reduce((acc, item) => {
          const balance = Number(item.BalanceAmt) || 0;
          return acc + balance;
        }, 0);
        setTodayDues(todayDuesData);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TotalCashAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetCashBookCreditDebit?fromDate=${dayjs().format(
          "MM/DD/YYYY"
        )}&toDate=${dayjs().format("MM/DD/YYYY")}&saleCode=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setTotalCash(data[0].AMT || 0);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const collectionsAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetBankTransSummary?date=${dayjs().format(
          "MM/DD/YYYY"
        )}`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const cardData = data.find((item) => item.MODE === "CARD");
        const upiData = data.find((item) => item.MODE === "UPI");
        const onlineData = data.find((item) => item.MODE === "ONLINE");

        setTotalCard(cardData?.AMT || 0);
        setTotalUpi(upiData?.AMT || 0);
        setTotalOnline(onlineData?.AMT || 0);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TotalSalesGraphAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/DashBoard/GetTotalSaleValue?fromBillDate=${dayjs().format(
          "MM/DD/YYYY"
        )}&toBillDate=${dayjs().format("MM/DD/YYYY")}&saleCode=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const transformedData = data.map((item) => ({
          date: item.JewelType, // or any other label you want on the X-axis
          amt: item.NetAmt,
          TotGwt: item.TotGwt,
          TotNwt: item.TotNwt,
          TotPieces: item.TotPieces,
        }));
        setTotalSalesGraph(transformedData);
        setTotalSaleBill(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const TopTenInvoiceAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=BILL_MAST&where=BILLDATE='${dayjs().format(
          "MM/DD/YYYY"
        )}'&order=BILLNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      setTopTenInvoices(data);
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
  //       localStorage.setItem("images", imageUrls);
  //       localStorage.setItem("userName", data[0]?.FIRMNAME);
  //       localStorage.setItem("city", data[0]?.CITY);
  //       localStorage.setItem("singleImage", data[0]?.EPASS2);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching estimation count:", error);
  //   }
  // };

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

      if (Array.isArray(data) && data.length > 0) {
        setBirthDayData(data);
      }
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

      if (Array.isArray(data) && data.length > 0) {
        setTodayAnniversaryData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const todayRatesAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE='${dayjs().format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setTodayRatesData(data);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const orderAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=ORDER_MAST&where=ORDDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND ORDDATE<='${dayjs().format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.OrdNo, item])).values()
      );
      const totalAmount = uniqueData.reduce((acc, item) => {
        const orderAmt = Number(item.ORDAMT) || 0;
        return acc + orderAmt;
      }, 0);
      setTotalOrder(totalAmount);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const advanceAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=CUST_ADVANCES&where=RECDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND RECDATE<='${dayjs().format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.Recno, item])).values()
      );
      const totalAmount = uniqueData.reduce((acc, item) => {
        const advanceAmt = Number(item.TotWorth) || 0;
        return acc + advanceAmt;
      }, 0);
      setTotalAdvance(totalAmount);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDGoldAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=OLD_GPURCHASES_MAST&where=PDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND PDATE<='${dayjs().format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const urdGold = data.filter((item) => item.MNAME === "GOLD");
      const totalAmount = urdGold.reduce((acc, item) => {
        const Amount = Number(item.TotAmount) || 0;
        return acc + Amount;
      }, 0);
      setTotalUrdGold(totalAmount);
      const totalGrams = urdGold.reduce((acc, item) => {
        const grams = Number(item.TotGwt) || 0;
        return acc + grams;
      }, 0);
      setTotalUrdGoldGram(totalGrams);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDSilverAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=OLD_GPURCHASES_MAST&where=PDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND PDATE<='${dayjs().format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const urdSilver = data.filter((item) => item.MNAME === "SILVER");

      const totalAmount = urdSilver.reduce((acc, item) => {
        const amount = Number(item.TotAmount) || 0;
        return acc + amount;
      }, 0);
      setTotalUrdSilver(totalAmount);
      const totalGrams = urdSilver.reduce((acc, item) => {
        const grams = Number(item.TotGwt) || 0;
        return acc + grams;
      }, 0);
      setTotalUrdSilverGram(totalGrams);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const receiptAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPTS&where=RECDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND RECDATE<='${dayjs().format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.Recno, item])).values()
      );

      const totalAmount = uniqueData.reduce((acc, item) => {
        const receiptAmt = Number(item.TotWorth) || 0;
        return acc + receiptAmt;
      }, 0);
      setTotalReceipt(totalAmount);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const schemeAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPT_MAST&where=RECDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND RECDATE<='${dayjs().format("MM/DD/YYYY")}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalAmount = data.reduce((acc, item) => {
        const recAmt = Number(item.RecAmount) || 0;
        return acc + recAmt;
      }, 0);
      setTotalScheme(totalAmount);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDGoldBookAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='OLD' AND PARTICULARS='OLD GOLD' AND ENTRYDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND ENTRYDATE<='${dayjs().format("MM/DD/YYYY")}' AND DSTATUS=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalGoldBookAmount(totalCredit - totalDebit || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const URDSilverBookAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=STOCK_BOOK_NEW&where=MAINTYPE='OLD' AND PARTICULARS='OLD SILVER' AND ENTRYDATE>='${dayjs().format(
          "MM/DD/YYYY"
        )}' AND ENTRYDATE<='${dayjs().format("MM/DD/YYYY")}' AND DSTATUS=1`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      const totalCredit = data.reduce((acc, item) => {
        const creditAmount = Number(item.JAMA) || 0;
        return acc + creditAmount;
      }, 0);
      const totalDebit = data.reduce((acc, item) => {
        const debitAmount = Number(item.NAMA) || 0;
        return acc + debitAmount;
      }, 0);
      setTotalSilverBookAmount(totalCredit - totalDebit || 0);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const fetchTotalSaleAmt = async (date) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BILL_MAST&where=BILLDATE>='${dayjs(
          date
        ).format("MM/DD/YYYY")}' AND BILLDATE<='${dayjs(date).format(
          "MM/DD/YYYY"
        )}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      return Array.isArray(data) && data.length > 0
        ? data.reduce((acc, item) => {
            const balance = Number(item.NetAmt) || 0;
            return acc + balance;
          }, 0)
        : 0;
    } catch (error) {
      console.error("Error fetching sale amount for", date, ":", error);
      return 0;
    }
  };

  useEffect(() => {
    const loadSalesData = async () => {
      const dates = [0, 1, 2, 3].map((d) => dayjs().subtract(d, "day"));
      const results = await Promise.all(
        dates.map((date) =>
          fetchTotalSaleAmt(date).then((amt) => ({
            date: dayjs(date).format("DD-MMM"),
            amt: amt,
          }))
        )
      );
      // Reverse so oldest comes first (if needed)
      setSalesGraph(results.reverse());
    };

    loadSalesData();
    // const intervalId = setInterval(loadSalesData, 2000);

    // return () => clearInterval(intervalId);
  }, []);

  const collections = [
    { name: "Cash", amount: `₹ ${totalCash?.toFixed(2) || 0}` },
    { name: "Card", amount: `₹ ${totalCard?.toFixed(2) || 0}` },
    { name: "Online", amount: `₹ ${totalOnline?.toFixed(2) || 0}` },
    { name: "UPI", amount: `₹ ${totalUpi?.toFixed(2) || 0}` },
    {
      name: "URD Gold Book",
      amount: `₹ ${totalGoldBookAmount.toFixed(2) || 0}`,
    },
    {
      name: "URD Silver Book",
      amount: `₹ ${totalSilverBookAmount.toFixed(2) || 0}`,
    },
  ];

  const others = [
    { name: "Advances", amount: `₹ ${totalAdvance?.toFixed(2) || 0}` },
    { name: "Orders", amount: `₹ ${totalOrder?.toFixed(2) || 0}` },
    {
      name: "URD Gold",
      amount: `₹${totalUrdGold?.toFixed(2) || 0}`,
      grams: `${totalUrdGoldGram?.toFixed(3) || 0}g`,
    },
    {
      name: "URD Silver",
      amount: `₹${totalUrdSilver?.toFixed(2) || 0}`,
      grams: `${totalUrdSilverGram?.toFixed(3) || 0}g`,
    },
    { name: "Receipts", amount: `₹ ${totalReceipt?.toFixed(2) || 0}` },
    { name: "Scheme", amount: `₹ ${totalScheme?.toFixed(2) || 0}` },
  ];

  const salesData = [
    { month: "Jan", sales: 200 },
    { month: "Feb", sales: 150 },
    { month: "Mar", sales: 180 },
    { month: "Apr", sales: 220 },
    { month: "May", sales: 190 },
    { month: "Jun", sales: 240 },
  ];

  // useEffect(() => {
  //   const fetchData = () => {
  //     TotalCashAPI();
  //     TotalSalesGraphAPI();
  //     TopTenInvoiceAPI();
  //     collectionsAPI();
  //     birthDayAPI();
  //     anniversaryAPI();
  //     todayRatesAPI();
  //     totalBalanceAPI();
  //     todayDuesAPI();
  //     orderAPI();
  //     advanceAPI();
  //     receiptAPI();
  //     schemeAPI();
  //     URDGoldAPI();
  //     URDSilverAPI();
  //     URDGoldBookAPI();
  //     URDSilverBookAPI();
  //   };

  //   fetchData();

  //   const intervalId = setInterval(fetchData, 2000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");
  const defaultGraphData = [{ PTYPE: "No Data", AMOUNT: 0, QTY: 0 }];
  const defaultSalesGraphData = [{ PTYPE: "No Data", AMOUNT: 0 }];

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRateIndex((prevIndex) =>
        todayRatesData.length > 0 ? (prevIndex + 1) % todayRatesData.length : 0
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [todayRatesData]);

  const currentRate = todayRatesData[currentRateIndex];

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
      <div className={style.carouselContainer}>
        <div
          className={style.carouselSlider}
          style={{
            transform: `translateX(-${currentIndex * 100}vw)`,
            width: `${imagesData.length * 100}%`,
          }}
        >
          {imagesData.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`img-${index}`}
              className={style.carouselImage}
            />
          ))}
        </div>
      </div>
      {/* <div className={style.dashboardContainer}>
        <div className={style.headerContainer}>
          <h3 className={style.heading}>Today Rates</h3>
          <div className={style.rateCard}>
            {currentRate && (
              <div className={style.rateItem}>
                <span>
                  {currentRate.PREFIX +
                    " " +
                    currentRate.MAINPRODUCT +
                    " " +
                    "-" +
                    " " +
                    currentRate.RATE.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          {totalSaleBill?.length === 0 ? (
            <div></div>
          ) : (
            totalSaleBill.map((sale, index) => (
              <div className={style.salesCard}>
                <div className={style.salesHeader}>{sale?.JewelType}</div>
                <div
                  className={
                    sale.JewelType?.split(" ")[0] === "GOLD"
                      ? style.salesContentGold
                      : sale.JewelType?.split(" ")[0] === "SILVER"
                      ? style.salesContentSilver
                      : sale.JewelType?.split(" ")[0] === "DIAMOND" ||
                        sale.JewelType?.split(" ")[0] === "DIAMONDS"
                      ? style.salesContentDiamond
                      : style.salesContent
                  }
                >
                  <Row justify="space-between">
                    <Typography.Text className={style.salesText}>
                      Bills: <b>{sale?.BillCount ? sale?.BillCount : 0}</b>
                    </Typography.Text>
                    <Typography.Text className={style.salesText}>
                      Gwt:{" "}
                      <b>
                        {sale?.TotGwt
                          ? sale?.TotGwt?.toFixed(3) + "g"
                          : 0.0 + "g"}
                      </b>
                    </Typography.Text>
                  </Row>
                  <Row justify="space-between">
                    <Typography.Text className={style.salesText}>
                      Pieces: <b>{sale?.TotPieces ? sale?.TotPieces : 0}</b>
                    </Typography.Text>
                    <Typography.Text className={style.salesText}>
                      Nwt:{" "}
                      <b>
                        {sale?.TotNwt
                          ? sale?.TotNwt?.toFixed(3) + "g"
                          : 0.0 + "g"}
                      </b>
                    </Typography.Text>
                  </Row>
                  <Row justify="center">
                    <Typography.Text className={style.salesText}>
                      Value:{" "}
                      <b>₹ {sale?.NetAmt ? sale?.NetAmt?.toFixed(2) : 0}</b>
                    </Typography.Text>
                  </Row>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={style.totalSalesTitle}>Total Sales</div>
        <div className={style.barChartContainer}>
          <BarChart
            width={500}
            height={300}
            data={
              totalSalesGraph.length ? totalSalesGraph : [{ date: "", amt: 0 }]
            }
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 14, fontWeight: "bold", fill: "#555" }}
            />
            <YAxis domain={[0, 1000]} />
            {totalSalesGraph.length && <Tooltip content={<CustomTooltip />} />}
            <Bar
              dataKey="amt"
              fill="#8884d8"
              label={{ position: "top" }}
              barSize={60}
            >
              {(totalSalesGraph.length ? totalSalesGraph : [{ amt: 0 }]).map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={color[index % color.length]}
                  />
                )
              )}
            </Bar>
          </BarChart>
        </div>
        <div className={style.totalPurchasesTitle}>
          Sales Over the Last{" "}
          <sapn style={{ fontWeight: "bold", color: "red" }}>4</sapn> Days
        </div>
        <div className={style.barChartContainer}>
          <BarChart
            width={500}
            height={300}
            data={salesGraph?.length ? salesGraph : [{ date: "", amt: 0 }]}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 14, fontWeight: "bold", fill: "#555" }}
            />
            <YAxis domain={[0, 1000]} />
            <Bar
              dataKey="amt"
              fill="#8884d8"
              shape={<TriangleBar />}
              label={{ position: "top" }}
              barSize={60}
            >
              {(salesGraph.length ? salesGraph : [{ amt: 0 }]).map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                )
              )}
            </Bar>
          </BarChart>
        </div>
        <div className={style.othersTitle}>Others</div>
        <Row gutter={[16, 16]} justify="center">
          {others.slice(0, 3).map((item, index) => (
            <Col
              key={index}
              xs={8}
              sm={8}
              md={8}
              lg={4}
              className={style.otherCol}
            >
              <div className={style.otherCard}>
                <Typography.Text className={style.otherText}>
                  {item.name}
                </Typography.Text>
                <Typography.Title level={5} className={style.otherAmount}>
                  <span className={style.inlineAmount}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "red",
                        fontSize: "12px",
                        visibility: item.grams ? "visible" : "hidden",
                      }}
                    >
                      {item.grams || "XX"}
                    </span>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                      {item.amount}
                    </span>
                  </span>
                </Typography.Title>
              </div>
            </Col>
          ))}
        </Row>

        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "15px" }}
        >
          {others.slice(3, 6).map((item, index) => (
            <Col
              key={index}
              xs={8}
              sm={8}
              md={8}
              lg={4}
              className={style.otherCol}
            >
              <div className={style.otherCard}>
                <Typography.Text className={style.otherText}>
                  {item.name}
                </Typography.Text>
                <Typography.Title level={5} className={style.otherAmount}>
                  <span className={style.inlineAmount}>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "red",
                        fontSize: "12px",
                        visibility: item.grams ? "visible" : "hidden",
                      }}
                    >
                      {item.grams || "XX"}
                    </span>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                      {item.amount}
                    </span>
                  </span>
                </Typography.Title>
              </div>
            </Col>
          ))}
        </Row>
        <div className={style.collectionsTitle}>Collections</div>
        <Row gutter={[16, 16]} justify="center">
          {collections.slice(0, 3).map((item, index) => (
            <Col
              key={index}
              xs={8}
              sm={8}
              md={8}
              lg={4}
              className={style.collectionCol}
            >
              <div bordered className={style.collectionCard}>
                <Typography.Text className={style.collectionText}>
                  {item.name}
                </Typography.Text>
                <Typography.Title level={5} className={style.collectionAmount}>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {item.amount}
                  </span>
                </Typography.Title>
              </div>
            </Col>
          ))}
        </Row>
        <Row
          gutter={[16, 16]}
          justify="center"
          style={{ marginBottom: "15px" }}
        >
          {collections.slice(3, 6).map((item, index) => (
            <Col
              key={index}
              xs={8}
              sm={8}
              md={8}
              lg={4}
              className={style.collectionCol}
            >
              <div bordered className={style.collectionCard}>
                <Typography.Text className={style.collectionText}>
                  {item.name}
                </Typography.Text>
                <Typography.Title level={5} className={style.collectionAmount}>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {item.amount}
                  </span>
                </Typography.Title>
              </div>
            </Col>
          ))}
        </Row>
        <div className={style.dashboardRow}>
          <div className={style.eventCardGroup}>
            <div className={style.eventCard}>
              <div className={style.eventItem}>
                <CakeOutlined
                  className={`${style.icon} ${style.birthdayIcon}`}
                />
                <p className={style.title}>Birthday</p>
                <p className={style.count}>{birthDayData.length}</p>
                <button
                  className={style.checkButton}
                  onClick={() => navigate("/crm")}
                >
                  Check &gt;
                </button>
              </div>

              <div className={style.eventItem}>
                <HeartOutlined
                  className={`${style.annicon} ${style.anniversaryIcon}`}
                />
                <p className={style.title}>Anniversary</p>
                <p className={style.count}>{todayAnniversaryData.length}</p>
                <button
                  className={style.checkButton}
                  onClick={() => navigate("/crm")}
                >
                  Check &gt;
                </button>
              </div>
            </div>
          </div>
          <div className={style.dueCardGroup}>
            <div className={style.dueCard}>
              <div className={style.dueTitle}>
                <PaymentsIcon style={{ color: "rgb(20, 200, 250)" }} /> Today's
                Due:
              </div>
              <div className={style.dueAmount}>
                ₹ {todayDues?.toFixed(2) || 0.0}
              </div>
            </div>

            <div className={style.dueCard}>
              <div className={style.dueTitle}>
                <PaymentIcon style={{ color: "rgb(250, 127, 20)" }} /> Total
                Due:
              </div>
              <div className={style.dueAmount}>
                ₹ {totalBalance?.toFixed(2) || 0.0}
              </div>
            </div>
          </div>
        </div>
        <div className={style.invoicesTitle}>INVOICES</div>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            whiteSpace: "nowrap",
            padding: "5px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {topTenInvoices.map((invoice) => (
              <div
                key={invoice.id}
                style={{
                  minWidth: "320px",
                  background:
                    invoice.JewelType?.split(" ")[0] === "GOLD"
                      ? " #fef6e4"
                      : invoice.JewelType?.split(" ")[0] === "SILVER"
                      ? " #D4D4D4"
                      : invoice.JewelType?.split(" ")[0] === "DIAMOND" ||
                        invoice.JewelType?.split(" ")[0] === "DIAMONDS"
                      ? " #c4b8ca"
                      : "lightblue",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  color: "#1a1a1a",
                  fontFamily: "sans-serif",
                }}
              >
                <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                  Invoice No:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {invoice.BillNo}
                  </span>
                </div>

                <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                  Name:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {invoice.CustName}
                  </span>
                </div>

                <div style={{ fontSize: "12px", marginBottom: "6px" }}>
                  Pieces:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {" "}
                    {invoice.TotPieces}{" "}
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
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {invoice.TotNwt.toFixed(3)}g
                    </span>
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    Gwt:{" "}
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {invoice.TotGwt.toFixed(3)}g
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
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {invoice.Item_Diamonds.toFixed(3)}
                    </span>
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    Dia.Amt:{" "}
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      ₹ {invoice.Diamond_Amount.toFixed(2)}
                    </span>
                  </span>
                </div>

                <hr style={{ borderTop: "2px solid #aaa", margin: "10px 0" }} />

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "14px" }}>
                    Amount:{" "}
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      ₹ {invoice.BillAmt.toFixed(2)}
                    </span>
                  </span>
                  <span style={{ fontSize: "14px" }}>
                    Time:
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {dayjs(invoice.BillTime).format("HH:mm")}
                    </span>
                  </span>
                </div>
                {invoice.JewelType?.split(" ")[0] === "GOLD" ||
                invoice.JewelType?.split(" ")[0] === "SILVER" ||
                invoice.JewelType?.split(" ")[0] === "DIAMOND" ||
                invoice.JewelType?.split(" ")[0] === "DIAMONDS" ? (
                  <img
                    src={
                      invoice.JewelType?.split(" ")[0] === "GOLD"
                        ? gold
                        : invoice.JewelType?.split(" ")[0] === "SILVER"
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
          </div>
        </div>
      </div> */}
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
    </div>
  );
};

export default Dashboard;
